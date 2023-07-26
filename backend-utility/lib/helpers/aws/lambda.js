/**
 *  Implementation of helper methods related AWS S3
 */

const AWS = require('aws-sdk');
// const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { isValid } = require('../function');
const { LambdaInvocationType } = require('../../configs/enum');

const { STAGE, REGION } = process.env;

/**
 * Invoke lambda
 * @param {String} functionName FunctionName => Function name | Function ARN | Partial ARN
 * @param {object} payload
 * @param {String} invocationType InvocationType => Event | RequestResponse | DryRun
 * @param {String} region
 */
async function invoke(functionName, payload, invocationType = LambdaInvocationType.REQUEST_RESPONSE, region = null, port = null) {
  const awsRegion = isValid(region) === true ? region : REGION;
  const lambdaParams = { region: awsRegion };
  if (STAGE === 'local') {
    lambdaParams.endpoint = new AWS.Endpoint(`http://localhost:${port}`);
    lambdaParams.sslEnabled = false;
  }
  const lambda = new AWS.Lambda(lambdaParams);

  const params = {
    FunctionName: functionName,
    InvocationType: invocationType,
    Payload: JSON.stringify({ payload }),
  };

  if (isValid(invocationType) === true) {
    params.InvocationType = invocationType;
  }
  const lambdaResponse = lambda.invoke(params).promise();
  return lambdaResponse;
}

module.exports = {
  invoke,
};
