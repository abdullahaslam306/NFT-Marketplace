const ld = require('lodash');
const axios = require('axios');
const moment = require('moment');
const ethers = require('ethers');

const { enums } = require('../configs');

const { TokenProtocol } = enums;
const { env } = process;
const { STAGE } = env;

/**
 * Validates given value
 * Value should not be undefined, empty string or null
 * @param {string} value
 */
function isValid(value) {
  return (!ld.isUndefined(value) && value !== '' && value !== null);
}

/**
 * Validates given value
 * Value should be undefined or null
 * @param {string} value
 */
function isUndefined(value) {
  return (ld.isUndefined(value) || value === null);
}

/**
 * Generate random string
 * @param {Number} radiux
 * @param {Number} length length of the generated string
 * @returns
 */
function getRandomString(radix = 36, length = 13) {
  const endPointer = length + 2;
  return `${Math.random().toString(radix).substring(2, endPointer)}`;
}

/**
 * Generate length specfic numeric code
 * @param {Number} length
 * @returns string
 */
function getRandomCode(length = 6) {
  return getRandomString(8, length);
}

/**
 * Validates given array
 * Value should not be undefined, empty or null
 * @param {Array} value
 */
function isValidArray(value) {
  return (Array.isArray(value) && value.length > 0);
}

/**
 * Validates given array
 * Return true if array is empty or null
 * @param {Array} value
 */
function isEmptyArray(value) {
  return (Array.isArray(value) && value.length === 0);
}

/**
 * Validates given object
 * Return true if passed object is null, undefined or empty {}
 * @param {Object} value
 */
function isEmptyObject(value) {
  return (isUndefined(value) || (Object.keys(value).length) === 0);
}

/**
 * Validates given object
 * @param {Object} value
 */
function isValidObject(value) {
  return (value && (typeof value === 'object') && (value.constructor === Object));
}

/**
 * Get regex for otp code
 * @returns regex
 */
function getOtpCodeRegex() {
  return /^[0-9]{6}$/;
}

/**
 * Get regex for phone
 * @returns regex
 */
function getPhoneRegex() {
  return /\+[1-9]{1,3}\d{1,12}/;
}

/**
 * Get regex for password
 * @returns regex
 */
function getPasswordRegex() {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
}

/**
 * Validates given error code
 * Value should not be undefined, empty or null
 * @param {Array} value
 */
function isValidErrorCode(value) {
  return (isValid(value)
    && Object.prototype.hasOwnProperty.call(value, 'code')
    && Object.prototype.hasOwnProperty.call(value, 'message')
    && Object.prototype.hasOwnProperty.call(value, 'status'));
}

/**
 * Get logged in user id from context
 * @param {Object} context
 * @param {String} defaultValue
 */
function getUserId(context, defaultValue = null) {
  if (STAGE === 'local') {
    return env.BLOCOMMERCE_LOGGEDIN_USER_ID;
  }
  return ld.get(context, 'event.requestContext.authorizer.user_id', defaultValue);
}

/**
 * Get logged in user uid from context
 * @param {Object} context
 * @param {String} defaultValue
 */
function getUserUid(context, defaultValue = null) {
  if (STAGE === 'local') {
    return env.LOGGEDIN_USER_UID;
  }
  return ld.get(context, 'event.requestContext.authorizer.uid', defaultValue);
}

/**
 * Get logged in user cognito sid from context
 * @param {Object} context
 * @param {String} defaultValue
 */
function getUserCognitoSid(context, defaultValue = null) {
  if (STAGE === 'local') {
    return env.BLOCOMMERCE_LOGGEDIN_MERCHANT_COGNITO_SID;
  }
  return ld.get(context, 'event.requestContext.authorizer.user_cognito_sid', defaultValue);
}

/**
 * Retrieve access token from authorization header
 * @param {AWSLambda.Event} event
 * @returns extracted access token
 */
function extractAccessToken(event, throwError = true) {
  let accessToken = null;
  [accessToken] = event.headers.Authorization.split(' ').splice(-1);
  return accessToken;
}

/**
 * Transform user request body keys into snake case
 * @param {Object} data
 * @returns object with keys in snake case
 */
function transformToSnakeCase(data) {
  const transformedBody = {};
  // eslint-disable-next-line no-return-assign
  Object.keys(data).forEach(key => transformedBody[ld.snakeCase(key)] = data[key]);
  return transformedBody;
}

/**
 * Get generated wallet address from the create wallet api
 * @param {String} baseUrl
 * @param {String} authorization
 * @returns wallet address
 */
async function getGeneratedWalletAddress(baseUrl, authorization) {
  const response = await axios.get(`${baseUrl}/api/v1/wallet/create`, {
    headers: {
      Authorization: authorization,
    },
  });
  return response;
}

/**
 * Check expiry of verification codes
 * @param {String} date
 */
function checkCodeExpiry(date) {
  let valid = false;
  const current = moment.utc(new Date());
  const old = moment.utc(date);
  if (current.diff(old, 'minute') < 10) {
    valid = true;
  }
  return valid;
}

/**
 * Returns an array with arrays of the given size.
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
function chunkArray(array, chunkSize) {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
}
/**
 * Converts the given value of wei to ethers
 * @param weiValue
 */
function weiToEther(weiValue) {
  const ethValue = ethers.utils.formatEther(weiValue);
  return ethValue;
}

/**
 * Gererate Token Uri from ipfs hash
 * Check if ipfs hash found convert it to tokenUri
 * otherwise return input value as is
 * @param ipfsHash
 * @returns tokenUri
 */
function generateFunctionalUrl(ipfsHash) {
  let functionalUrl = ipfsHash;
  if (isValid(functionalUrl) === true) {
    functionalUrl = ipfsHash.startsWith('ipfs://') ? ipfsHash.replace('ipfs://',
      env.NFT_STORAGE_GATEWAY) : ipfsHash;
  }
  return functionalUrl;
}

/**
 * Get token protocol on the basis of given editions
 * @param nftEditions total nft editions
 * @returns token protocol
 */
function getTokenProtocolByEditions(nftEditions) {
  const tokenProtocol = nftEditions > 1 ? TokenProtocol.ERC1155 : TokenProtocol.ERC721;
  return tokenProtocol;
}

module.exports = {
  isValid,
  getUserId,
  chunkArray,
  weiToEther,
  getUserUid,
  isUndefined,
  isValidArray,
  isEmptyArray,
  getPhoneRegex,
  getRandomCode,
  isValidObject,
  isEmptyObject,
  checkCodeExpiry,
  getRandomString,
  getOtpCodeRegex,
  getPasswordRegex,
  isValidErrorCode,
  getUserCognitoSid,
  extractAccessToken,
  transformToSnakeCase,
  generateFunctionalUrl,
  getGeneratedWalletAddress,
  getTokenProtocolByEditions,
};
