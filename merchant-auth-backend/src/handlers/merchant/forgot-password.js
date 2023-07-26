/**
 * Handler to verify OTP codes and update forgot merchant password
 */
const Vandium = require('vandium');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const {
  helpers, configs, errors, CommonError,
} = require('backend-utility');

const validationMessages = require('../../common/validation-code');
const { decryptPassword } = require('../../common/functions');

const { MERCHANT_COGNITO_USERPOOL_ID } = process.env;

const { MfaTransactionAction } = configs.enums;
const { PasswordDecryptionException } = errors.codes;
const { UpdateForgottenUserPassword } = configs.responses;
const { code: successCode, message: successMessage } = UpdateForgottenUserPassword;

const { adminSetCognitoUserPassword } = helpers.cognito;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { isValid, getPasswordRegex, getOtpCodeRegex } = helpers.functions;

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
    transactionUid, emailCode, password, version,
  } = event.body;

  let transaction;
  let response = null;
  try {
    const mfaTransactionRepo = new repositories.MfaTransaction(connection);

    // Validates given codes
    const mfaTransaction = await mfaTransactionRepo.verifyCodes(transactionUid, emailCode, null, MfaTransactionAction.FORGOT_PASSWORD);

    const username = mfaTransactionRepo.getEmail(mfaTransaction);

    transaction = await connection.sequelize.transaction();

    // Decrypt password
    const decryptedPassword = await decryptPassword(password, version);
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
    pino.error(exp, 'Exception in verifying code and updating password for merchant');
    response = errorResponse(exp);
    if (isValid(transaction)) {
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
