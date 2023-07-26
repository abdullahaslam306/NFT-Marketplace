const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

/**
 * Creates an error object for invalid token error
 * @param {object} attrs Can contains attributes e.g. code, httpCode, statusCode,
 */
class InvalidTokenError extends Error {
  constructor(attrs) {
    super(attrs);
    pino.error(attrs, 'Invalid Token Error - Error Logging');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTokenError);
    }

    this.name = (attrs.code) ? attrs.code : 'InvalidTokenError';
    this.code = (attrs.code) ? attrs.code : 'InvalidTokenError';
    this.status = 401;
    this.message = (Array.isArray(attrs.details) && attrs.details.length > 0) ? attrs.details[0].message : attrs.message;
  }
}

module.exports = InvalidTokenError;
