/**
 *  Handler to Upload nft meta data to IPFS.
 */

import { configs, helpers } from 'backend-utility';
import { NFTStorage, File, Blob } from 'nft.storage'
import { database, repositories } from 'data-access-utility';

import { logger } from '../../common/utils/logger';
import { getSmartContractInfo, getTokenProtocol } from '../../common/utils/function';

const { lambda, s3, functions } = helpers;
const { enums, defaults } = configs;
const { NftStorageImageMimeType } = defaults;
const { isValid, generateFunctionalUrl } = functions;

const {
  AUDIO, IMAGE, THREED_MODEL, VIDEO,
} = enums.AssetTypes;
const { getObject } = s3;
const { MAIN } = enums.NftAssetType;
const { EVENT } = enums.LambdaInvocationType;
const { ETHEREUM } = enums.BlockChainNetwork;

const { NFT_STORAGE_ENDPOINT, NFT_STORAGE_SECRET, NFT_EXTERNAL_URL, REGION, STAGE } = process.env;

/**
 * Handler for Upload nft meta data to IPFS.
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @returns doesn't return anything.
 */
export const handler = async (event, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let connection;
  // TODO : Add logic to check if ipfs uri exists then skip the asset upload mechnism for given nft id
  try {
    const { payload } = event;
    const { tokenId, userId, nftUid } = payload
    logger.info(event);
    logger.info(event.payload);

    const connection = database.openConnection();
    const nftRepo = new repositories.Nft(connection);
    const assetRepo = new repositories.Asset(connection);
    const nftAssetRepo = new repositories.NftAsset(connection);
    const nftBlockchainInfoRepo = new repositories.NftBlockchainInfo(connection);

    await nftRepo.getByUid(nftUid, userId);

    // Get nft information
    // TODO : Sending signature as null to mint the NFT everytime instead of tranfer and mint
    const nftSignature: string = null;//nftRepo.getSignature();
    const nftId: number = nftRepo.getId();
    const nftTitle: string = nftRepo.getTitle();
    const nftDescription: string = nftRepo.getDescription();
    const nftTotalEditions: number = nftRepo.getTotalEditions();
    const nftProperties: Array<Record<string, string>> = nftRepo.getProperties();
    let nftPropertiesWithTraitType: Array<Record<string, string>> = [];
    if(isValid(nftProperties) === true){
    // Replacing name key in properties with trait_type as it is not supported by opensea
        nftPropertiesWithTraitType = nftProperties.map(({ name: trait_type, ...nftProperties }) => ({ trait_type, ...nftProperties }));
    }
    // Get nft main asset from nft asset table
    const nftAsset = await nftAssetRepo.getByNftId(tokenId, MAIN);
    // logger.info(`NFT ASSET : ${nftAsset}`);
    const nftAssetId = await nftAssetRepo.getAssetId(nftAsset);
    // logger.info(`NFT ASSET ID : ${nftAssetId}`);
    const asset = await assetRepo.getById(nftAssetId);
    // logger.info(`ASSET : ${asset}`);
    const assetName: string = assetRepo.getName(asset);
    const assetType: string = assetRepo.getType(asset);
    const bucketName: string = assetRepo.getBucketName(asset);

    //Get file path
    const originalPath: string = assetRepo.getOriginalPath(asset);
    const assetFileSrc = await getObject(bucketName, originalPath);
    const assetFile: Buffer = assetFileSrc.Body;
    const assetFileType = assetFileSrc.ContentType;

    //Get thumbnail path
    let thumbnailName: string = null;
    let thumbnailFile: Buffer = null;
    const thumbnailPath = assetRepo.getThumbnailPath(asset);
    if (isValid(thumbnailPath) === true) {
      const thumbnailFileSrc = await getObject(bucketName, thumbnailPath);
      thumbnailFile = thumbnailFileSrc.Body;
      const thumbnailPathChunks: Array<string> = thumbnailPath.split('/');
      thumbnailName = thumbnailPathChunks.pop();
    //   logger.info(`THUMBNAIL NAME : ${thumbnailName}`);
    }

    // logger.info(`BUCKET NAME : ${bucketName} | ORIGINAL PATH : ${originalPath} | THUMBNAIL PATH: ${thumbnailPath} | THUMBNAIL FILE: ${thumbnailFile}  FILE TYPE : ${assetFileType}`);

    //Upload to IPFS with metadata
    const ipfsHash = await uploadToIpfs(nftDescription, NFT_EXTERNAL_URL, nftTitle, nftPropertiesWithTraitType, assetName, assetFile, assetFileType, thumbnailFile, thumbnailName, assetType);
    // logger.info(ipfsHash);
    // TODO : Setting destination wallet to null as mint and transfer not supported for now 
    const destinationWallet = null;
    const tokenProtocol = getTokenProtocol(nftTotalEditions);
    const { smartContractAbi, smartContractAddress } = await getSmartContractInfo(connection, nftTotalEditions);
    const tokenUri = generateFunctionalUrl(ipfsHash);
    logger.info('Token URI', tokenUri);
    await nftBlockchainInfoRepo.upsertNftBlockChainInfo(nftId, smartContractAddress, nftId, tokenProtocol, ipfsHash, ETHEREUM, 
      null, true, null, null, tokenUri);

    logger.info('Block Chain Info Created');
    const lambdaPayload = generatePayLoad(nftId, userId, nftTotalEditions, ipfsHash, smartContractAddress, smartContractAbi,
      destinationWallet, nftSignature, tokenUri);
    logger.info(lambdaPayload);
    const lambdaResponse = await lambda.invoke(`nft-management-backend-${STAGE}-Mint`, lambdaPayload, EVENT, REGION, 3105);
    logger.info(lambdaResponse);

  } catch (exp) {
    logger.error(exp);
    throw exp;
  }
  finally {
    if (connection) {
      await database.closeConnection(connection);
    }
  }
};

/**
 * Create payload for mint lambda invocation
 * @param nftId 
 * @param userId 
 * @param editions 
 * @param ipfsHash 
 * @param smartContractAddress 
 * @param smartContractAbi 
 * @param destinationWallet 
 * @param signature
 * @param tokenUri 
 * @returns 
 */
function generatePayLoad(nftId: number, userId: number, editions: number, ipfsHash: string, smartContractAddress: string,
  smartContractAbi: Record<string, string>, destinationWallet: string = null, signature: string = null, tokenUri: string = null) {
  return {
    nftId,
    userId,
    editions,
    tokenUri,
    ipfsHash,
    signature,
    smartContractAbi,
    smartContractAddress,
    to: destinationWallet,
  }
}

/**
 * Upload to ipfs
 * @param description 
 * @param external_url 
 * @param title 
 * @param properties 
 * @param assetName 
 * @param assetFile 
 * @param assetFileType 
 * @param thumbnailFile 
 * @param thumbnailName 
 * @param assetType 
 * @returns Ipfs metadata url
 */
async function uploadToIpfs(description: string, external_url: string, title: string, properties: Array<Record<string, string>>, assetName: string,
  assetFile: Buffer, assetFileType: string, thumbnailFile: Buffer, thumbnailName: string, assetType: string) {
  let image: Buffer;
  let animationUrl: Buffer;
  const storage = new NFTStorage({ endpoint: NFT_STORAGE_ENDPOINT, token: NFT_STORAGE_SECRET });
  switch (assetType) {
    case IMAGE:
      image = new File([new Blob([new Uint8Array(assetFile)])], assetName, { type: NftStorageImageMimeType });
      animationUrl = null;
      break;
    case AUDIO:
    case VIDEO:
    case THREED_MODEL:
      image = new File([new Blob([new Uint8Array(thumbnailFile)])], thumbnailName, { type: NftStorageImageMimeType });
      animationUrl = new File([new Blob([new Uint8Array(assetFile)])], assetName, { type: assetFileType });
      break;
  }
  const metadata = await storage.store({
    'description': description,
    'external_url': external_url,
    'image': image,
    'name': title,
    'attributes': properties,
    'animation_url': animationUrl
  });

  return metadata.url;
}
