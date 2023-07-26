/**
 * Handler to update wallet
 */
const ld = require('lodash');
const Vandium = require('vandium');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const {
  helpers, configs, errors, CommonError,
} = require('backend-utility');

const { validationMessages } = require('../../common/validation-code/en');

const { enums, pubnubNotifications } = configs;
const {
  PubNub, functions, lambda, responses,
} = helpers;

const {
  isValid, isValidObject, getUserId, getUserUid,
} = functions;
const { EmptyAttributeException } = errors.codes;
const { UpdateWalletSuccess } = configs.responses;
const { LambdaInvocationType, MoralisWatchType, WalletStatus } = enums;
const { WATCH, UNWATCH } = MoralisWatchType;
const { CONNECTED, DISCONNECTED } = WalletStatus;
const { error: errorResponse, success: successResponse } = responses;
const { code: updateWalletSuccessCode, message: updateWalletSuccessMessage } = UpdateWalletSuccess;

const { title, message } = pubnubNotifications.DisconnectWalletNotification;
const {
  STAGE, REGION, PUBNUB_PUBLISH_KEY: publishKey, PUBNUB_SUBSCRIBE_KEY: subscribeKey,
} = process.env;

/**
 * Update wallet handler
 * @param event
 * @param context
 */
const action = async (event, context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let response = null;
  try {
    const walletName = ld.get(event, 'body.name', null);
    const walletStatus = ld.get(event, 'body.status', null);
    const walletUid = ld.get(event, 'pathParameters.uid', null);
    const userId = getUserId(context);

    if (isValid(walletName) === false && isValid(walletStatus) === false) {
      throw new CommonError(EmptyAttributeException);
    }

    const walletRepo = new repositories.Wallet(connection);

    const wallet = await walletRepo.getByUid(walletUid, userId);
    const walletAddress = walletRepo.getAddress(wallet);
    await walletRepo.update(wallet, walletName, walletStatus);

    let payload = {
      walletAddress,
    };

    switch (walletStatus) {
      case CONNECTED:
        payload.action = WATCH;
        break;
      case DISCONNECTED:
        payload.action = UNWATCH;
        break;
      default:
        payload = null;
        break;
    }

    if (isValidObject(payload) === true) {
      await lambda.invoke(`blockchain-syncing-backend-${STAGE}-UpdateMoralisWatch`, payload, LambdaInvocationType.EVENT, REGION, 3106);
    }

    response = successResponse(updateWalletSuccessCode, updateWalletSuccessMessage);

    if (isValid(walletStatus) === true && walletStatus === 'disconnected') {
      const userUid = getUserUid(context);
      const pubnub = new PubNub(publishKey, subscribeKey);
      const notification = { title, message: `${message} ${wallet.dataValues.address}.` };
      await pubnub.publishMessage(userUid, notification);
    }
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () =>
// eslint-disable-next-line no-useless-escape
  ({
    pathParameters: {
      uid: Vandium.types.string().trim().guid({ version: 'uuidv4' }).required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_wallet')),
    },
    body: {
      name: Vandium.types.string().max(255)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_wallet')),
      status: Vandium.types.string().trim().allow(CONNECTED, DISCONNECTED).only()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_wallet')),
    },
  });

module.exports = {
  action,
  validationSchema,
};
