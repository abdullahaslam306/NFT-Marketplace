const ld = require('lodash');
const AWS = require('aws-sdk');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const { database, repositories } = require('data-access-utility');
const { helpers, InvalidTokenError, AuthPolicy } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const apiOptions = {};
const { isValid } = helpers.functions;
const { MERCHANT_COGNITO_USERPOOL_ID } = process.env;
const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

/**
 * Decode and validate access token
 * @param { String } token access token for user
 * @param { String } jwkUri URI to get JWK(Json web keys)
 * @return result verify and decoded token if verified
 */
async function decodeValidateToken(token, jwkUri) {
  let jwk;
  let decoded;
  try {
    pino.info(`Token : ${token}`);
    decoded = jwt.decode(token, { complete: true });
    pino.info(`Decoded Token : ${decoded}`);
    const { kid } = decoded.header;
    const jwkResponse = await axios.get(jwkUri);

    pino.info(`jwkResponse :  ${jwkResponse.data}`);

    if (isValid(jwkResponse) === true) {
      jwk = ld.find(jwkResponse.data.keys, ['kid', kid]);
    }

    if (isValid(jwk) !== true) {
      pino.info('Token KID not found.');
      throw new InvalidTokenError('Token KID not found');
    }

    const pem = jwkToPem(jwk);
    await jwt.verify(token, pem, { algorithms: ['RS256'] });
  } catch (exp) {
    pino.error(exp);
    throw new InvalidTokenError('Invalid Access Token');
  }
  return decoded;
}

/**
 * Get user info from cognito
 * @param {Object} params
 * @returns CognitoSid for the user to whom the token belongs
 */
async function getUserCognitoSid(params) {
  const userResponse = await CognitoIdentityServiceProvider.getUser(params).promise();
  const cognitoSid = ld.find(userResponse.UserAttributes, obj => obj.Name === 'sub').Value;
  return cognitoSid;
}

/**
 * Handler for authroizer
 * @param {AWSLambda.Event} event
 * @returns
 */
async function handler(event) {
  let policy;
  let dbConnection = {};
  pino.info(`event : ${event}`);

  try {
    const apiArn = event.methodArn;
    pino.info(`apiarn : ${apiArn}`);
    const routerArn = apiArn.split(':');
    const region = routerArn[3];
    const apiGatewayArnTmp = routerArn[5].split('/');
    const restApiId = apiGatewayArnTmp[0];
    const stage = apiGatewayArnTmp[1];
    const awsAccountId = routerArn[4];

    apiOptions.region = region;
    apiOptions.restApiId = restApiId;
    apiOptions.stage = stage;

    dbConnection = await database.openConnection();
    pino.info(`Event : ${event}`);
    const [accessToken] = event.authorizationToken.split(' ').splice(-1);
    pino.info(`access token : ${accessToken}`);

    const cognitoJWKUrl = `https://cognito-idp.${region}.amazonaws.com/${MERCHANT_COGNITO_USERPOOL_ID}/.well-known/jwks.json`;
    pino.info(`JWKURI : ${cognitoJWKUrl}`);

    const decodedToken = await decodeValidateToken(accessToken, cognitoJWKUrl);
    pino.info(`Decode token:  ${decodedToken}`);

    // Verify token_use
    const tokenUse = ld.get(decodedToken, 'payload.token_use');
    if (tokenUse !== 'access') {
      pino.info('token_use is not access.');
      throw new InvalidTokenError('Invalid Token');
    }

    const params = {
      AccessToken: accessToken,
    };

    const userCognitoSid = await getUserCognitoSid(params);
    const tokenCognitoSid = ld.get(decodedToken, 'payload.sub');

    if (userCognitoSid !== tokenCognitoSid) {
      throw new InvalidTokenError('Invalid Access Token');
    }

    const userRepo = new repositories.User(dbConnection);
    const merchantRepo = new repositories.Merchant(dbConnection);
    const merchant = await merchantRepo.getBySid(userCognitoSid);
    const userId = merchantRepo.getUserId(merchant);
    const user = await userRepo.getById(userId, false, false, false);
    const userUid = userRepo.getUid(user);

    if (!(user instanceof dbConnection.user)) {
      throw new InvalidTokenError('Invalid Access Token');
    }
    const userAccountStatus = userRepo.getStatus(user);

    if (isValid(userAccountStatus) === false || userAccountStatus === userAccountStatus.LOCKED) {
      throw new InvalidTokenError('Account is Locked');
    }

    apiOptions.context = {
      user_id: userId,
      uid: userUid,
      user_cognito_sid: userCognitoSid,
    };

    policy = new AuthPolicy(tokenCognitoSid, awsAccountId, apiOptions);

    policy.allowAllMethods();
    const iamPolicy = policy.build();
    return Promise.resolve(iamPolicy);
  } catch (exp) {
    if (exp.name === 'TokenExpiredError' || exp.name === 'InvalidTokenError' || exp.name === 'NotAuthorizedException') {
      pino.error(exp, 'Returning Unauthorized 401');
      throw new Error('Unauthorized');
    }
    pino.error(exp, 'Returning Access Denied 403');

    policy.denyAllMethods();
    const iamPolicy = policy.build();
    return ('Unauthorized', iamPolicy);
  } finally {
    if (dbConnection) {
      database.closeConnection(dbConnection);
    }
  }
}

module.exports = {
  handler,
};
