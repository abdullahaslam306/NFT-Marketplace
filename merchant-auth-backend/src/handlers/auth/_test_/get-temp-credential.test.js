const AWS = require('aws-sdk');
const { expect } = require('chai');
const AWSMock = require('aws-sdk-mock');
const { configs, errors } = require('backend-utility');

const { action } = require('../get-temp-credential');
AWSMock.setSDKInstance(AWS);
const { InvalidActionSpecified } = errors.codes;
const { 
  UPLOAD_ASSET,
  GET_PROFILE_IMAGE,  
  GET_UPLOADED_ASSETS,
  UPLOAD_PROFILE_IMAGE,  
  UPLOAD_ASSET_THUMBNAIL, 
} = configs.enums.TempCredentialActions;

const createEvent = triggerSource => ({
  queryStringParameters: {
    action: triggerSource,
  },
});

const createContext = () => ({
  event: {
    requestContext: { 
      authorizer: {
        uid: 'c50e932a-b780-44c6-badc-709b7cef800c'
      }
    }
  }
})

const mockCredentials = {
  AccessKeyId: 'valid-key-id',
  SecretAccessKey: 'valid-secret-access-key',
  SessionToken: 'valid-session-token',
  Expiration: 'valid-expiration',
};
const mockSTS = () => {
  AWSMock.mock('STS', 'assumeRole', (params, callback) => {
    callback(null,{
      Credentials: mockCredentials
    })
  });
}

describe('Get temporary credentials', () => {

  beforeEach(()=>{
    mockSTS();    
  });

  afterEach(()=>{
    AWSMock.restore('STS', 'assumeRole');
  });

  it('should PASS if action is uploadProfileImage', async () => {
    const event = createEvent(UPLOAD_PROFILE_IMAGE);
    const context = createContext();
    const result = await action(event, context);
    expect(result).to.not.undefined;
    expect(result.statusCode).to.not.undefined;
    expect(result.statusCode).to.equal(200);
    const { data } = result.body.response;
    expect(data).to.have.nested.property('attributes.s3');
    expect(data).to.have.nested.property('attributes.credentials');
    const { credentials } = data.attributes;
    expect(credentials).to.have.property('accessKeyId', mockCredentials.AccessKeyId);
    expect(credentials).to.have.property('secretAccessKey', mockCredentials.SecretAccessKey);
    expect(credentials).to.have.property('sessionToken', mockCredentials.SessionToken);
    expect(credentials).to.have.property('expiration', mockCredentials.Expiration);
  });

  it('should PASS if action is getProfileImage', async () => {
    const event = createEvent(GET_PROFILE_IMAGE);
    const context = createContext();
    const result = await action(event, context);
    expect(result).to.not.undefined;
    expect(result.statusCode).to.not.undefined;
    expect(result.statusCode).to.equal(200);
    const { data } = result.body.response;
    expect(data).to.have.nested.property('attributes.s3');
    expect(data).to.have.nested.property('attributes.credentials');
    const { credentials } = data.attributes;
    expect(credentials).to.have.property('accessKeyId', mockCredentials.AccessKeyId);
    expect(credentials).to.have.property('secretAccessKey', mockCredentials.SecretAccessKey);
    expect(credentials).to.have.property('sessionToken', mockCredentials.SessionToken);
    expect(credentials).to.have.property('expiration', mockCredentials.Expiration);
  });

  it('should PASS if action is get uploadedAssets', async () => {
    const event = createEvent(GET_UPLOADED_ASSETS);
    const context = createContext();
    const result = await action(event, context);
    expect(result).to.not.undefined;
    expect(result.statusCode).to.not.undefined;
    expect(result.statusCode).to.equal(200);
    const { data } = result.body.response;
    expect(data).to.have.nested.property('attributes.s3');
    expect(data).to.have.nested.property('attributes.credentials');
    const { credentials } = data.attributes;
    expect(credentials).to.have.property('accessKeyId', mockCredentials.AccessKeyId);
    expect(credentials).to.have.property('secretAccessKey', mockCredentials.SecretAccessKey);
    expect(credentials).to.have.property('sessionToken', mockCredentials.SessionToken);
    expect(credentials).to.have.property('expiration', mockCredentials.Expiration);
  });

  it('should PASS if action is uploadAsset', async () => {
    const event = createEvent(UPLOAD_ASSET);
    const context = createContext();
    const result = await action(event, context);
    expect(result).to.not.undefined;
    expect(result.statusCode).to.not.undefined;
    expect(result.statusCode).to.equal(200);
    const { data } = result.body.response;
    expect(data).to.have.nested.property('attributes.s3');
    expect(data).to.have.nested.property('attributes.credentials');
    const { credentials } = data.attributes;
    expect(credentials).to.have.property('accessKeyId', mockCredentials.AccessKeyId);
    expect(credentials).to.have.property('secretAccessKey', mockCredentials.SecretAccessKey);
    expect(credentials).to.have.property('sessionToken', mockCredentials.SessionToken);
    expect(credentials).to.have.property('expiration', mockCredentials.Expiration);
  });

  it('should PASS if action is uploadAssetThumbnail', async () => {
    const event = createEvent(UPLOAD_ASSET_THUMBNAIL);
    const context = createContext();
    const result = await action(event, context);
    expect(result).to.not.undefined;
    expect(result.statusCode).to.not.undefined;
    expect(result.statusCode).to.equal(200);
    const { data } = result.body.response;
    expect(data).to.have.nested.property('attributes.s3');
    expect(data).to.have.nested.property('attributes.credentials');
    const { credentials } = data.attributes;
    expect(credentials).to.have.property('accessKeyId', mockCredentials.AccessKeyId);
    expect(credentials).to.have.property('secretAccessKey', mockCredentials.SecretAccessKey);
    expect(credentials).to.have.property('sessionToken', mockCredentials.SessionToken);
    expect(credentials).to.have.property('expiration', mockCredentials.Expiration);
  });
  
  it('should FAIL if action is not valid', async () => {
    const event = createEvent('');
    const context = createContext();
    const result = await action(event, context);
    expect(result).to.not.undefined;
    expect(result.statusCode).to.not.undefined;
    expect(result.statusCode).to.equal(400);
    const { response, responseCode } = result.body;
    expect(responseCode).to.equal(InvalidActionSpecified.code);
    expect(response).to.equal(InvalidActionSpecified.message);
  });
});
  