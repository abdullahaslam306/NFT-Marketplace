/**
 *  handler to create new ethereum wallets
 */

const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { helpers } = require('backend-utility');
const { repositories } = require('data-access-utility');
const { UserWallet, UserWalletRepo } = require('dynamo-access-utility');

const { walletHelper } = require('../../helpers');

const { generateDataKeys, createKmsRootKey } = helpers.kms;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { getUserId } = helpers.functions;

const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  let response;
  let transaction;
  let createdDataKeysCount = 0;
  const userWallet = new UserWalletRepo();

  try {
    const userId = getUserId(context);

    const kmsKeysRepo = new repositories.KmsKeys(connection);

    transaction = await connection.sequelize.transaction();

    let kmsKey = await kmsKeysRepo.getByCreatedDataKeysCount(false);
    if (kmsKey) {
      createdDataKeysCount = await kmsKeysRepo.getCreatedDataKeys(kmsKey);
      kmsKey = await kmsKeysRepo.getKmsKey(kmsKey);
    } else {
      kmsKey = await createKmsRootKey();
    }

    const createdWallet = await walletHelper.createWallet();
    const dataKeys = await generateDataKeys(kmsKey);

    let walletToEncrypt = {
      privateKey: createdWallet.privateKey,
      mnemonics: createdWallet.mnemonics,
    };

    // Encrypting wallet private key and Mnemonics
    walletToEncrypt = JSON.stringify(walletToEncrypt);
    const encryptedWallet = await walletHelper.encryptData(
      dataKeys.Plaintext,
      Buffer.from(walletToEncrypt, 'utf8'),
    );

    // Deleting all the private information after storing it.
    delete createdWallet.privateKey;
    delete createdWallet.mnemonics;
    delete dataKeys.Plaintext;

    const rootKey = kmsKey;
    const dataKey = dataKeys.CiphertextBlob;
    const privateData = encryptedWallet;

    const wallet = new UserWallet(userId, rootKey, dataKey, privateData);
    await userWallet.upsert(wallet);

    createdDataKeysCount += 1;

    await kmsKeysRepo.upsert(
      kmsKey,
      createdDataKeysCount,
      true,
      null,
      transaction,
    );

    transaction.commit();
    response = successResponse('Wallet Created', createdWallet);
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

module.exports = {
  action,
};
