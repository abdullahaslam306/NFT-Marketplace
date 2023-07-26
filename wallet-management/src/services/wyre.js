/**
 *  Wyre service file to interact with wyre
 */

const axios = require('axios');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { signature } = require('../utilities/signation-generator');

const { WYRE_RATE_URL, WYRE_TEST_URL, WYRE_API_KEY } = process.env;

/**
 *
 * @returns all the rates support by Wyre for crypto to fiat.
 */
const CryptoToFiat = async () => {
  const headers = {};
  const url = WYRE_RATE_URL;

  headers['Content-Type'] = 'application/json';

  const config = {
    method: 'GET',
    url,
    headers,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (exp) {
    pino.error(exp);
    return exp;
  }
};

/**
 * The Function connects to WYRE and generates a refill URL.
 * @param {object} body
 */
const refillETH = async body => {
  try {
    const timestamp = new Date().getTime();
    const url = `${WYRE_TEST_URL}/v3/orders/reserve?timestamp=${timestamp}`;
    const details = JSON.stringify(body);
    const headers = {};
    headers['Content-Type'] = 'application/json';
    headers['X-Api-Key'] = WYRE_API_KEY;
    headers['X-Api-Signature'] = signature(url, details);
    const config = {
      method: 'POST',
      url,
      headers,
      data: details,
    };
    return axios(config);
  } catch (exp) {
    pino.error(exp);
    return Promise.reject(exp);
  }
};

module.exports = {
  CryptoToFiat,
  refillETH,
};
