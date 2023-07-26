const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

/**
 * Creates an error object for blockchain error
 * @param {object} attrs Can contains attributes e.g. code, httpCode, statusCode,
 */
class BlockChainError extends Error {
  constructor(attrs) {
    super(attrs);
    pino.error(attrs, 'BlockChain Error - Error Logging');

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlockChainError);
    }

    this.name = (attrs.code) ? attrs.code : 'BlockChainError';
    this.code = (attrs.code) ? attrs.code : 'BlockChainError';
    this.status = 400;
    this.message = (Array.isArray(attrs.details) && attrs.details.length > 0) ? attrs.details[0].message : attrs.message;
  }
}

module.exports = BlockChainError;
