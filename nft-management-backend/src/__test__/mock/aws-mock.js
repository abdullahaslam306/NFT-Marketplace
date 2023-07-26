const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');
const { configs } = require('backend-utility');

AWS.config.update({ region: configs.defaults.region })
AWSMock.setSDKInstance(AWS);

module.exports = {
  kms: {
    mockKmsDecryptData: () => {
      AWSMock.mock('KMS', 'decrypt', (params, callback) => {
        callback(null, { Plaintext: 'Plain Text' })
      });
    },
  },
  lambda : {
    mockLambdaInvoke: params =>{
      AWSMock.mock('Lambda', 'invoke', (params, callback) => {
        callback(null,params)
    })
  }

  }
}