/**
 *  Implementation of helper methods related AWS-SSM
 */

const aws = require('aws-sdk');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { isValid } = require('../function');

const ssm = new aws.SSM({ region: 'us-east-1' });

/**
 * Helper function for updating erc721 smart contract address
 * @param {String} key
 * @param {String} value
 * @returns
 */
async function updateKey(key, value, type) {
  let status = false;
  if (isValid(key) === true) {
    try {
      const params = {
        Name: key,
        Value: value,
        Overwrite: true,
        Type: type,
      };
      await ssm.putParameter(params).promise();
      status = true;
    } catch (exp) {
      pino.error(exp);
    }
  }
  return status;
}

module.exports = {
  updateKey,
};
