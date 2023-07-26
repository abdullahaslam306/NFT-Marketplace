/**
 *  Handler to get crypto to fiat rates from RDS
 */

const Vandium = require('vandium');
const { helpers } = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const { validationMessages } = require('../../common/validation-code/en');

const { success: successResponse, error: errorResponse } = helpers.responses;

const action = async (event, context, connection) => {
  let response = null;
  let etherRate;
  try {
    const { crypto } = event.queryStringParameters;
    const cryptoRatesRepo = new repositories.CryptoRates(connection);
    etherRate = await cryptoRatesRepo.getByCrypto(crypto, false);

    const updatedAt = await cryptoRatesRepo.getUpdatedAt(etherRate, null);
    const cryptoRate = await cryptoRatesRepo.getCryptoRateJson(etherRate, null);

    const responseData = {
      cryptoRate,
      updatedAt,
    };

    response = successResponse('Crypto Rate Info', responseData);
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
  queryStringParameters: {
    crypto: Vandium.types.string().trim().required()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'get_crypto_rates')),
  },
});

module.exports = {
  action,
  validationSchema,
};
