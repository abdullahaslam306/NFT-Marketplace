/**
 * Handler to check unique username
 */
const Vandium = require('vandium');
const ld = require('lodash');
const JsonSerializer = require('jsonapi-serializer').Serializer;
const { helpers, errors, CommonError } = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const validationMessages = require('../../common/validation-code');

const { UsernameAlreadyExists } = errors.codes;
const {
  success: successResponse,
  error: errorResponse,
} = helpers.responses;

/**
 * Serialize Unique Username Response
 * @param {Object} data
 */
const serialize = data => {
  const serializationSchema = ({
    attributes: [
      'isAvailable',
    ],
    keyForAttribute: 'camelCase',
  });
  return new JsonSerializer('UniqueUsername', serializationSchema).serialize(data);
};

/**
 * Check Username Availability Handler
 * @param {Object} event
 * @param {Object} context
 * @param {Object} connection
 */
const action = async (event, context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const username = ld.get(event, 'queryStringParameters.username', null);
  let response = null;

  try {
    const userRepo = new repositories.User(connection);

    const user = await userRepo.getByUsername(username, false);
    if (user instanceof connection.user) {
      throw new CommonError(UsernameAlreadyExists);
    }

    const data = {
      isAvailable: true,
    };

    response = await successResponse('UniqueUsername', serialize(data));
  } catch (exp) {
    pino.error(exp, 'Exception in getting unique username for user');
    response = await errorResponse(exp);
  }
  return response;
};

/**
 * Request Validation Schema
 */
const validationSchema = () => {
  // eslint-disable-next-line no-useless-escape
  const regexUsername = /^[\w\-]+$/;
  return {
    queryStringParameters: {
      username: Vandium.types.string().max(100).min(5)
        .regex(regexUsername)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
