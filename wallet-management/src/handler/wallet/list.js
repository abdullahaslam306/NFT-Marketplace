/**
 * Handler to get Connected Wallets List
 */

const { Serializer } = require('jsonapi-serializer');
const { helpers, configs } = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { getWalletListBalance } = require('../../common/functions');

const { enums } = configs;
const { CONNECTED } = enums.WalletStatus;
const { functions, responses } = helpers;
const { getUserId } = functions;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Get connected wallet list and respective balance handler
 * @param event
 * @param context
 * @param connection
 */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-useless-escape
  context.callbackWaitsForEmptyEventLoop = false;
  let response;

  try {
    const { balance } = event.queryStringParameters;
    const userId = getUserId(context);
    const walletRepo = new repositories.Wallet(connection);
    const walletList = await walletRepo.getlistByUserId(userId, CONNECTED);

    if (balance === 'true') {
      const walletListWithBalance = await getWalletListBalance(walletList);
      response = await successResponse('WalletList', serialize(walletListWithBalance));
    } else {
      response = await successResponse('WalletList', serialize(walletList));
    }
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
function serialize(data) {
  const serializerSchema = ({
    id: 'uid',
    attributes: [
      'name',
      'status',
      'address',
      'network',
      'createdAt',
      'wallet_type',
      'balance',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Wallets', serializerSchema).serialize(data);
}

module.exports = {
  action,
};
