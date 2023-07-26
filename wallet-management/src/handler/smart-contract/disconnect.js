/**
 * Handler to disconnect users smart contract
 */
const ld = require('lodash');
const Vandium = require('vandium');
const { repositories } = require('data-access-utility');
const { helpers, configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { validationMessages } = require('../../common/validation-code/en');

const { responses, functions, PubNub } = helpers;
const { getUserId, getUserUid } = functions;
const { DisconnectSmartContract } = configs.responses;
const { DisconnectSmartContractNotification } = configs.pubnubNotifications;
const { error: errorResponse, success: successResponse } = responses;
const { code: disconnectSmartContractSuccessCode, message: disconnectSmartContractSuccessMessage } = DisconnectSmartContract;
const { title, message } = DisconnectSmartContractNotification;
const {
  PUBNUB_PUBLISH_KEY: publishKey,
  PUBNUB_SUBSCRIBE_KEY: subscribeKey,
} = process.env;

/**
 * Disconnect smart contract handler
 * @param event
 * @param context
 * @param connection
 */
const action = async (event, context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let response = null;
  try {
    const smartContractUid = ld.get(event, 'pathParameters.uid', null);
    const userId = getUserId(context);
    const userUid = getUserUid(context);
    const smartContractRepo = new repositories.SmartContract(connection);

    const smartContract = await smartContractRepo.getByUid(smartContractUid);
    const smartContractId = smartContractRepo.getId(smartContract);
    const userSmartContractRepo = new repositories.UserSmartContract(connection);
    const userSmartContract = await userSmartContractRepo.getByCriteria(userId, smartContractId);

    await userSmartContractRepo.delete(userSmartContract);

    const pubnub = new PubNub(publishKey, subscribeKey);
    const notification = { title, message: `${message} ${smartContract.dataValues.address}.` };
    await pubnub.publishMessage(userUid, notification);

    response = successResponse(disconnectSmartContractSuccessCode, disconnectSmartContractSuccessMessage);
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
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'smart_contract')),
    },
  });

module.exports = {
  action,
  validationSchema,
};
