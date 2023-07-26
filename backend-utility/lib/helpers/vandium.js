const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const vandium = require('vandium');
// const { error: createErrorResponse } = require('./response');
const CommonError = require('./errors/common-error');

const init = (protectionMode = 'fail', corsAllowOrigin = '*', corsAllowCredentials = true) => vandium.api()
  .protection({
    mode: protectionMode,
  })
  .cors({
    allowOrigin: corsAllowOrigin,
    allowCredentials: corsAllowCredentials,
  })
  .onError(err => {
    let error = err;
    if (err.isJoi === true) {
      error = new CommonError(err);
      pino.error(error, 'Vandium Handle - Validation Exception');
    }
    pino.error(err, 'Vandium Handle - Exception');
    return error;
  });

module.exports = { init };
