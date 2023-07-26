/**
 *  handler for adding a wallet  against a user
 */
const ld = require('lodash');
const Vandium = require('vandium');
const {
  helpers, CommonError, errors, configs,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { validationMessages } = require('../../common/validation-code/en');

const { PubNub, lambda } = helpers;
const { enums, responses, pubnubNotifications } = configs;
const { AddWallet } = responses;
const {
  BlockChainNetwork, LambdaInvocationType, MoralisWatchType, WalletTypes, WalletStatus,
} = enums;
const { WATCH, UNWATCH } = MoralisWatchType;
const { DISCONNECTED, CONNECTED } = WalletStatus;
const { WalletAddressAlreadyExistException } = errors.codes;
const { isValidObject, getUserId, getUserUid } = helpers.functions;
const { title, message } = pubnubNotifications.AddWalletNotification;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { code: addWalletSuccessCode, message: addWalletSuccessMessage } = AddWallet;
const {
  STAGE, REGION, PUBNUB_PUBLISH_KEY: publishKey, PUBNUB_SUBSCRIBE_KEY: subscribeKey,
} = process.env;

/**
 * Generate the meta mask wallet name against a user
 * @param {Wallet} walletRepo
 * @param {number} userId
 * @returns Name of external wallet
 */
const generateExternalWalletName = async (walletRepo, userId) => {
  const totalWallets = await walletRepo.getTotalUserWallets(userId, WalletTypes.EXTERNAL);
  return `Metamask wallet ${totalWallets + 1}`;
};

const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  let response;
  try {
    const address = ld.get(event, 'body.address', null);
    const userId = getUserId(context);
    const userUid = getUserUid(context);
    const walletRepo = new repositories.Wallet(connection);

    const wallet = await walletRepo.getByAddress(address, BlockChainNetwork.ETHEREUM, userId, false);
    const walletStatus = walletRepo.getStatus(wallet);
    const walletAddress = walletRepo.getAddress(wallet);
    let payload = {
      action: WATCH,
      walletAddress,
    };

    switch (walletStatus) {
      case CONNECTED:
        payload = null;
        throw new CommonError(WalletAddressAlreadyExistException);
      case DISCONNECTED:
        await walletRepo.update(wallet, null, CONNECTED);
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        const name = await generateExternalWalletName(walletRepo, userId);
        await walletRepo.create(userId, address, name, WalletTypes.EXTERNAL);
    }

    if (isValidObject(payload) === true) {
      await lambda.invoke(`blockchain-syncing-backend-${STAGE}-UpdateMoralisWatch`, payload, LambdaInvocationType.EVENT, REGION, 3106);
    }
    response = successResponse(addWalletSuccessCode, addWalletSuccessMessage);

    const pubnub = new PubNub(publishKey, subscribeKey);
    const notification = { title, message: `${message} ${address}.` };
    await pubnub.publishMessage(userUid, notification);
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => ({
  body: {
    address: Vandium.types.string().trim().required()
      .custom(helpers.joi.customValidationEthAddress)
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'add_wallet')),
  },
});

module.exports = {
  action,
  validationSchema,
};
