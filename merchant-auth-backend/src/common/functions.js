const NodeRSA = require('node-rsa');
const { readFileSync } = require('fs');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const {
  meta, helpers, configs, errors, CommonError,
} = require('backend-utility');

const { ENCRYPTION_KEYS_SECRET_ID } = process.env;
const { ses, sns, secretsManager } = helpers;
const { USA, CANADA } = configs.enums.StateCountries;
const { isValid } = helpers.functions;
const { validateCountryState } = meta.states;
const { CountryUpdateException, StateUpdateException } = errors.codes;
const { en: mfaSmsTemplate } = require('./template/mfa-code-sms');

/**
 * Validate state exists if country is USA or Canada
 * State to be validated against country provided in user request
 * otherwise validate against country present in DB
 * @param {String} requestedCountry
 * @param {String} requestedState
 * @param {String} savedCountry
 */
const isStateAvailable = (requestedCountry, requestedState, savedCountry, savedState) => {
  const countryIso = (isValid(requestedCountry) === true) ? requestedCountry : savedCountry;
  const stateCode = (isValid(requestedState) === true) ? requestedState : savedState;
  const stateCountries = [USA, CANADA];

  if (isValid(countryIso) === false) {
    throw new CommonError(StateUpdateException);
  }
  if (isValid(stateCode) === false && stateCountries.includes(countryIso) === true) {
    throw new CommonError(CountryUpdateException);
  }

  if (stateCountries.includes(countryIso) === true) {
    validateCountryState(stateCode, countryIso);
  }
};

/**
 * Get updated mfa email html content
 * @param {String} code
 * @returns html content for email contains mfa code
 */
const getMfaEmailHtmlContent = async code => {
  const paths = __dirname.split('\\');
  paths.splice(paths.length - 2);
  const emailTemplatePath = paths.concat(['common', 'template', 'mfa-code-email.html']).join('/');
  const template = await readFileSync(emailTemplatePath).toString().replace(new RegExp('{code}', 'g'), code);
  return template;
};

/**
 * Send mfa code to given email
 * @param {String} email
 * @param {String} emailCode
 * @param {String} subject
 * @returns Boolean whether email was sent or not
 */
const sendMfaEmail = async (email, emailCode, subject) => {
  let isEmailSent = false;
  if (isValid(email) === true && isValid(emailCode) === true) {
    const emailMessage = await getMfaEmailHtmlContent(emailCode);
    await ses.sendEmail(email, subject, emailMessage);
    isEmailSent = true;
  }
  return isEmailSent;
};

/**
 * Send sms to given phone
 * @param {String} phone
 * @param {String} phoneCode
 * @returns Boolean whether sms was sent or not
 */
const sendMfaSms = async (phone, phoneCode) => {
  let isSMSSent = false;
  if (isValid(phone) === true && isValid(phoneCode) === true) {
    const smsMessage = mfaSmsTemplate.replace('{code}', phoneCode);
    await sns.sendSMS(phone, smsMessage);
    isSMSSent = true;
  }
  return isSMSSent;
};

/**
 * Decrypt password
 * @param {String} password
 * @param {String} versionId
 * @returns {String} decryptedPassword
 */
async function decryptPassword(password, versionId) {
  const rsaKey = new NodeRSA();
  let decryptedPassword = null;
  try {
    rsaKey.setOptions({
      encryptionScheme: 'pkcs1',
    });
    const secret = await secretsManager.getSecret(ENCRYPTION_KEYS_SECRET_ID, versionId);
    const { privateKey } = JSON.parse(secret);
    rsaKey.importKey(privateKey);
    decryptedPassword = rsaKey.decrypt(password, 'utf8');
  } catch (exp) {
    pino.error(exp);
  }
  return decryptedPassword;
}

/**
 * Generate encryption keys
 * @returns encryption keys
 */
const generateEncryptionKeys = async () => {
  const rsaKey = new NodeRSA({ b: 2048 });
  let publicKey = rsaKey.exportKey('public');
  const privateKey = rsaKey.exportKey('private');
  publicKey = publicKey.replace(/\n/g, '\\n');
  return { publicKey, privateKey };
};

module.exports = {
  sendMfaSms,
  sendMfaEmail,
  decryptPassword,
  isStateAvailable,
  generateEncryptionKeys,
  getMfaEmailHtmlContent,
};
