/**
 * Handler to merchant info
 */
const { helpers } = require('backend-utility');
const { repositories } = require('data-access-utility');
const JsonSerializer = require('jsonapi-serializer').Serializer;

const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { functions, responses } = helpers;
const { getUserId } = functions;
const { error, success: successResponse } = responses;

/**
  * Get merchant info handler
  * @param {Object} event
  * @param {Object} context
  * @param {Object} connection
  */
const action = async (event, context, connection) => {
  let response = null;
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const userId = getUserId(context);
    const merchantRepo = new repositories.Merchant(connection);
    const user = await merchantRepo.getMerchantInfo(userId);

    response = successResponse('Merchant Info', serialize(user));
  } catch (exp) {
    pino.error(exp, 'Failed to get Merchant Info');
    response = error(exp);
  }
  return response;
};

/**
 * Serialize merchant info response
 * @param {Object} data
 */
function serialize(data) {
  const serializerSchema = ({
    id: 'sid',
    attributes: [
      'sid',
      'user',
    ],
    user: {
      ref: 'uid',
      attributes: [
        'first_name',
        'last_name',
        'email',
        'phone',
        'mfa_enabled',
        'facebook',
        'instagram',
        'twitter',
        'username',
        'bio',
        'default_language',
        'default_currency',
        'country',
        'state',
        'city',
        'address',
        'zip',
        'picture',
        'wallet',
      ],
    },
    included: false,
    ignoreRelationshipData: false,
    keyForAttribute: 'camelCase',
  });

  return new JsonSerializer('Merchant', serializerSchema).serialize(data);
}

module.exports = {
  action,
};
