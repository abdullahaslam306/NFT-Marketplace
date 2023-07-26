/**
 * Handler to delete asset
 */
 import * as Vandium from 'vandium';
 import { helpers, configs, CommonError, errors } from 'backend-utility';
 import { repositories } from 'data-access-utility';
 
 import { logger } from '../../common/utils/logger';
 import { validationMessages } from '../../common/validation-code/en';
 
 const { enums } = configs;
 const { PROCESSED } = enums.AssetStatus;
 const { S3_META_DATA_BUCKET_NAME } = process.env;
 
  const { DeleteAsset } = configs.responses;
  const { functions, responses, s3 } = helpers;
  const { getUserId, getUserUid,isValid } = functions;
  const { AssetIsNftException } = errors.codes;
  const { error: errorResponse, success: successResponse } = responses;
  const { code: deleteAssetSuccessCode, message: deleteAssetSuccessMessage } = DeleteAsset;
 
  /**
  * Delete asset handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  * @param {dbconnection} connection
  */
  export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
   // eslint-disable-next-line no-useless-escape 
   context.callbackWaitsForEmptyEventLoop = false;
    let response: any;
    let transaction: any;
    try {
      let userId = getUserId(context);
      let userUid = getUserUid(context);
      const assetUid = event?.pathParameters?.uid || null;
      transaction = await connection.sequelize.transaction();
      
      const assetRepo = new repositories.Asset(connection);
      const nftAssetRepo = new repositories.NftAsset(connection);

      const asset = await assetRepo.getByUid(assetUid, userId);
      const assetId = assetRepo.getId(asset); 
      const assetStatus = assetRepo.getStatus(asset);

      if (assetStatus === PROCESSED) {
        const nftAsset = await nftAssetRepo.getByAssetId(assetId);
        if (isValid(nftAsset) === true) {
          throw new CommonError(AssetIsNftException);
        }
      }

      const assetDir = `assets/${userUid}/${assetUid}`;
      await s3.deleteDirectory( S3_META_DATA_BUCKET_NAME, assetDir );      
      await assetRepo.delete(asset, transaction);
      response = successResponse(deleteAssetSuccessCode, deleteAssetSuccessMessage);
      transaction.commit();
    } catch (exp) {
      logger.error(exp);
      response = await errorResponse(exp);
      transaction.rollback();
    }
    return response;
  };
 
 
 /**
  * Request validation schema
  */
  export const validationSchema = () =>
  // eslint-disable-next-line no-useless-escape
  ({
    pathParameters: {
      uid:  Vandium.types.string().trim().guid({ version: 'uuidv4' })
      .required()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
    },
  });