/**
 *  handler to get the NFT balanced for a wallet address
 */
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const Vandium = require('vandium');
const { helpers } = require('backend-utility');
const { walletHelper } = require('../../helpers');
const { validationMessages } = require('../../common/validation-code/en');

const { NETWORK_URL } = process.env;
const { success: successResponse, error: errorResponse } = helpers.responses;

const action = async event => {
  let response;
  try {
    const data = event.body;
    const balance = await walletHelper.getNFTBalance(data.walletAddress);
    const responseData = {
      NFT: balance,
      url: `${NETWORK_URL}address/${data.walletAddress}`,
    };
    response = successResponse('Wallet NFT Balance', responseData);
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
    walletAddress: Vandium.types
      .string()
      .trim()
      .custom(helpers.joi.customValidationEthAddress)
      .required()
      .error(validationErrors =>
        helpers.joi.makeValidationMessage(
          validationMessages,
          validationErrors,
          'wallet_address',
        )),
  },
});

module.exports = {
  action,
  validationSchema,
};
