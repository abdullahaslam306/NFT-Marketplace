/**
 * Handler to signup merchant
 */
const AWS = require('aws-sdk');
const Vandium = require('vandium');
const { repositories } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const {
  helpers, CommonError, errors, configs,
} = require('backend-utility');

const validationMessages = require('../../common/validation-code');
const { decryptPassword } = require('../../common/functions');

const { SmartContractTypes } = configs.enums;
const { PLATFORM } = SmartContractTypes;
const { MerchantCreateSuccess } = configs.responses;
const { MERCHANT_COGNITO_USERPOOL_APP_ID } = process.env;
const { getPasswordRegex, getRandomString, isValid } = helpers.functions;
const { code: successCode, message: successMessage } = MerchantCreateSuccess;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { MerchantAccountExistsException, CreateCognitoUserException, PasswordDecryptionException } = errors.codes;

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

/**
 * Signup Merchant in Cognito
 * @param {String} email
 * @param {String} password
 */
const addCognitoUser = async (email, password) => {
  let response = {};
  const params = {
    ClientId: MERCHANT_COGNITO_USERPOOL_APP_ID,
    Password: password,
    Username: email,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'phone_number',
        Value: '',
      },
    ],
  };
  try {
    response = await cognitoIdentityServiceProvider.signUp(params).promise();
  } catch (e) {
    pino.info(e, 'Exception creating user in cognito');
    throw new CommonError(CreateCognitoUserException);
  }

  return response;
};

/**
 * Signup Merchant Handler
 * @param {Object} event
 * @param {Object} context
 * @param {Object} connection
 */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  const {
    email,
    version,
    password: encryptedPassword,
  } = event.body;

  let response = null;
  const { sequelize } = connection;

  try {
    let user = null;
    let merchant = null;
    let userId = '';
    let isConsumer = false;
    const userRepo = new repositories.User(connection);
    const merchantRepo = new repositories.Merchant(connection);
    const smartContractRepo = new repositories.SmartContract(connection);
    const userSmartContractRepo = new repositories.UserSmartContract(connection);

    const decryptedPassword = await decryptPassword(encryptedPassword, version);
    if (isValid(decryptedPassword) === false) {
      throw new CommonError(PasswordDecryptionException);
    }

    user = await userRepo.getByEmail(email, false);
    if (user instanceof connection.user) {
      userId = userRepo.getId(user);
      merchant = await merchantRepo.getByUserId(userId, false);
      if (merchant instanceof connection.merchant) {
        throw new CommonError(MerchantAccountExistsException);
      }
      isConsumer = true;
    }

    const transactionOptions = {
      isolationLevel: connection.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      deferrable: connection.Sequelize.Deferrable.SET_DEFERRED,
    };

    await sequelize.transaction(transactionOptions, async transaction => {
      switch (isConsumer) {
        case true:
          user = await userRepo.update(user, true, null, transaction);
          userId = await userRepo.getId(user);
          break;
        case false:
          const baseUsername = email.split('@')[0];
          const users = await userRepo.getAllByCriteria(baseUsername, false, false);
          const usernameList = users.map(record => userRepo.getUsername(record));
          const username = autoGenerateUsername(baseUsername, usernameList);
          user = await userRepo.create(email, username, true, false, transaction);
          userId = await userRepo.getId(user);
          break;

        default:
          break;
      }
      const cognitoUser = await addCognitoUser(email, decryptedPassword);
      const { UserSub } = cognitoUser;
      merchant = await merchantRepo.create(userId, UserSub, transaction);
      if (isConsumer === false) {
        const platformSmartContracts = await smartContractRepo.getAllByCriteria(null, null, PLATFORM);
        // eslint-disable-next-line no-return-await
        const platformSmartContractIds = smartContractRepo.getIds(platformSmartContracts);
        await userSmartContractRepo.associateSmartContracts(userId, platformSmartContractIds, transaction);
      }
    });

    response = await successResponse(successCode, successMessage);
  } catch (exp) {
    pino.error(exp, 'Exception in signing up merchant');
    response = await errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => {
  // eslint-disable-next-line no-useless-escape
  const regexPassword = getPasswordRegex();
  return {
    body: {
      email: Vandium.types.string().email().trim()
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_info')),
      password: Vandium.types.string().trim().min(340).base64()
        .regex(regexPassword)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'merchant_info')),
      version: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'verify_update')),
    },
  };
};

/**
 * Autogenerates username accordingly by getting base username and matching that with existing ones
 * @param {String} baseUsername
 * @param {Array} existingUsernames
 * @returns generated username
 */
const autoGenerateUsername = (baseUsername, existingUsernames) => {
  const randomList = [];
  for (let i = 0; i < 10; i++) {
    randomList.push(getRandomString(36, 2));
  }
  const platformDefinedUsernames = existingUsernames.filter(name => name.includes('_'));
  const extractedList = platformDefinedUsernames.map(name => name.split('_').pop());

  const subString = randomList.find(randomString => extractedList.includes(randomString) === false);
  return `${baseUsername}_${subString}`;
};

module.exports = {
  action,
  validationSchema,
};
