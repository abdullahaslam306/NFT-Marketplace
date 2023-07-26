/**
 *  Handler for getting ether balance of a wallet address
 */

const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const Vandium = require('vandium');
const { helpers, meta } = require('backend-utility');
const { walletHelper } = require('../../helpers');
const { validationMessages } = require('../../common/validation-code/en');

const { NETWORK_URL } = process.env;
const { currencies } = meta;
const { success: successResponse, error: errorResponse } = helpers.responses;

const action = async event => {
  let response = {};
  const data = event.body;

  try {
    const balance = await walletHelper.getBalanceInEth(data.walletAddress);
    const ETH_FIAT = await walletHelper.ETH_FIAT(balance, data.fiat);

    const responseData = {
      Eth: balance,
      fiat: ETH_FIAT,
      url: `${NETWORK_URL}address/${data.walletAddress}`,
    };

    response = successResponse('Wallet Ether Balance', responseData);
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => {
  const currenciesList = currencies.getAll();
  return {
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
      fiat: Vandium.types.string()
        .allow(...currenciesList.map(currency => currency.code))
        .only()
        .required()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'currency',
          )),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
