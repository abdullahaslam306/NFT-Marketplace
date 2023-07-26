/**
 * Handler to verify OTP codes and update merchant phone
 */
const Vandium = require('vandium');
const {
  helpers, CommonError, errors, configs,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const validationMessages = require('../../common/validation-code');

const { MERCHANT_COGNITO_USERPOOL_ID } = process.env;

const { MfaTransactionAction } = configs.enums;
const { UpdateUserPhone } = configs.responses;
const { code: successCode, message: successMessage } = UpdateUserPhone;

const { getUserId, isValid } = helpers.functions;
const { adminUpdateCognitoUserPhone } = helpers.cognito;
const { success: successResponse, error: errorResponse } = helpers.responses;

const { UpdatedPhoneMismatchException } = errors.codes;

/**
  * Verify codes and update merchant phone handler
  * @param {Object} event
  * @param {Object} context
  * @param {Object} connection
  */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const {
    transactionUid, emailCode, phoneCode, phone,
  } = event.body;

  let transaction;
  let response = null;
  const userId = getUserId(context);
  try {
    const userRepo = new repositories.User(connection);
    const mfaTransactionRepo = new repositories.MfaTransaction(connection);
    const user = await userRepo.getById(userId);

    // Validates given codes
    const mfaTransaction = await mfaTransactionRepo.verifyCodes(transactionUid, emailCode, phoneCode, MfaTransactionAction.UPDATE_PHONE);
    const transactionPhone = mfaTransactionRepo.getPhone(mfaTransaction);

    // Given phone number must match the phone on which OTP code was send
    // This is used to verify new phone number
    if (transactionPhone !== phone) {
      throw new CommonError(UpdatedPhoneMismatchException);
    }
    const username = userRepo.getEmail(user);

    transaction = await connection.sequelize.transaction();

    // Updates phone number in Cognito and mark it a verified
    await adminUpdateCognitoUserPhone(username, phone, MERCHANT_COGNITO_USERPOOL_ID, true);

    // Updates phone number in DB and mark it a verified
    await mfaTransactionRepo.setVerifiedAt(mfaTransaction, transaction);
    await userRepo.updatePhone(user, phone, true, true, transaction);

    transaction.commit();
    response = successResponse(successCode, successMessage);
  } catch (exp) {
    pino.error(exp, 'Exception in verifying code and updating phone for merchant');
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
  // eslint-disable-next-line no-useless-escape
  const regexCode = /^[0-9]{6}$/;
  return {
    body: {
      transactionUid: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update_phone')),
      emailCode: Vandium.types.string().trim().regex(regexCode)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update_phone')),
      phoneCode: Vandium.types.string().trim().regex(regexCode)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update_phone')),
      phone: Vandium.types.string().required().regex(/\+[1-9]{1,3}\d{1,12}/)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update_phone')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
