const joi = require('./joi');
const s3 = require('./aws/s3');
const kms = require('./aws/kms');
const ssm = require('./aws/ssm');
const ses = require('./aws/ses');
const sns = require('./aws/sns');
const SQS = require('./aws/sqs');
const vandium = require('./vandium');
const lambda = require('./aws/lambda');
const responses = require('./response');
const functions = require('./function');
const cognito = require('./aws/cognito');
const blockchain = require('./wallet-helper');
const codePipeline = require('./aws/codepipeline');
const secretsManager = require('./aws/secrets-manager');
const PubNub = require('./pubnub');

module.exports = {
  s3,
  joi,
  kms,
  ses,
  sns,
  SQS,
  ssm,
  lambda,
  cognito,
  vandium,
  functions,
  responses,
  blockchain,
  codePipeline,
  secretsManager,
  PubNub,
};
