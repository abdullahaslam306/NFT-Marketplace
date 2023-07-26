const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

/**
 * Creates an error object for common errors
 * @param {object} attrs Can contains attributes e.g. code, httpCode, statusCode,
 */
class CommonError extends Error {
  constructor(attrs) {
    super(attrs);
    pino.error(attrs, 'Common Error - Error Logging');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CommonError);
    }

    this.name = (attrs.code) ? attrs.code : 'Error';
    this.code = (attrs.code) ? attrs.code : 'Error';
    this.status = attrs.httpStatus || attrs.statusCode || attrs.status || 400;
    this.message = (Array.isArray(attrs.details) && attrs.details.length > 0) ? attrs.details[0].message : attrs.message;
  }
}

module.exports = CommonError;
