const ld = require('lodash');
const { StatusCodes } = require('http-status-codes');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { isValid } = require('./function');
const ErrorCodes = require('./errors/error-code');

/**
 * Creates a standard error response
 * @param {Error} exception
 */
const error = exception => {
  let errorResponse = {};
  // eslint-disable-next-line no-console
  // console.log(JSON.stringify(exception, null, 2));
  try {
    if (exception.code && exception.message && (exception.httpCode || exception.status)) {
      // Custom Validation Error
      errorResponse = exception;
    } else {
      if (exception.code && exception.message && exception.statusCode) {
        // AWS Error Handler
        errorResponse.switch = exception.code;
      } else if (exception.errors && Array.isArray(exception.errors) && exception.errors.length > 0) {
        // Sequelize Error
        errorResponse.switch = exception.errors[0].message;
      }

      // eslint-disable-next-line default-case
      switch (errorResponse.switch) {
        case 'INSUFFICIENT_FUNDS':
          errorResponse = ErrorCodes.InsufficientFundsException;
          break;
        case 'NotAuthorizedException':
        case 'InvalidParameterException':
          errorResponse = ErrorCodes.IncorrectCredentialsException;
          errorResponse.message = exception.message;
          break;
        case 'LimitExceededException':
          errorResponse = ErrorCodes.LimitExceededException;
          break;
        case 'UserNotFoundException':
          errorResponse = ErrorCodes.UserNotFoundException;
          break;
        case 'CreateUserException':
          errorResponse = ErrorCodes.CreateUserException;
          break;
        case 'MerchantNotFoundException':
          errorResponse = ErrorCodes.MerchantNotFoundException;
          break;
        case 'MerchantAccountExistsException':
          errorResponse = ErrorCodes.MerchantAccountExistsException;
          break;
        case 'CreateMerchantException':
          errorResponse = ErrorCodes.CreateMerchantException;
          break;
        case 'ExpiredToken':
          errorResponse = ErrorCodes.IncorrectCredentialsException;
          errorResponse.message = exception.message;
          break;
        case 'CodeMismatchException':
          errorResponse = ErrorCodes.InvalidVerificationCodeException;
          break;
        case 'AccessDeniedException':
        case 'MissingRequiredParameter':
        case 'UnexpectedLambdaException':
        case 'SequelizeDatabaseError':
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
        case 'SequelizeConnectionRefusedError':
        case 'SequelizeForeignKeyConstraintError':
        default:
          errorResponse = ErrorCodes.InternalServerError;
      }
    }
  } catch (exp) {
    pino.Response(exp, 'Standard Error - Exception');
    errorResponse = ErrorCodes.InternalServerError;
  }
  const errorResponseTemplate = {
    statusCode: errorResponse.status,
    body: {
      responseCode: errorResponse.code,
      response: errorResponse.message,
    },
  };
  // console.log(errorResponse);
  return errorResponseTemplate;
};

/**
 * Create a standard success response
 * @param {string} responseCode
 * @param {string | object} response
 * @param {number} httpCode
 */
const success = (responseCode = '', response = '', httpCode = StatusCodes.OK) => ({
  statusCode: httpCode,
  body: {
    responseCode,
    response,
  },
});

/**
 * Parse the lambda response
 * @param response
 */
const parseLambdaResponse = response => {
  let lambdaResponse;
  try {
    const functionError = ld.get(response, 'FunctionError');
    if (isValid(functionError) === true) {
      throw new Error(response.Payload);
    }
    lambdaResponse = JSON.parse(response.Payload);
  } catch (exp) {
    pino.error(exp);
    throw exp;
  }
  return lambdaResponse;
};

module.exports = {
  error,
  success,
  parseLambdaResponse,
};
