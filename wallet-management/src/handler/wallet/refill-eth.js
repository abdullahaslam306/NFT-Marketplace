/**
 *  handler to request a refill url from Wyre
 */
const Vandium = require('vandium');
const { helpers, meta } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const { refillWalletEth } = require('../../helpers/wallet-helper');
const { validationMessages } = require('../../common/validation-code/en');

const { wyre, currencies } = meta;
const { WYRE_REFFER_ACCOUNT_ID } = process.env;
const { success: successResponse, error: errorResponse } = helpers.responses;
const {
  destCurrency, paymentMethod, amountIncludeFees, ethereumDestination,
} = wyre;

const action = async event => {
  let response;
  try {
    const data = event?.body;

    data.dest = `${ethereumDestination}${data.walletAddress}`;
    delete data.walletAddress;
    if (data.sourceAmount || data.sourceCurrency) {
      data.amountIncludeFees = amountIncludeFees;
    }
    data.referrerAccountId = WYRE_REFFER_ACCOUNT_ID;
    data.destCurrency = destCurrency;
    data.paymentMethod = paymentMethod;

    const refillResponse = await refillWalletEth(data);

    const responseData = {
      url: refillResponse.data.url,
      reservation: refillResponse.data.reservation,
    };
    response = successResponse('Wyre Refill URL', responseData);
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
  const countriesList = wyre.getAll();

  return {
    body: {
      sourceAmount: Vandium.types
        .number()
        .min(0)
        .positive()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'refill_wallet',
          )),

      sourceCurrency: Vandium.types.string()
        .allow(...currenciesList.map(currency => currency.code))
        .only()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'currency',
          )),

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

      street1: Vandium.types
        .string()
        .trim()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'refill_wallet',
          )),

      postalCode: Vandium.types
        .string()
        .trim()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'refill_wallet',
          )),

      address: Vandium.types
        .string()
        .trim()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'refill_wallet',
          )),

      city: Vandium.types
        .string()
        .trim()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'refill_wallet',
          )),

      state: Vandium.types
        .string()
        .trim()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'refill_wallet',
          )),

      country: Vandium.types
        .string()
        .allow(...countriesList.map(country => country.code))
        .only()
        .error(validationErrors =>
          helpers.joi.makeValidationMessage(
            validationMessages,
            validationErrors,
            'refill_wallet',
          )),

    },
  };
};

module.exports = {
  action,
  validationSchema,
};
