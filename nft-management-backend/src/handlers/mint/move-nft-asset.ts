/**
 * Handler to move asset
 */

import * as Sequelize from 'sequelize';
import { repositories, database } from 'data-access-utility';
import { CommonError, helpers, errors, configs } from 'backend-utility';

import { logger } from '../../common/utils/logger';

const { functions, lambda, s3 } = helpers;
const { enums } = configs;
const { copyContent } = s3;
const { PROCESSED } = enums.AssetStatus;
const { EVENT } = enums.LambdaInvocationType;
const { isValidArray, isValid } = functions;
const { NftAssetNotFoundException } = errors.codes;

const { REGION, S3_USER_META_DATA_BUCKET_NAME, S3_NFT_META_DATA_BUCKET_NAME, STAGE } = process.env;

/**
 * move asset handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const handler = async (event, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let connection;
  let transaction: Sequelize.Transaction;

  // TODO : Add logic to check assets are already moved to nft bucket
  try {
    const { payload } = event;
    const { nftUid, userId } = payload;
    
    let originalPath: string;
    let thumbnailPath :string;
    let newthumbnailPath = null;
    const assetAssociation = [];
    
    connection = database.openConnection();
    
    const nftRepo = new repositories.Nft(connection);
    const assetRepo = new repositories.Asset(connection);
    const nftAssetRepo = new repositories.NftAsset(connection);

    const nft = await nftRepo.getByUid(nftUid, userId, true);
    const nftId = nftRepo.getId(nft);
    const nftAssets = nftRepo.getNftAssets(nft);
    
    if(isValidArray(nftAssets) === false){
      throw new CommonError(NftAssetNotFoundException);
    }

    transaction = await connection.sequelize.transaction();

    for (const nftAsset of nftAssets){

      const assetType = nftAssetRepo.getAssetType(nftAsset);
      const asset = nftAssetRepo.getAsset(nftAsset);
      const newAsset = await assetRepo.copy(asset, S3_NFT_META_DATA_BUCKET_NAME, true, transaction);
      const id = assetRepo.getId(newAsset);

      const assetInfo = {
        id,
        type: assetType,
      }
      assetAssociation.push(assetInfo);
      
      originalPath = assetRepo.getOriginalPath(asset);
      thumbnailPath = assetRepo.getThumbnailPath(asset);
      const assetUid = assetRepo.getUid(newAsset);

      // create new path prefix for asset
      const newPathPrefix = `${nftUid}/assets/${assetUid}`;
      const oldPathPrefix = getOldPathPrefix(originalPath);
      const newOriginalPath = originalPath.replace(oldPathPrefix, newPathPrefix);
      
      logger.info(`NEW PATH PREFIX : ${newPathPrefix}`);
      logger.info(`OLD PATH PREFIX : ${oldPathPrefix}`);
      logger.info(`NEW PATH : ${newOriginalPath}`);

      // move thumbn.ail and orignal assets to nft bucket
      const response = await copyContent(S3_USER_META_DATA_BUCKET_NAME, originalPath, S3_NFT_META_DATA_BUCKET_NAME, newOriginalPath);

      logger.info(response);

      if(isValid(thumbnailPath) === true){
        newthumbnailPath = thumbnailPath.replace(oldPathPrefix, newPathPrefix);
        logger.info(`NEW THUMBNAIL PATH : ${newthumbnailPath}`);
        const copyResponse = await copyContent(S3_USER_META_DATA_BUCKET_NAME, thumbnailPath, S3_NFT_META_DATA_BUCKET_NAME, newthumbnailPath);
        logger.info(copyResponse);
      }


      await assetRepo.update(newAsset, null, newOriginalPath, newthumbnailPath, PROCESSED, transaction);
   }
      // delete previous association
    await nftAssetRepo.delete(nftId, transaction);
    await nftAssetRepo.createAssociations(nftId, assetAssociation, transaction);
    
    // Invoke  IPFS lambda function
    const lambdaPayload = generatePayload(nftUid, userId, nftId);
    const lambdaResponse = await lambda.invoke(`nft-management-backend-${STAGE}-UploadNftMetaData`, lambdaPayload, EVENT, REGION, 3105);
    logger.info(lambdaResponse);
    await transaction.commit();
  } catch (exp) {
    logger.error(exp);
    if(transaction){
      await transaction.rollback();
    }
    throw exp;
  }
  finally {
    if (connection) {
      await database.closeConnection(connection);
    }
  }
};

/**
 * Get prefix from path given
 * @param {String} sourcePath 
 * @returns 
 */
const getOldPathPrefix = sourcePath =>{
  
  const oldKey = sourcePath.split('/').slice(0,3).join('/');
  return oldKey;   
}

/**
 * Generate payload for upload nft meta data lambda function
 * @param nftUid 
 * @param userId 
 * @param tokenId 
 * @returns 
 */
function generatePayload(nftUid: string, userId: number, tokenId: number){
  return { 
    nftUid, 
    userId,
    tokenId 
  };
}