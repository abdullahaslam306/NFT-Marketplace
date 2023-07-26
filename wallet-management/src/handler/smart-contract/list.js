/**
 * Handler to get list of user smart contract
 */
const Vandium = require('vandium');
const { Serializer } = require('jsonapi-serializer');
const { repositories } = require('data-access-utility');
const { helpers, configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const { validationMessages } = require('../../common/validation-code/en');

const { pagination } = configs.defaults;
const { responses, functions } = helpers;
const { getUserId } = functions;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Get users smart contract handler
 * @param event
 * @param context
 */

const action = async (event, context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response = null;
  try {
    const limit = event?.queryStringParameters?.limit || pagination.limit;
    const offset = event?.queryStringParameters?.offset || pagination.offset;

    const userId = getUserId(context);
    const smartContractRepo = new repositories.SmartContract(connection);
    const { count, rows: smartContracts } = await smartContractRepo.getAllByCriteria(userId, null, null, null, true, true, null, true, true, offset, limit);

    response = successResponse('SmartContracts', serialize(smartContracts, offset, limit, count));
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Serialize wallets response
 * @param {Object} data
 */
function serialize(data, offset, limit, totalRecords) {
  const serializerSchema = ({
    meta: {
      offset,
      limit: (offset === -1) ? null : limit,
      totalRecords,
    },
    id: 'uid',
    attributes: [
      'name',
      'address',
      'platform_name',
      'platform_logo',
      'token_protocol',
      'type',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('SmartContracts', serializerSchema).serialize(data);
}

/**
 * Request validation schema
 */
const validationSchema = () => ({
  queryStringParameters: {
    offset: Vandium.types.number().integer().min(0)
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
    limit: Vandium.types.number().integer().min(1)
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
  },
});

module.exports = {
  action,
  validationSchema,
};
