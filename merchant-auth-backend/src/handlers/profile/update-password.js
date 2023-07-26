/**
 * Handler to verify OTP codes and update merchant password
 */
const Vandium = require('vandium');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { repositories } = require('data-access-utility');
const {
  helpers, configs, errors, CommonError,
} = require('backend-utility');

const { decryptPassword } = require('../../common/functions');
const validationMessages = require('../../common/validation-code');

const { MERCHANT_COGNITO_USERPOOL_ID } = process.env;

const { MfaTransactionAction } = configs.enums;
const { PasswordDecryptionException } = errors.codes;
const { UpdateUserPassword } = configs.responses;
const { code: successCode, message: successMessage } = UpdateUserPassword;

const { adminSetCognitoUserPassword } = helpers.cognito;
const { success: successResponse, error: errorResponse } = helpers.responses;
const {
  getUserId, isValid, getPasswordRegex, getOtpCodeRegex,
} = helpers.functions;

/**
  * Verify codes and update merchant password handler
  * @param {Object} event
  * @param {Object} context
  * @param {Object} connection
  */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const {
    version,
    emailCode,
    phoneCode,
    transactionUid,
    password: encryptedPassword,
  } = event.body;

  let transaction;
  let response = null;
  const userId = getUserId(context);
  try {
    const userRepo = new repositories.User(connection);
    const mfaTransactionRepo = new repositories.MfaTransaction(connection);
    const user = await userRepo.getById(userId);
    // Validates given codes
    const mfaTransaction = await mfaTransactionRepo.verifyCodes(transactionUid, emailCode, phoneCode, MfaTransactionAction.UPDATE_PASSWORD);
    const username = userRepo.getEmail(user);

    transaction = await connection.sequelize.transaction();

    // Decrypt password
    const decryptedPassword = await decryptPassword(encryptedPassword, version);
    if (isValid(decryptedPassword) === false) {
      throw new CommonError(PasswordDecryptionException);
    }

    // Set password in Cognito
    await adminSetCognitoUserPassword(username, decryptedPassword, MERCHANT_COGNITO_USERPOOL_ID);

    // Mark transaction to be verified
    await mfaTransactionRepo.setVerifiedAt(mfaTransaction, transaction);

    transaction.commit();
    response = successResponse(successCode, successMessage);
  } catch (exp) {
    pino.error(exp, 'Exception in verifying code and updating forgotten password for merchant');
    response = errorResponse(exp);
    if (isValid(transaction) === true) {
      transaction.rollback();
    }
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => {
  /* eslint-disable no-useless-escape */
  const regexCode = getOtpCodeRegex();
  const regexPassword = getPasswordRegex();

  return {
    body: {
      transactionUid: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update')),
      emailCode: Vandium.types.string().trim().regex(regexCode)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update')),
      phoneCode: Vandium.types.string().trim().regex(regexCode)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update')),
      password: Vandium.types.string().trim().min(340).base64()
        .required()
        .regex(regexPassword)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_info')),
      version: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
