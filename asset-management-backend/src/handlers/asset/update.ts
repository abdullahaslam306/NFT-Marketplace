/**
 * Handler to update asset
 */
 import * as Vandium from 'vandium';
 import { repositories } from 'data-access-utility';
 import { helpers, configs, CommonError, errors } from 'backend-utility';
 import { validationMessages } from '../../common/validation-code/en';

 import { logger } from '../../common/utils/logger';
 
 const { enums } = configs;
 const { responses, s3, lambda } = helpers;
 const { IMAGE } = enums.AssetTypes;
 const { AssetStatus } = configs.enums;
 const { UpdateAsset } = configs.responses;
 const { isValid, getUserId } = helpers.functions;
 const { EVENT } = configs.enums.LambdaInvocationType;
 const { S3_META_DATA_BUCKET_NAME, STAGE, REGION } = process.env;
 const { error: errorResponse, success: successResponse } = responses;
 const { code: updateAssetSuccessCode, message: updateAssetSuccessMessage } = UpdateAsset;

 const { 
   EmptyAttributeException,
   InvalidThumbnailPathException, 
   InvalidOriginalPathException,
   UpdateThumbnailPathException
  } = errors.codes;

   /**
    * Update asset handler
    * @param {AWSLambda.APIGatewayEvent} event
    * @param {AWSLambda.Context} context
    */
  export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    let response: any;
    let transaction: any;
    try {  
      let status = null;
      const assetName = event?.body?.name || null;
      const assetUid = event?.pathParameters?.uid || null;
      const originalPath = event?.body?.originalPath || null;
      const thumbnailPath = event?.body?.thumbnailPath || null;

      let userId = getUserId(context);
      
      transaction = await connection.sequelize.transaction();

      if ( !( isValid(assetName) || isValid(thumbnailPath) || isValid(originalPath)) ){
        throw new CommonError(EmptyAttributeException); 
      }
      
      const assetRepo = new repositories.Asset(connection);
      const asset = await assetRepo.getByUid(assetUid, userId);
      const assetType = assetRepo.getType(asset);

      // If thumbnail if provided and asset type is image, exception will be generated
      if ( isValid(thumbnailPath) === true && assetType === IMAGE) {
        throw new CommonError( UpdateThumbnailPathException );
      }

      // If thumbnail path is provided and it matches thumbnail path in DB exception is generated
      // Otherwise it will delete older thumbnail path from S3
      if ( isValid(thumbnailPath) === true){
        let assetThumbnailPath = assetRepo.getThumbnailPath(asset);
        if(assetThumbnailPath === thumbnailPath) {
          throw new CommonError( UpdateThumbnailPathException );
        }
        s3.deleteS3Object( S3_META_DATA_BUCKET_NAME, assetThumbnailPath );
      
      }
      
      if ( isValid(originalPath) === true){
        const assetOriginalPath = assetRepo.getOriginalPath(asset);
        if ( isValid(assetOriginalPath) === true && assetOriginalPath !== originalPath ){
          throw new CommonError( InvalidOriginalPathException );
        } else if(isValid(assetOriginalPath) === false && assetType === IMAGE) {
          const payload = {
            userId,
            assetUid,
            originalPath
          };
          await lambda.invoke(`asset-management-backend-${STAGE}-AssetThumbnail`, payload, EVENT, REGION, 3104);
        }
        status = AssetStatus.PROCESSED;
      }

      const lambdaResponse = await assetRepo.update(asset, assetName, originalPath, thumbnailPath, status, transaction);
      logger.info(lambdaResponse);

      response = successResponse(updateAssetSuccessCode, updateAssetSuccessMessage);
      await transaction.commit();
    } catch (exp) {
      logger.error(exp);
      response = errorResponse(exp);
      if (isValid(transaction) === true) {
        await transaction.rollback();
      }
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
    body: {
      name: Vandium.types.string().max(50)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
      thumbnailPath: Vandium.types.string()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),   
      originalPath: Vandium.types.string()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),     
    },
  });