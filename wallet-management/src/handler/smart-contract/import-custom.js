/**
 * Handler to import custom smart contracts
 */

const ld = require('lodash');
const Vandium = require('vandium');
const Moralis = require('moralis/node');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const {
  CommonError, errors, configs, helpers,
} = require('backend-utility');

const { validationMessages } = require('../../common/validation-code/en');

const { defaults, enums, pubnubNotifications } = configs;
const {
  responses, functions, joi, PubNub,
} = helpers;
const { getUserId, getUserUid, isValid } = functions;
const { MoralisApiWaitTime, MoralisApiRetryCount } = defaults;
const { error: errorResponse, success: successResponse } = responses;
const {
  MORALIS_API_CHAIN,
  MORALIS_APP_ID: appId,
  MORALIS_SERVER_URL: serverUrl,
  PUBNUB_PUBLISH_KEY: publishKey,
  PUBNUB_SUBSCRIBE_KEY: subscribeKey,
} = process.env;
const { SmartContractTypes, SmartContractIdentity } = enums;
const { ImportSmartContractFailureException, SmartContractAlreadyExistsException } = errors.codes;
const { CUSTOM } = SmartContractTypes;
const { EXTERNAL } = SmartContractIdentity;
const { AddSmartContractNotificaiton } = pubnubNotifications;
const { title, message } = AddSmartContractNotificaiton;

/**
 * Get meta data of contract address
 * @param contractAddress
 * @returns
 */
const getTokenMetaData = async contractAddress => {
  let metaData = null;
  let count = 0;

  Moralis.start({ serverUrl, appId });

  while (count <= MoralisApiRetryCount) {
    try {
      const options = { chain: MORALIS_API_CHAIN, address: contractAddress };
      metaData = await Moralis.Web3API.token.getNFTMetadata(options);
      break;
    } catch (error) {
      pino.error(error);
      setTimeout(() => { }, MoralisApiWaitTime);
      count += 1;
      pino.info(`Retry No ${count}: Fetch token meta data`);
    }
  }
  return metaData;
};

/**
 * Import custom smart contract handler
 * @param event
 * @param context
 * @param connection
 */
const action = async (event, context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response;

  try {
    let smartContractId;
    const userId = getUserId(context);
    const contractAddress = ld.get(event.body, 'address', null);

    const smartContractRepo = new repositories.SmartContract(connection);
    const smartContractAbiRepo = new repositories.SmartContractAbi(connection);
    const userSmartContractRepo = new repositories.UserSmartContract(connection);

    await connection.sequelize.transaction(async transaction => {
      const existingSmartContract = await smartContractRepo.getByCriteria(null, null, null, null, null, false, null, contractAddress, true);

      if (isValid(existingSmartContract) === true) {
        smartContractId = smartContractRepo.getId(existingSmartContract);
        const userSmartContract = await userSmartContractRepo.getByCriteria(userId, smartContractId, false);

        if (isValid(userSmartContract) === true) {
          throw new CommonError(SmartContractAlreadyExistsException);
        }
      } else {
        const tokenMetaData = await getTokenMetaData(contractAddress);

        if (isValid(tokenMetaData) === false || (isValid(tokenMetaData) === true && isValid(tokenMetaData.contract_type)) === false) {
          throw new CommonError(ImportSmartContractFailureException);
        }

        let platformName = tokenMetaData.name;

        if (isValid(platformName) === false) {
          const totalSmartContracts = await smartContractRepo.getTotalUserSmartContracts(userId, CUSTOM, EXTERNAL);
          platformName = `Custom Smart Contract ${totalSmartContracts + 1}`;
        }

        const tokenProtocol = tokenMetaData.contract_type.toLowerCase();
        const smartContractAbi = await smartContractAbiRepo.getByTokenProtocol(tokenProtocol);
        const smartContractAbiId = smartContractAbiRepo.getId(smartContractAbi);
        const smartContract = await smartContractRepo.create(contractAddress, platformName, tokenProtocol, CUSTOM, EXTERNAL, true, transaction, null, null, smartContractAbiId);
        smartContractId = smartContractRepo.getId(smartContract);
      }

      await userSmartContractRepo.create(smartContractId, userId, transaction);
    });

    response = await successResponse('ImportSmartContract', 'Smart contract imported successfully.');

    const pubnub = new PubNub(publishKey, subscribeKey);
    const userUid = getUserUid(context);
    const notification = { title, message: `${message} ${contractAddress}.` };
    await pubnub.publishMessage(userUid, notification);
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request Validation Schema
 */
const validationSchema = () => ({
  body: {
    address: Vandium.types.string().trim().required()
      .custom(joi.customValidationEthAddress)
      .error(validationErrors => joi.makeValidationMessage(validationMessages, validationErrors, 'smart_contract')),
  },
});

module.exports = {
  action,
  validationSchema,
};
