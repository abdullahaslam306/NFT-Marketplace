/**
 * Handler to get temporary public credential
 */
const AWS = require('aws-sdk');
const Vandium = require('vandium');
const {
  helpers, configs, errors, CommonError,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const JsonSerializer = require('jsonapi-serializer').Serializer;
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const validationMessages = require('../../common/validation-code');

const { enums } = configs;
const { isValid, isValidArray, getRandomString } = helpers.functions;
const { CredentialPermission, TempCredentialActions } = configs.enums;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { InvalidActionSpecified, ProfilePictureNotSetException } = errors.codes;
const { S3_GET_OBJECT } = CredentialPermission;
const {
  S3_NFT_BUCKET_NAME,
  S3_TEMPORARY_ROLE_ARN,
  S3_META_DATA_BUCKET_NAME,
  TEMP_CREDS_SESSION_DURATION,
} = process.env;

const {
  GET_NFT_ASSETS,
  GET_PROFILE_IMAGE
} = TempCredentialActions;

const { LIVE_LOCKED, LAZY_MINTED } = enums.NftStatus;

/**
* 
* @param {Object} event 
* @param {Object} context 
* @param {Object} connection 
*/
const action = async (event, context, connection) => {
context.callbackWaitsForEmptyEventLoop = false;

  try {
    const nftRepo = new repositories.Nft(connection);
    const userRepo = new repositories.User(connection);
    const assetRepo = new repositories.Asset(connection);
    const nftAssetRepo = new repositories.NftAsset(connection);
    const nftUid = event?.queryStringParameters?.uid || null;
    const requestedAction = event?.queryStringParameters?.action || null;

    const nft = await nftRepo.getByUid(nftUid, null, true);
    const nftUserId = nftRepo.getNftUserId(nft);
    const user = await userRepo.getById(nftUserId);
    const userUid = userRepo.getUid(user);
    
    const nftAssets = nftRepo.getNftAssets(nft);
    let prefix;
    let bucketName;
    let roleSession;
    let s3ResourceArn = [];
    const policyAction = [];

    if (requestedAction === GET_NFT_ASSETS) {
      if (nft.status === LAZY_MINTED) {

        nftAssets.forEach(nftLazyMintedAsset => {
          const nftAsset = nftAssetRepo.getAsset(nftLazyMintedAsset);
          const assetUid = assetRepo.getUid(nftAsset);
          bucketName = assetRepo.getBucketName(nftAsset);

          prefix = `assets/${userUid}/${assetUid}`

          const s3AssetResourceArn = getS3ResourceArn(bucketName, prefix, true); // eslint-disable-line no-case-declarations
          s3ResourceArn.push(s3AssetResourceArn);
          policyAction.push(S3_GET_OBJECT);
          roleSession = GET_NFT_ASSETS;
        });
      }
      else if (nft.status === LIVE_LOCKED) {
        prefix = `${nftUid}/assets`
        bucketName = S3_NFT_BUCKET_NAME;
        const s3NftResourceArn = getS3ResourceArn(bucketName, prefix, true); // eslint-disable-line no-case-declarations
        s3ResourceArn.push(s3NftResourceArn);
        policyAction.push(S3_GET_OBJECT);
        roleSession = GET_NFT_ASSETS;
      }
    }
    else if( requestedAction === GET_PROFILE_IMAGE) {
        prefix = userRepo.getPicture(user);
        if (isValid(prefix) === false) {
          throw new CommonError(ProfilePictureNotSetException);
        }
        bucketName = S3_META_DATA_BUCKET_NAME;
        policyAction.push(S3_GET_OBJECT);
        s3ResourceArn = getS3ResourceArn(bucketName, prefix);
        roleSession = GET_PROFILE_IMAGE;
    }
    else {
      throw new CommonError( InvalidActionSpecified);
     
    }

    policyParams = await generatePolicy(policyAction, s3ResourceArn, roleSession);
    const stsResponse = await getCredentials(policyParams);

    apiResponse = {
       s3: {
        prefix,
        bucketName,
      },
      credentials: {
        accessKeyId: stsResponse?.Credentials?.AccessKeyId || null,
        secretAccessKey: stsResponse?.Credentials?.SecretAccessKey || null,
        sessionToken: stsResponse?.Credentials?.SessionToken || null,
        expiration: stsResponse?.Credentials?.Expiration || null,
      },
    };
    response = successResponse('TemporaryPublicCredentials', serialize(apiResponse));

  } catch (exp) {
    pino.error(exp, 'Exception in creating temporary public credentials');
    response = errorResponse(exp);
  }
  return response;
}

/**
* Get s3 resource arn
* @param {String} bucketName
* @param {String} prefix
* @param {Boolean} accessAllObjects
*/
function getS3ResourceArn(bucketName, prefix, accessAllObjects = false) {
  const arn = prefix ? `arn:aws:s3:::${bucketName}/${prefix}` : `arn:aws:s3:::${bucketName}`;
  return accessAllObjects === true ? `${arn}/*` : arn;
}

/**
 * Generate policy for temporary credentials
 * @param {String} policyAction
 * @param {String} s3ResourceArn
 * @param {String} roleSession
 */
 function generatePolicy(policyAction, s3ResourceArn, roleSession) {
  const randomString = getRandomString();
  const resourceArn = isValidArray(s3ResourceArn) === true ? s3ResourceArn : [s3ResourceArn];
  const policy = {
    Version: '2012-10-17',
    Statement: [{
      Sid: `${roleSession}${randomString}`,
      Action: policyAction,
      Effect: 'Allow',
      Resource: resourceArn,
    }],
  };
  const params = {
    DurationSeconds: TEMP_CREDS_SESSION_DURATION,
    RoleArn: `${S3_TEMPORARY_ROLE_ARN}`,
    Policy: JSON.stringify(policy),
    RoleSessionName: roleSession,
  };
  return params;
}

/**
 * Get temporary credentials
 * @param {Object} params
 */
const getCredentials = async params => {
  try {
    const sts = new AWS.STS({ apiVersion: '2012-08-10' });
    const stsResponse = await sts.assumeRole(params).promise();
    return stsResponse;
  } catch (exp) {
    pino.error(exp, 'Exception in creating temporary credentials');
    throw exp;
  }
};

/**
 * Request validation schema
 */
 const validationSchema = () =>
 // eslint-disable-next-line no-useless-escape
 ({
   queryStringParameters: {
     action: Vandium.types.string().trim().required()
       .valid(...Object.values(TempCredentialActions))
       .error(validationError => helpers.joi.makeValidationMessage(validationMessages, validationError, 'authorization')),
   },
 });

/**
 * Serialize temporary public credentials response
 * @param {Object} data
 */
 function serialize(data) {
  // eslint-disable-next-line prefer-object-spread
  return new JsonSerializer('tempPublicCredentials', Object.assign({
    attributes: [
      's3',
      'credentials',
    ],
    keyForAttribute: 'camelCase',
  })).serialize(data);
}

module.exports = {
  action,
  validationSchema,
};