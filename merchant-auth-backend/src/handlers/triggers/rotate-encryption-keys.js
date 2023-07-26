const { helpers } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { generateEncryptionKeys } = require('../../common/functions');

const { MERCHANT_APP_CODEPIPELINE, ENCRYPTION_KEYS_SECRET_ID } = process.env;

const { codePipeline, secretsManager } = helpers;
const { startPipelineExecution } = codePipeline;
const { describeSecret, updateSecret } = secretsManager;

/**
 * Handler for scheduled key rotation trigger
 * @param {Object} event
 * @param {Object} context
 */
const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await describeSecret(ENCRYPTION_KEYS_SECRET_ID);
    const encryptionKeys = await generateEncryptionKeys();
    await updateSecret(ENCRYPTION_KEYS_SECRET_ID, encryptionKeys);
    await startPipelineExecution(MERCHANT_APP_CODEPIPELINE);
  } catch (exp) {
    pino.error(exp);
  }
};

module.exports = { handler };
