/**
 * Handler to merchant verify phone
 * OTP code will be send from Cognito and it verification will be done from cognito as well
 */
const ld = require('lodash');
const AWS = require('aws-sdk');
const Vandium = require('vandium');
const {
  helpers, CommonError, errors, configs,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const validationMessages = require('../../common/validation-code');

const { enums, defaults, responses } = configs;
const { VerifyPhoneResponseCode } = responses;
const { BLOCOMMERCE_WALLET_MANAGEMENT_BACKEND_BASE_URL, STAGE, REGION } = process.env;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { code: successCode, message: successMessage } = VerifyPhoneResponseCode;
const { InvalidVerificationCodeException, UserAlreadyVerifiedException } = errors.codes;
const { getUserId, extractAccessToken, getGeneratedWalletAddress } = helpers.functions;

const { BlocommerceWalletName } = defaults;
const { LambdaInvocationType, MoralisWatchType, WalletTypes } = enums;

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

/**
 * Validate verification code
 * @param {String} accessToken
 * @param {String} code
 */
const verifyCode = async (accessToken, code) => {
  const params = {
    AccessToken: accessToken,
    AttributeName: 'phone_number',
    Code: code,
  };
  await cognitoIdentityServiceProvider.verifyUserAttribute(params).promise();
};

/**
 * Get Cognito user
 * @param {String} accessToken
 * @returns Cognito user info
 */
const getCognitoUser = async accessToken => {
  const params = {
    AccessToken: accessToken,
  };
  const response = await cognitoIdentityServiceProvider.getUser(params).promise();
  return response;
};

/**
 * Enable Cognito MFA
 * @param {String} accessToken
 */
const enableMFACognito = async accessToken => {
  const params = {
    AccessToken: accessToken,
    SMSMfaSettings: {
      Enabled: true,
      PreferredMfa: true,
    },
  };
  await cognitoIdentityServiceProvider.setUserMFAPreference(params).promise();
};

/**
  * Verify Phone Merchant Handler
  * @param {Object} event
  * @param {Object} context
  * @param {Object} connection
  */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;
  let response = null;
  const { code } = event.body;
  const { Authorization } = event.headers;
  const accessToken = extractAccessToken(event);
  const { sequelize } = connection;
  const userId = getUserId(context);
  const userData = {};
  try {
    const userRepo = new repositories.User(connection);
    const walletRepo = new repositories.Wallet(connection);
    const user = await userRepo.getById(userId);
    const transactionOptions = {
      isolationLevel: connection.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      deferrable: connection.Sequelize.Deferrable.SET_DEFERRED,
    };
    const cognitoUser = await getCognitoUser(accessToken);
    const cognitoPhone = ld.find(cognitoUser.UserAttributes, obj => obj.Name === 'phone_number').Value;
    if (cognitoPhone !== user.phone) {
      throw new CommonError(InvalidVerificationCodeException);
    }
    if (user.phone_verified && user.mfa_enabled) {
      throw new CommonError(UserAlreadyVerifiedException);
    }
    await sequelize.transaction(transactionOptions, async transaction => {
      userData.phone_verified = true;
      userData.mfa_enabled = true;
      await verifyCode(accessToken, code);
      await enableMFACognito(accessToken);
      await userRepo.updateUserAttributes(user, userData, transaction);

      /* Response from Create Wallet API
        "response": {
          "address": "0x4eCB343cE7d83fe7366bcd29438e595e4Ae211C2",
          "publicKey": "0x040c8ea25ec433200e76ee949e5a759bbfb62ab8fe4ef99e4fe6eb422cbc5a2ee5839fc7cd3e3d7ab4ee9a1b64618df774bcbab92e8f3229414e8a2e3f02668a37",
        }
      */

      response = await getGeneratedWalletAddress(BLOCOMMERCE_WALLET_MANAGEMENT_BACKEND_BASE_URL, Authorization);

      const walletAddress = response?.data?.response?.address;

      await walletRepo.create(userId, walletAddress, BlocommerceWalletName, WalletTypes.BLOCOMMERCE, transaction);
      const payload = {
        walletAddress,
        action: MoralisWatchType.WATCH,
      };

      await helpers.lambda.invoke(`blockchain-syncing-backend-${STAGE}-UpdateMoralisWatch`, payload, LambdaInvocationType.EVENT, REGION, 3106);

    });
    response = successResponse(successCode, successMessage);
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
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
      code: Vandium.types.string().trim()
        .regex(regexCode)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_info')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
