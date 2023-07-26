/**
 * Handler to get temporary credential
 */
const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');
const Vandium = require('vandium');
const {
  helpers, configs, errors, CommonError,
} = require('backend-utility');
const { repositories } = require('data-access-utility');
const JsonSerializer = require('jsonapi-serializer').Serializer;
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const validationMessages = require('../../common/validation-code');

const { isValid, isValidArray, getRandomString } = helpers.functions;
const { TempCredentialActions, CredentialPermission } = configs.enums;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { InvalidActionSpecified, ProfilePictureNotSetException } = errors.codes;
const { S3_FILE_UPLOAD, S3_GET_OBJECT, S3_ABORT_UPLOAD } = CredentialPermission;
const {
  UPLOAD_ASSET,
  GET_PROFILE_IMAGE,
  GET_UPLOADED_NFTS,
  GET_UPLOADED_ASSETS,
  UPLOAD_PROFILE_IMAGE,
  UPLOAD_ASSET_THUMBNAIL,
} = TempCredentialActions;

const {
  S3_NFT_BUCKET_NAME,
  S3_TEMPORARY_ROLE_ARN,
  S3_META_DATA_BUCKET_NAME,
  TEMP_CREDS_SESSION_DURATION,
} = process.env;

const { getUserUid, getUserId } = helpers.functions;

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
 * Temporary credential Handler
 * @param {Object} event
 * @param {Object} context
 * @param {Object} connection
 */
const action = async (event, context, connection) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;

  let prefix;
  let randomUid;
  let apiResponse;
  let roleSession;
  let policyParams;
  let s3ResourceArn;
  let response = null;
  const policyAction = [];

  const userId = getUserId(context);
  const userUid = getUserUid(context);
  const nftRepo = new repositories.Nft(connection);
  const userRepo = new repositories.User(connection);
  const assetRepo = new repositories.Asset(connection);
  const nftOwnerRepo = new repositories.NftOwner(connection);
  const requestedAction = event?.queryStringParameters?.action || null;
  const assetUid = event?.queryStringParameters?.assetUid || null;

  try {
    switch (requestedAction) {
      case UPLOAD_PROFILE_IMAGE:
        randomUid = uuid();
        prefix = `profile-images/${userUid}/${randomUid}`;
        policyAction.push(S3_FILE_UPLOAD, S3_GET_OBJECT, S3_ABORT_UPLOAD);
        s3ResourceArn = getS3ResourceArn(S3_META_DATA_BUCKET_NAME, prefix, true);
        roleSession = UPLOAD_PROFILE_IMAGE;
        break;

      case GET_PROFILE_IMAGE:
        // eslint-disable-next-line no-case-declarations
        const user = await userRepo.getById(userId);
        prefix = userRepo.getPicture(user);
        if (isValid(prefix) === false) {
          throw new CommonError(ProfilePictureNotSetException);
        }
        policyAction.push(S3_GET_OBJECT);
        s3ResourceArn = getS3ResourceArn(S3_META_DATA_BUCKET_NAME, prefix);
        roleSession = GET_PROFILE_IMAGE;
        break;

      case UPLOAD_ASSET:
        prefix = `assets/${userUid}/${assetUid}`;
        policyAction.push(S3_FILE_UPLOAD, S3_GET_OBJECT, S3_ABORT_UPLOAD);
        s3ResourceArn = getS3ResourceArn(S3_META_DATA_BUCKET_NAME, prefix, true);
        roleSession = UPLOAD_ASSET;
        break;

      case GET_UPLOADED_ASSETS:
        await assetRepo.getByUserId(userId);
        prefix = `assets/${userUid}`;
        policyAction.push(S3_GET_OBJECT);
        s3ResourceArn = getS3ResourceArn(S3_META_DATA_BUCKET_NAME, prefix, true);
        roleSession = GET_UPLOADED_ASSETS;
        break;

      case UPLOAD_ASSET_THUMBNAIL:
        await assetRepo.getByUid(assetUid, userId);
        randomUid = uuid();
        prefix = `assets/${userUid}/${assetUid}/thumbnail/${randomUid}`;
        policyAction.push(S3_FILE_UPLOAD, S3_GET_OBJECT, S3_ABORT_UPLOAD);
        s3ResourceArn = getS3ResourceArn(S3_META_DATA_BUCKET_NAME, prefix, true);
        roleSession = UPLOAD_ASSET_THUMBNAIL;
        break;

      case GET_UPLOADED_NFTS:
        await nftOwnerRepo.getAllByCriteria(userId, null, true, true);
        prefix = `assets/${userUid}`; // eslint-disable-line no-case-declarations
        const s3AssetResourceArn = getS3ResourceArn(S3_META_DATA_BUCKET_NAME, prefix, true); // eslint-disable-line no-case-declarations
        const s3NftResourceArn = getS3ResourceArn(S3_NFT_BUCKET_NAME, false, true); // eslint-disable-line no-case-declarations
        s3ResourceArn = [s3AssetResourceArn, s3NftResourceArn];
        policyAction.push(S3_GET_OBJECT);
        roleSession = GET_UPLOADED_NFTS;
        break;

      default:
        throw new CommonError(InvalidActionSpecified);
    }

    policyParams = await generatePolicy(policyAction, s3ResourceArn, roleSession);
    const stsResponse = await getCredentials(policyParams);

    apiResponse = {
      //  For getAllNfts action, the nft bucket and prefix are not shared as they are being provided from asset table in nft related apis
      s3: {
        prefix,
        bucketName: S3_META_DATA_BUCKET_NAME,
      },
      credentials: {
        accessKeyId: stsResponse?.Credentials?.AccessKeyId || null,
        secretAccessKey: stsResponse?.Credentials?.SecretAccessKey || null,
        sessionToken: stsResponse?.Credentials?.SessionToken || null,
        expiration: stsResponse?.Credentials?.Expiration || null,
      },
    };
    response = successResponse('TemporaryCredentials', serialize(apiResponse));
  } catch (exp) {
    pino.error(exp, 'Exception in creating temporary credentials');
    response = errorResponse(exp);
  }
  return response;
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
      assetUid: Vandium.types.any()
        .when('action', {
          is: Vandium.types.string().valid(UPLOAD_ASSET, UPLOAD_ASSET_THUMBNAIL),
          then: Vandium.types.string().required().guid({ version: 'uuidv4' }),
        }).when('action', {
          not: Vandium.types.string().valid(UPLOAD_ASSET, UPLOAD_ASSET_THUMBNAIL),
          then: Vandium.types.any().forbidden(),
        })
        .error(validationError => helpers.joi.makeValidationMessage(validationMessages, validationError, 'authorization')),
    },
  });

/**
 * Serialize temporary credentials response
 * @param {Object} data
 */
function serialize(data) {
  // eslint-disable-next-line prefer-object-spread
  return new JsonSerializer('tempCredentials', Object.assign({
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
