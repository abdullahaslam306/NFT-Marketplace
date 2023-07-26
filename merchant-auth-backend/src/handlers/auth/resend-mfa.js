/**
 * Handler to send mfa code to merchant
 */

const ld = require('lodash');
const Vandium = require('vandium');

const {
  helpers, CommonError, errors, configs,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const JsonSerializer = require('jsonapi-serializer').Serializer;
const pino = require('pino')({
  level: process.env.LOG_LEVEL || 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const validationMessages = require('../../common/validation-code');
const { sendMfaEmail, sendMfaSms } = require('../../common/functions');

const { functions, responses } = helpers;
const { MFA_EMAIL_SUBJECT } = process.env;
const { InitializeMFAFor, MfaChannel } = configs.enums;
const { getUserId, getRandomCode, checkCodeExpiry } = functions;
const { success: successResponse, error: errorResponse } = responses;
const { CodeExpiredException, InvalidMfaChannelException } = errors.codes;

/**
 * Resend mfa codes
 * @param {Object} event
 * @param {Object} context
 * @param {Object} connection
 */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  let response = null;
  let transaction;
  try {
    let sendEmailOtp = false;
    let sendPhoneOtp = false;
    let isSmsSent = false;
    let isEmailSent = false;

    const userId = getUserId(context);

    const userRepo = new repositories.User(connection);
    const mfaTransactionRepo = new repositories.MfaTransaction(connection);

    // Determining if request is coming from authorized endpoint or not
    let emailCode;
    let phoneCode;
    transaction = await connection.sequelize.transaction();
    await userRepo.getById(userId);

    const mfaAction = event?.body?.action || null;
    const mfaChannel = event?.body?.channel || null;
    const transactionUid = event?.body?.transactionUid || null;

    // Convert given action to DB specfic snake case based action
    const requestedAction = ld.snakeCase(mfaAction);

    const mfaTransaction = await mfaTransactionRepo.getByUid(transactionUid, userId, requestedAction);
    const transactionCreationTime = mfaTransactionRepo.getCreationDate(mfaTransaction);

    // Checking for expired verification codes
    const codesValidity = checkCodeExpiry(transactionCreationTime);

    pino.info(mfaTransaction);

    if (codesValidity === false) {
      throw new CommonError(CodeExpiredException);
    }

    const email = mfaTransactionRepo.getEmail(mfaTransaction);
    const phone = mfaTransactionRepo.getPhone(mfaTransaction);

    switch (mfaChannel) {
      case MfaChannel.EMAIL:
        sendEmailOtp = true;
        phoneCode = mfaTransactionRepo.getPhoneCode(mfaTransaction);
        emailCode = getRandomCode();
        break;
      case MfaChannel.PHONE:
        sendPhoneOtp = true;
        emailCode = mfaTransactionRepo.getEmailCode(mfaTransaction);
        phoneCode = getRandomCode();
        break;
      default:
        throw new CommonError(InvalidMfaChannelException);
    }

    if (sendEmailOtp === true) {
      isEmailSent = await sendMfaEmail(email, emailCode, MFA_EMAIL_SUBJECT);
    }

    if (sendPhoneOtp === true) {
      isSmsSent = await sendMfaSms(phone, phoneCode);
    }
    await mfaTransactionRepo.delete(mfaTransaction, transaction);
    const resentMfaTransaction = await mfaTransactionRepo.create(userId, requestedAction, email, emailCode, phone, phoneCode, transaction);
    transaction.commit();
    response = successResponse('MfaTransaction', serialize(resentMfaTransaction, isEmailSent, isSmsSent));
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
const validationSchema = () => {
  const allowedMfaActions = ld.cloneDeep(InitializeMFAFor);
  // Removing forgot password action from the list as it is not allowed to use this API
  delete allowedMfaActions.FORGOT_PASSWORD;

  return {
    body: {
      action: Vandium.types.string().trim()
        .required()
        .valid(...Object.values(allowedMfaActions))
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_auth')),
      transactionUid: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_auth')),
      channel: Vandium.types.string().trim()
        .valid(...Object.values(MfaChannel))
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_auth')),
    },
  };
};

/**
 * Serialize mfa transaction response
 * @param {Object} data
 */
function serialize(data, includeEmail = false, includePhone = false) {
  const attributes = [];

  if (includeEmail === true) {
    attributes.push('email');
  }

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
