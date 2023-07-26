/**
 * Handler to send mfa code to merchant
 */

const ld = require('lodash');
const Vandium = require('vandium');
const { readFileSync } = require('fs');
const {
  helpers, CommonError, errors, configs,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const JsonSerializer = require('jsonapi-serializer').Serializer;
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const validationMessages = require('../../common/validation-code');
const { en: mfaSmsTemplate } = require('../../common/template/mfa-code-sms');

const { MFA_EMAIL_SUBJECT } = process.env;
const {
  functions, responses, ses, sns,
} = helpers;
const { InitializeMFAFor, MfaTransactionAction } = configs.enums;
const { InvalidActionSpecified, EmailNotFoundException } = errors.codes;
const { isValid, getUserId, getRandomCode } = functions;
const { success: successResponse, error: errorResponse } = responses;

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
 * Send mfa codes
 * @param {Object} event
 * @param {Object} context
 * @param {Object} connection
 */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const { action: mfaAction } = event.body;
  let response = null;
  let transaction;
  try {
    let user;
    let email;
    let phone;
    let phoneCode;
    let requestedAction;
    let isSMSSent = false;

    let userId = getUserId(context);

    const userRepo = new repositories.User(connection);
    const mfaTransactionRepo = new repositories.MfaTransaction(connection);

    // Determining if request is coming from authorized endpoint or not
    const emailCode = getRandomCode();
    transaction = await connection.sequelize.transaction();

    if (isValid(userId) === false) {
      // Unauthorized request only entertained for forgot password
      if (mfaAction !== InitializeMFAFor.FORGOT_PASSWORD) {
        throw new CommonError(InvalidActionSpecified);
      }
      email = ld.get(event, 'body.email');
      user = await userRepo.getByEmail(email, true, EmailNotFoundException);
      userId = userRepo.getId(user);
      requestedAction = MfaTransactionAction.FORGOT_PASSWORD;
    } else {
      phoneCode = getRandomCode();

      user = await userRepo.getById(userId);
      email = userRepo.getEmail(user);
      phone = userRepo.getPhone(user);

      switch (mfaAction) {
        case InitializeMFAFor.UPDATE_PHONE:
          phone = event.body.phone;
          requestedAction = MfaTransactionAction.UPDATE_PHONE;
          break;
        case InitializeMFAFor.UPDATE_PASSWORD:
          requestedAction = MfaTransactionAction.UPDATE_PASSWORD;
          break;
        case InitializeMFAFor.SEND_CRYPTO:
          requestedAction = MfaTransactionAction.SEND_CRYPTO;
          break;
        case InitializeMFAFor.SEND_NFT:
          requestedAction = MfaTransactionAction.SEND_NFT;
          break;
        default:
          throw new CommonError(InvalidActionSpecified);
      }
    }

    if (isValid(email) === true && isValid(emailCode) === true) {
      const emailMessage = await getMfaEmailHtmlContent(emailCode);
      await ses.sendEmail(email, MFA_EMAIL_SUBJECT, emailMessage);
    }

    if (isValid(phone) === true && isValid(phoneCode) === true) {
      const smsMessage = mfaSmsTemplate.replace('{code}', phoneCode);
      await sns.sendSMS(phone, smsMessage);
      isSMSSent = true;
    }
    const mfaTransaction = await mfaTransactionRepo.create(userId, requestedAction, email, emailCode, phone, phoneCode, transaction);
    transaction.commit();
    response = successResponse('MfaTransaction', serialize(mfaTransaction, isSMSSent));
  } catch (exp) {
    pino.error(exp, 'Exception');
    transaction.rollback();
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () =>
  ({
    body: {
      action: Vandium.types.string().trim()
        .required()
        .valid(...Object.values(InitializeMFAFor))
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_auth')),
      phone: Vandium.types.string().trim()
        .when('action', {
          is: InitializeMFAFor.UPDATE_PHONE,
          then: Vandium.types.string().required().regex(/\+[1-9]{1,3}\d{1,12}/),
          otherwise: Vandium.types.string().forbidden(),
        })
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_auth')),
      email: Vandium.types.string().trim()
        .when('action', {
          is: InitializeMFAFor.FORGOT_PASSWORD,
          then: Vandium.types.string().required().email(),
          otherwise: Vandium.types.string().forbidden(),
        })
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_auth')),
    },
  });

/**
 * Serialize mfa transaction response
 * @param {Object} data
 */
function serialize(data, includePhone = false) {
  const attributes = [
    'email',
  ];
  if (includePhone === true) {
    attributes.push('phone');
  }
  const serializerSchema = ({
    id: 'uid',
    attributes,
    keyForAttribute: 'camelCase',
  });

  return new JsonSerializer('MfaTransaction', serializerSchema).serialize(data);
}

module.exports = {
  action,
  validationSchema,
};
