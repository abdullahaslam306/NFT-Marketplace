import * as Sequelize from 'sequelize';
import { Transaction } from 'sequelize';
import { repositories, database } from 'data-access-utility';
import NftApiDataParser from "../parser/api-response/historical"
import MoralisApiAccess from "../moralis/api"

import { logger } from '../utils/logger';
import { NftTransformedDataType } from '../types';
import { storeAsset } from '../utils/function'

/**
 * Implmentation to create nft and update transactions with nftId
 */
export class HistoricalNftsTxsDatabaseSync {

    connection: any;
    transaction: Sequelize.Transaction;

    constructor(dbConnection, dbTransaction) {
        this.connection = dbConnection;
        this.transaction = dbTransaction;
    }

    /**
     * Store nft data and update transactions
     * @param nfts
     */
    async process(txHistoryIds: Array<number>, nft) {
        try {

            const nftId = await this.storeNft(nft);
            await this.updateTxs(txHistoryIds, nftId);

        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    /**
     * Store data in nft table
     * @param nft
     * @returns nftId
     */
    private async storeNft(nft: NftTransformedDataType) {
        let nftId: number = null;
        try {
            const nftRepo = new repositories.Nft(this.connection);
            const { tokenId, smartContractId, status, title, description, blockNumberMinted } = nft;
            const newNft = await nftRepo.create(null, title, null, null, smartContractId, this.transaction, true, null, description, status, tokenId, blockNumberMinted);
            nftId = nftRepo.getId(newNft);
            nft.nftId = nftId;
            //TODO: shift method to appropriate file and update nft sync accordingly
            await storeAsset(nft, this.connection, this.transaction);
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
        return nftId;
    }

    /**
     * Update transactions based on ids with nftId
     * @param {Array} txHistoryIds
     * @param {number} nftId
     */
    private async updateTxs(txHistoryIds: Array<number>, nftId: number) {
        try {
            const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(this.connection);
            await nftTransactionHistoryRepo.update(nftId, null, null, null, this.transaction, txHistoryIds);

        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }
}
