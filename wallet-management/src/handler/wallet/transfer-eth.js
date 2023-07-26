/**
 *  handler for transfering ethers
 */

const Vandium = require('vandium');
const { helpers, configs } = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { UserWalletRepo } = require('dynamo-access-utility');
const { blockchain } = require('../../services');
const { walletHelper } = require('../../helpers');
const { validationMessages } = require('../../common/validation-code/en');

const { NETWORK_URL } = process.env;
const { decryptDataKeys } = helpers.kms;
const { MfaTransactionAction } = configs.enums;
const { getUserId, getOtpCodeRegex } = helpers.functions;
const { success: successResponse, error: errorResponse } = helpers.responses;

const action = async (event, context, connection) => {
  let response;
  let transaction;
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const userId = getUserId(context);
    const userWallet = new UserWalletRepo();

    const {
      emailCode,
      phoneCode,
      transactionUid,
      value: cryptoValue,
      to: destinationWalletAddress,
    } = event.body;

    transaction = await connection.sequelize.transaction();

    const mfaTransactionRepo = new repositories.MfaTransaction(connection);
    // Validates given codes
    const mfaTransaction = await mfaTransactionRepo.verifyCodes(
      transactionUid,
      emailCode,
      phoneCode,
      MfaTransactionAction.SEND_CRYPTO,
    );

    // Getting Keys from Dynamo and Decrypting them
    const userEncryptedData = await userWallet.getUserWallet(userId);
    const encryptedDataKey = userEncryptedData.data_key;
    const KeyId = userEncryptedData.root_key;

    const decryptedDataKey = await decryptDataKeys(encryptedDataKey, KeyId);
    const userDecryptedWallet = await walletHelper.decryptData(
      decryptedDataKey.Plaintext,
      userEncryptedData.private_data,
    );
    const wallet = JSON.parse(userDecryptedWallet.toString());
    const walletPrivateKey = wallet.privateKey;

    // Interacting with blockchain to transfer the funds
    const transactionResponse = await blockchain.transferEther(
      walletPrivateKey,
      destinationWalletAddress,
      cryptoValue.toString(),
    );

    await mfaTransactionRepo.setVerifiedAt(mfaTransaction, transaction);

    const transactionHash = transactionResponse?.hash;
    const responseData = {
      transactionHash,
      url: `${NETWORK_URL}tx/${transactionHash}`,
    };

    response = successResponse('CryptoTransfered', responseData);
    transaction.commit();
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
    transaction.rollback();
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => {
  const regexCode = getOtpCodeRegex();
  return {
    body: {
      transactionUid: Vandium.types
        .string()
        .trim()
        .guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'transfer_crypto',
          )),
      emailCode: Vandium.types
        .string()
        .trim()
        .regex(regexCode)
        .required()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'transfer_crypto',
          )),
      phoneCode: Vandium.types
        .string()
        .trim()
        .regex(regexCode)
        .required()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'transfer_crypto',
          )),
      to: Vandium.types
        .string()
        .trim()
        .custom(helpers.joi.customValidationEthAddress)
        .required()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'wallet_address',
          )),
      value: Vandium.types
        .number()
        .precision(18)
        .min(0)
        .positive()
        .required()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'transfer_crypto',
          )),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
