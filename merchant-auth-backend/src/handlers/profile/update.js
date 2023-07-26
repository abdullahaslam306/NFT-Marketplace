/**
 * Handler to merchant info
 */
const ld = require('lodash');
const Vandium = require('vandium');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const {
  meta, errors, helpers, configs, CommonError,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const { isStateAvailable } = require('../../common/functions');
const validationMessages = require('../../common/validation-code');

const { UsernameAlreadyExists } = errors.codes;
const { code: successCode, message: successMessage } = configs.responses.UpdateProfile;
const {
  countries, languages, currencies,
} = meta;
const { getUserId, isValid, transformToSnakeCase } = helpers.functions;
const { error: errorResponse, success: successResponse } = helpers.responses;

/**
  * Update profile handler
  * @param {Object} event
  * @param {Object} context
  * @param {Object} connection
  */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  let response = null;
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const userBody = event.body;
    const userId = getUserId(context);
    const userRepo = new repositories.User(connection);
    const user = await userRepo.getById(userId);
    const requestedUsername = ld.get(event, 'body.username', null);
    const requestedCountry = ld.get(event, 'body.country', null);
    const requestedState = ld.get(event, 'body.state', null);
    const savedCountry = userRepo.getCountry(user);
    const savedState = userRepo.getState(user);

    if (isValid(requestedState) === true || isValid(requestedCountry) === true) {
      isStateAvailable(requestedCountry, requestedState, savedCountry, savedState);
    }

    if (isValid(requestedUsername) === true) {
      const username = await userRepo.getByUsername(requestedUsername, false);
      if (username instanceof connection.user) {
        throw new CommonError(UsernameAlreadyExists);
      }
    }

    const transformedBody = transformToSnakeCase(userBody);
    await userRepo.updateUserAttributes(user, transformedBody);

    response = successResponse(successCode, successMessage);
  } catch (exp) {
    pino.error(exp, 'Exception in updating user');
    response = await errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => {
  const countriesList = countries.getAll();
  const currenciesList = currencies.getAll();
  const languagesList = languages.getAll();

  // eslint-disable-next-line no-useless-escape
  const regexUsername = /^[\w\-]+$/;
  const regexTwitter = /^[\w]+$/;
  const regexInstagram = /^[\w.]+$/;
  const regexName = /^[a-zA-Z0-9 ]+$/;
  return {
    body: {
      id: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      uid: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      phone: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      phoneVerified: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      mfaEnabled: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      password: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      email: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      emailVerified: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      isMerchant: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      isCostumer: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      status: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      createdAt: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      updatedAt: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      deletedAt: Vandium.types.any().forbidden()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      username: Vandium.types.string().max(100).min(5)
        .regex(regexUsername)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      bio: Vandium.types.string().max(1000).trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      picture: Vandium.types.string().max(255)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      facebook: Vandium.types.string().max(255).trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      instagram: Vandium.types.string().max(255).trim().allow('')
        .regex(regexInstagram)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      twitter: Vandium.types.string().max(255).trim().allow('')
        .regex(regexTwitter)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      firstName: Vandium.types.string().max(255).min(1)
        .regex(regexName)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      lastName: Vandium.types.string().max(255).min(1)
        .regex(regexName)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      defaultLanguage: Vandium.types.string()
        .allow(...languagesList.map(language => language.code))
        .only()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      defaultCurrency: Vandium.types.string()
        .allow(...currenciesList.map(currency => currency.code))
        .only()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      state: Vandium.types.string().trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      country: Vandium.types.string()
        .allow(...countriesList.map(country => country.iso3))
        .only()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      city: Vandium.types.string().max(100).trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      address: Vandium.types.string().max(255).min(5).trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
      zip: Vandium.types.string().max(10).trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'profile')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
