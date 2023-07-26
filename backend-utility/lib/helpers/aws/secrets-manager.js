/**
 * Implementation of helper methods related AWS Secret Manager
 */

const aws = require('aws-sdk');
const { isValid } = require('../function');

const { REGION } = process.env;

/**
 * Helper function to get secret
 * @param {String} secretId
 * @param {String} versionId
 * @returns {String} secret
 */
async function getSecret(secretId, versionId = null) {
  const secretsManager = new aws.SecretsManager({ region: REGION });
  const params = {
    SecretId: secretId,
  };
  if (isValid(versionId) === true) {
    params.VersionId = versionId;
  }

  const { SecretString } = await secretsManager.getSecretValue(params).promise();
  return SecretString;
}

/**
 * Helper function to update secret
 * @param {String} secretId
 * @param {Object} secret
 * @returns {String} update response
 */
async function updateSecret(secretId, secret) {
  const secretsManager = new aws.SecretsManager({ region: REGION });
  const response = await secretsManager.putSecretValue({
    SecretId: secretId,
    SecretString: JSON.stringify(secret), // Keys in json format
  }).promise();
  return response;
}

/**
 * Helper function to describe secret
 * @param {String} secretId
 * @returns {String} response
 */
async function describeSecret(secretId) {
  const secretsManager = new aws.SecretsManager({ region: REGION });
  const response = await secretsManager.describeSecret({
    SecretId: secretId,
  }).promise();
  return response;
}

module.exports = {
  getSecret,
  updateSecret,
  describeSecret,
};
