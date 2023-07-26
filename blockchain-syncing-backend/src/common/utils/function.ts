import { repositories } from 'data-access-utility';
import { helpers, configs } from 'backend-utility';

import { logger } from '../utils/logger';


const { enums } = configs;
const { functions } = helpers;
const { isValid, isValidObject, generateFunctionalUrl } = functions;
const { AssetStatus, NftAssetType } = enums
const { PROCESSED } = AssetStatus;

/**
 * @param nft 
 * @param connection 
 * @param transaction 
 */
export const storeAsset = async (nft, connection, transaction) => {
    try {
        let assetId = null;
        const { nftId, imageURL, animationUrl } = nft;
        const assetRepo = new repositories.Asset(connection);
        const nftAssetRepo = new repositories.NftAsset(connection);
        const actualAnimationUrl = isValidObject(animationUrl) ? animationUrl.model : animationUrl;
        const mediaUrl = isValid(actualAnimationUrl) === true ? actualAnimationUrl : ((isValid(imageURL) === true) ? imageURL : null);

        const mediaFunctionalUrl = generateFunctionalUrl(mediaUrl);
        const imageFunctionalUrl = generateFunctionalUrl(imageURL);

        const newAsset = await assetRepo.create(null, null, null, null, null, null, transaction, true, null, mediaFunctionalUrl, imageFunctionalUrl, PROCESSED);
        assetId = assetRepo.getId(newAsset);
        await nftAssetRepo.create(nftId, assetId, NftAssetType.MAIN, transaction, true, null);
    } catch (exp) {
        logger.error(exp);
        throw exp;
    }
}


