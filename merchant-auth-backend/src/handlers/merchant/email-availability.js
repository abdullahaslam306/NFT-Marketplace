/**
 * Handler to check email status
 */
const Vandium = require('vandium');
const ld = require('lodash');
const JsonSerializer = require('jsonapi-serializer').Serializer;
const { helpers } = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const validationMessages = require('../../common/validation-code');

const {
  success: successResponse,
  error: errorResponse,
} = helpers.responses;

/**
 * Serialize Email Availability Response
 * @param {Object} data
 */
const serialize = data => {
  const serializationSchema = ({
    attributes: [
      'emailExists',
      'isMerchant',
      'isCustomer',
    ],
    keyForAttribute: 'camelCase',
  });
  return new JsonSerializer('EmailStatus', serializationSchema).serialize(data);
};

/**
 * Check User Email Availability Handler
 * @param {Object} event
 * @param {Object} context
 * @param {Object} connection
 */
const action = async (event, context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const email = ld.get(event, 'queryStringParameters.email', false);
  let response = null;

  try {
    let isCustomer = false;
    let isMerchant = false;
    let emailExists = false;
    const userRepo = new repositories.User(connection);
    const merchantRepo = new repositories.Merchant(connection);
    const customerRepo = new repositories.Customer(connection);

    const user = await userRepo.getByEmail(email, false);
    if (user instanceof connection.user) {
      const userId = userRepo.getId(user);
      const merchant = await merchantRepo.getByUserId(userId, false);
      emailExists = true;

      if (merchant instanceof connection.merchant) {
        isMerchant = true;
      }

      const customer = await customerRepo.getByUserId(userId, false);
      if (customer instanceof connection.customer) {
        isCustomer = true;
      }
    }
    const data = {
      emailExists,
      isCustomer,
      isMerchant,
    };
    response = await successResponse('EmailStatus', serialize(data));
  } catch (exp) {
    pino.error(exp, 'Exception in getting email status for user');
    response = await errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => ({
  queryStringParameters: {
    email: Vandium.types.string().email().trim()
      .required()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_info')),
  },
});

module.exports = {
  action,
  validationSchema,
};
