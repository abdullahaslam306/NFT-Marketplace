import * as Sequelize from 'sequelize';
import { repositories } from 'data-access-utility';
import { helpers, configs } from 'backend-utility';

import { logger } from '../utils/logger';
import { NftTransformedDataType } from '../types';

const { enums } = configs;

const { functions } = helpers;
const { isValid, generateFunctionalUrl } = functions;
const { AssetStatus, NftAssetType, NftStatus } = enums

const { PROCESSED } = AssetStatus;
const { DRAFT, LAZY_MINTED, PENDING } = NftStatus;

/**
 * Implmentation to perform update on nft related information in application database
 */
export class NftDatabaseSync {

    connection: any;
    transaction: Sequelize.Transaction;

    constructor(dbConnection, dbTransaction) {
        this.connection = dbConnection;
        this.transaction = dbTransaction;
    }

    /**
     * Store nft data
     * @param nfts
     */
    async process(nfts: Array<NftTransformedDataType>) {
        try {

            for (const nft of nfts) {
                const nftId = await this.storeNft(nft);
                nft.nftId = nftId;
                await this.storeNftOwner(nft);
                await this.storeNftBlockChainInfo(nft);
            }
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    /**
     * Update missing editions for nft
     * @param nfts
     * @param userId
     * @param walletId
     * @returns
     */
    public async syncMissingNftEditions(nfts: NftTransformedDataType[] = [], userId: number, walletId: number) {
        try {
            const smartContractIds = null;
            const nftSearchCriteriaStatuses = [ DRAFT, LAZY_MINTED, PENDING ];

            const nftRepo = new repositories.Nft(this.connection);
            const nftOwnerRepo = new repositories.NftOwner(this.connection);
            
            const nftIds = nfts.map(nft => nft.nftId)
            logger.info('NFT IDS MORALIS EXCLUDE', nftIds);
            // Get nft_ids for all the nfts for given user which are in draft, lazy-minted, pending state
            const excludeNfts = await nftRepo.getAllByCriteria(userId, false, true, false, null, smartContractIds, nftSearchCriteriaStatuses, this.transaction, false);
            let excludedNftIds = nftRepo.getIds(excludeNfts, []);
            logger.info('NFT IDS DB EXCLUDE', excludedNftIds);

            excludedNftIds = [...nftIds, ...excludedNftIds];
            logger.info('NFT IDS EXCLUDE', excludedNftIds);
            return nftOwnerRepo.updateEditionsOwnedByCriteria(0, userId, walletId, excludedNftIds, true, this.transaction);
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    /**
     * Store data in nft table
     * @param nft
     * @returns
     */
    private async storeNft(nft: NftTransformedDataType) {
        try {
            const nftRepo = new repositories.Nft(this.connection);
            const { nftId, tokenId, smartContractId, status, title, description, blockNumberMinted } = nft;
            let currentNftId = nftId;
            if (isValid(nftId) === false) {
                const newNft = await nftRepo.create(null, title, null, null, smartContractId, this.transaction, true, null, description, status, tokenId, blockNumberMinted);
                currentNftId = nftRepo.getId(newNft);
                await this.storeAsset(currentNftId, nft);
            } else {
                await nftRepo.updateById(nftId, null, false, this.transaction, true, null, description, title, null, null, blockNumberMinted);
            }
            return currentNftId;
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    //Store data in nft_owner table
    private async storeNftOwner(nft: NftTransformedDataType) {

        try {
            const nftRepo = new repositories.Nft(this.connection);
            const nftOwnerRepo = new repositories.NftOwner(this.connection);
            const { nftId, userId, walletId, walletAddress, editionsOwned, nftOwnersExists } = nft;

            if (nftOwnersExists === false) {
                await nftRepo.addOwnership(nftId, walletAddress, editionsOwned, userId, null, this.transaction, true, null, walletId);
            } else {
                await nftOwnerRepo.update(nftId, userId, walletAddress, editionsOwned, null, this.transaction, true, null);
            }
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    /**
     * Store data in nft_blockchain_info table
     * @param nft 
     */
    private async storeNftBlockChainInfo(nft: NftTransformedDataType) {
        try {
            const nftBlockchainInfoRepo = new repositories.NftBlockchainInfo(this.connection);
            const { nftId, tokenId, protocol, contractAddress, network, ipfsHash, blockNumberMinted, nftBlockchainInfoExists, tokenUri } = nft;
        
            if (nftBlockchainInfoExists === true) {
                await nftBlockchainInfoRepo.updateByNftId(nftId, null, null, null, ipfsHash, null, this.transaction, true, null, tokenUri)
            } else {
                await nftBlockchainInfoRepo.create(nftId, contractAddress, tokenId, protocol, ipfsHash, network, false, this.transaction, false, null, blockNumberMinted, tokenUri);
            }
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    /**
     * Store data in assets table
     * @param nft
     * @returns 
     */
    private async storeAsset(nftId, nft) {
        try {
            let assetId = null;
            const { imageURL, animationUrl } = nft;
            const assetRepo = new repositories.Asset(this.connection);
            const nftAssetRepo = new repositories.NftAsset(this.connection);
            const mediaUrl = isValid(animationUrl) === true ? animationUrl : ((isValid(imageURL) === true) ? imageURL : null);

            logger.info('Media Url ', mediaUrl);
            logger.info('Image Url', imageURL);

            const mediaFunctionalUrl = generateFunctionalUrl(mediaUrl);
            const imageFunctionalUrl = generateFunctionalUrl(imageURL);

            logger.info('Functional Media Url', mediaFunctionalUrl);
            logger.info('Functional Image Url', imageFunctionalUrl);

            const newAsset = await assetRepo.create(null, null, null, null, null, null, this.transaction, true, null, mediaFunctionalUrl, imageFunctionalUrl, PROCESSED);
            assetId = assetRepo.getId(newAsset);
            await nftAssetRepo.create(nftId, assetId, NftAssetType.MAIN, this.transaction, true, null);
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    // /**
    //  * Store data in nft_assets table
    //  * @param assetId 
    //  * @param nftId 
    //  */
    // private async storeNftAsset(assetId, nftId){
    //     try {
    //         const nftAssetRepo = new repositories.NftAsset(this.connection);
    //         await nftAssetRepo.create(nftId, assetId, NftAssetType.MAIN, this.transaction, true, null);

    //     } catch (exp) {
    //         logger.error(exp);
    //         throw exp; 
    //     }
    // }
}
