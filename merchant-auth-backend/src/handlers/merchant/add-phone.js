/**
 * Handler to add phone for merchant
 */
const AWS = require('aws-sdk');
const Vandium = require('vandium');

const {
  helpers, CommonError, errors, configs,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { functions, responses } = helpers;
const { UserAlreadyVerifiedException } = errors.codes;
const { getUserId, extractAccessToken } = functions;
const { success: successResponse, error: errorResponse } = responses;
const { UpdateMerchantPhone, ResentVerificationCode } = configs.responses;
const { code: addPhoneSuccessCode, message: addPhoneSuccessMessage } = UpdateMerchantPhone;
const { code: resendSuccessCode, message: resendSuccessMessage } = ResentVerificationCode;
const validationMessages = require('../../common/validation-code');

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

/**
 * Add phone number for merchant in Cognito
 * @param {String} accessToken
 * @param {Array} userAttributes
 */
const updateCognitoUserAttribute = async (accessToken, userAttributes) => {
  const params = {
    AccessToken: accessToken,
    UserAttributes: userAttributes,
  };
  await cognitoIdentityServiceProvider.updateUserAttributes(params).promise();
};

/**
 * Resend verification code
 * @param {String} accessToken
 */
const resendCode = async accessToken => {
  const params = {
    AccessToken: accessToken,
    AttributeName: 'phone_number',
  };
  await cognitoIdentityServiceProvider.getUserAttributeVerificationCode(params).promise();
};

/**
 * Add phone for merchant handler
 * @param {Object} event
 * @param {Object} context
 * @param {Object} connection
 */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const { phoneNumber } = event.body;
  let response = null;
  const accessToken = extractAccessToken(event);
  const { sequelize } = connection;

  try {
    const userAttributes = [
      {
        Name: 'phone_number',
        Value: phoneNumber,
      },
    ];
    const userId = getUserId(context);
    const userRepo = new repositories.User(connection);
    const user = await userRepo.getById(userId);

    const transactionOptions = {
      isolationLevel: connection.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      deferrable: connection.Sequelize.Deferrable.SET_DEFERRED,
    };

    if (user.phone_verified) {
      throw new CommonError(UserAlreadyVerifiedException);
    }
    if (!user.phone || user.phone !== phoneNumber) {
      await sequelize.transaction(transactionOptions, async transaction => {
        const userData = { 'phone': phoneNumber };
        await updateCognitoUserAttribute(accessToken, userAttributes);
        await userRepo.updateUserAttributes(user, userData, transaction);
      });
      response = successResponse(addPhoneSuccessCode, addPhoneSuccessMessage);
    } else {
      await resendCode(accessToken);
      response = successResponse(resendSuccessCode, resendSuccessMessage);
    }
  } catch (exp) {
    pino.error(exp, 'Exception in adding phone for merchant');
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => {
  // eslint-disable-next-line no-useless-escape
  const regexPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  return {
    body: {
      phoneNumber: Vandium.types.string().trim()
        .regex(regexPhone)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_info')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
