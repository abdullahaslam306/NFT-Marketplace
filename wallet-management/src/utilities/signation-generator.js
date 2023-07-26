/**
 *  Utility to genearate signature for Wyre secure authentication
 */

const CryptoJS = require('crypto-js');

const { WYRE_SECRET_KEY } = process.env;

/**
 * The function is used to generate a signature for WYRE api header.
 * @param {string} url
 * @param {object} data
 * @returns
 */
const signature = (url, data) => {
  const dataToSign = url + data;
  return CryptoJS.enc.Hex.stringify(
    CryptoJS.HmacSHA256(dataToSign.toString(CryptoJS.enc.Utf8), WYRE_SECRET_KEY),
  );
};

module.exports = {
  signature,
};
