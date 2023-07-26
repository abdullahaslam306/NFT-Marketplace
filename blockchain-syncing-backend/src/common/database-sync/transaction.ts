import * as Sequelize from 'sequelize';
import { repositories } from 'data-access-utility';
import { TransactionTransformedDataType } from '../types';
import { logger } from '../utils/logger';
export class NftTransactionDatabaseSync {

    connection: any;
    transaction: Sequelize.Transaction;

    constructor(dbConnection, dbTransaction) {
        this.connection = dbConnection;
        this.transaction = dbTransaction;
    }

    /**
     * Store nft transactions 
     * @param nftTransactions
    */
    async process(nftTransactions: Array<TransactionTransformedDataType>) {
        try {

            const transformedTxs = [];

            nftTransactions.forEach(tx => {

                const {
                    nftId,
                    price,
                    gasFee,
                    tokenId,
                    editions,
                    ipfsLink,
                    eventName,
                    eventTime,
                    blockNumber,
                    tokenProtocol,
                    etherscanLink,
                    contractAddress,
                    toWalletAddress,
                    transactionHash,
                    fromWalletAddress,
                } = tx;

                const transformedTx = {
                    nft_id: nftId,
                    price: price,
                    gas_fee: gasFee,
                    token_id: tokenId,
                    editions: editions,
                    ipfs_link: ipfsLink,
                    event_name: eventName,
                    event_time: eventTime,
                    block_number: blockNumber,
                    token_protocol: tokenProtocol,
                    etherscan_link: etherscanLink,
                    contract_address: contractAddress,
                    to_wallet_address: toWalletAddress,
                    transaction_hash: transactionHash,
                    from_wallet_address: fromWalletAddress,
                }

                transformedTxs.push(transformedTx);

            });

            await this.storeNftTransaction(transformedTxs)

        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }

    /**
     * Store data in bulk in nft_transaction_history table
     * @param nftTransaction
     * @return
     */
    private async storeNftTransaction(nftTransactions: Array<TransactionTransformedDataType>) {
        try {
            const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(this.connection);
            await nftTransactionHistoryRepo.bulkCreate(nftTransactions, this.transaction);
        } catch (exp) {
            logger.error(exp);
            throw exp;
        }
    }
}