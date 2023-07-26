/**
 *  Handler to create asset thumbnail
 */

 import * as Sharp from 'sharp';
 import { database, repositories } from 'data-access-utility';
 import { helpers, errors, configs, CommonError } from 'backend-utility';

 const { enums } = configs;
 const { IMAGE } = enums.AssetTypes;
 const { isValid } = helpers.functions;
 
 const { s3 } = helpers;
 const { AssetFileNotFoundException } = errors.codes;
 const { S3_META_DATA_BUCKET_NAME, THUMBNAIL_WIDTH } = process.env;
 
 /**
  * Handler for creating asset thumbnail
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  * @returns 
  */
 export const handler = async (event:AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => {
   let response;
   let connection:any;
   try {
     const { payload }  = event;
     const { assetUid, userId, originalPath } = payload;

     let buffer:any;
     let originalImage:any;
     let thumbnailPath:string;
     let s3ExistFlag:boolean;
     
     s3ExistFlag = await s3.isObjectExists(S3_META_DATA_BUCKET_NAME, originalPath)

     if(s3ExistFlag === false){
      throw new CommonError(AssetFileNotFoundException);
     }
      originalImage = await s3.getObject(S3_META_DATA_BUCKET_NAME, originalPath)
      buffer = await Sharp(originalImage.Body).resize(parseInt(THUMBNAIL_WIDTH)).toBuffer();
      thumbnailPath = getThumbnailPath(originalPath);
      
      await s3.putObject(S3_META_DATA_BUCKET_NAME, thumbnailPath, buffer, IMAGE);

      connection = database.openConnection();
      const assetRepo = new repositories.Asset(connection);
      let asset = await assetRepo.getByUid(assetUid, userId);
      await assetRepo.update(asset, null, null, thumbnailPath);
  } catch (error){
    if(isValid(connection) === true){
      database.closeConnection(connection);
    }
  }
 };

/**
 * create asset thumbnail path
 * @param originalPath 
 * @returns thumbnail string
 */
 export const getThumbnailPath = (originalPath:any) => {
  let fileName = originalPath.split('/').pop();
  return originalPath.replace(fileName,'') + 'thumbnails/' + 'thumbnail-' + fileName;
 }