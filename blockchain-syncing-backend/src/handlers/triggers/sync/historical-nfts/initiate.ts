/**
 * Lambda to initiate historical nft syncing process
 * Fetch and segregate transactions history based on tokenId, Contract Address
 */

import * as ld from 'lodash';
import * as Sequelize from 'sequelize';
import { database, repositories } from 'data-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { logger } from '../../../../common/utils/logger';
import { SqsHistoricalNftCoreMessage, SqsMessageHistoricalNftsSyncType } from '../../../../common/types/index';
import { createHistoricalNftCoreMessage, createSqsMessage } from '../../../../common/sync/functions';

const { SQS, functions } = helpers;
const { isValid, isValidArray } = functions;
const { NftSyncStage, NftSyncStatus, BlockchainSyncItemType } = configs.enums;
const { HISTORICAL_NFT_SYNC, NFT_TRANSACTION_SYNC } = NftSyncStage;
const {
  NftSyncInfoMissingException,
  NftSyncAlreadyInprogressException,
  HistoricalNftSyncDataNotAvailableException,
  HistoricalNftSyncAlreadyInprogressException,
} = errors.codes;
const { BLOCKCHAIN_HISTORICAL_NFT_SYNC_BATCH_SIZE, HISTORICAL_NFTS_QUEUE_URL } = process.env;

/**
 * Handler trigger to initiate nft syncing process for a batch
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const handler = async (event, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let connection;
  let transaction: Sequelize.Transaction;
  try {
    connection = database.openConnection();

    const blockchainSyncRepo = new repositories.BlockchainSync(connection);
    const smartContractRepo = new repositories.SmartContract(connection);
    const blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);
    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

    // Fetch details of the sync stage based on event
    let blockchainSyncId: number = ld.get(event.payload, 'blockchainSyncId', null);
    logger.info({ event });
    if (isValid(blockchainSyncId) === false) {
      throw new CommonError(NftSyncInfoMissingException);
    }

    // Passed blockchainSyncId must be completed and of "nft_transaction_sync" stage - Otherwise throw error
    const existingBlockchainSync: Record<string, any> = await blockchainSyncRepo.getByCriteria(NftSyncStatus.COMPLETED, NFT_TRANSACTION_SYNC, blockchainSyncId, null, false, null, null, true, NftSyncAlreadyInprogressException);
    const existingSyncBatchIdentifier: string = blockchainSyncRepo.getBatchIdentifier(existingBlockchainSync);

    const syncStatusForQuery: Array<string> = [
      NftSyncStatus.DRAFT,
      NftSyncStatus.INPROGRESS
    ];
    // Check if historical nft sync job is inprogress or in draft state for given batch identifier
    const blockchainSyncTransaction: Record<string, string> = await blockchainSyncRepo.getByCriteria(syncStatusForQuery, HISTORICAL_NFT_SYNC, null, existingSyncBatchIdentifier, false, null, null, false);

    logger.info({ blockchainSyncTransaction });

    if (isValid(blockchainSyncTransaction) === true) {
      throw new CommonError(HistoricalNftSyncAlreadyInprogressException);
    }

    transaction = await connection.sequelize.transaction();

    // Add entry for historical nft sync start
    const blockchainSync = await blockchainSyncRepo.create(transaction, HISTORICAL_NFT_SYNC, null, existingSyncBatchIdentifier);
    blockchainSyncId = blockchainSyncRepo.getId(blockchainSync);

    logger.info({ blockchainSyncId });

    let messages: Array<SqsHistoricalNftCoreMessage> = [];
    const sqsMessagesQueue: Array<SqsMessageHistoricalNftsSyncType> = [];
    let historicalNftTransactionIndex = 0;
    // Fetch all smart contracts
    const smartContracts: Array<Record<string, any>> = await smartContractRepo.getAllByCriteria(null, null, null, null, true, false);
    if (isValidArray(smartContracts) === true) {

      const smartContractAddresses: Array<string> = smartContractRepo.getAddresses(smartContracts);

      const transformedContractsObject: Record<string, number> = transformSmartContracts(smartContracts, connection);
      logger.info(`Smart Contract Transformed Object: ${transformedContractsObject}`);

      //Fetch Historical Transactions
      const historicalNftTransactions: Array<Record<string, any>> = await nftTransactionHistoryRepo.getHistoricalNftTransactions(smartContractAddresses);
      logger.info(`NFT Historical Transactions: ${historicalNftTransactions}`);

      if (isValidArray(historicalNftTransactions) === true) {
        const totalHistoricalNftTransactions: number = historicalNftTransactions.length;
        for (const historicalNftTransaction of historicalNftTransactions) {
          const txIds: Array<number> = nftTransactionHistoryRepo.getId(historicalNftTransaction, null, true);
          const tokenId: string = nftTransactionHistoryRepo.getTokenId(historicalNftTransaction);
          const smartContractAddress: string = nftTransactionHistoryRepo.getContractAddress(historicalNftTransaction, null, true);

          const smartContractId: number = transformedContractsObject[smartContractAddress];

          const message: SqsHistoricalNftCoreMessage = createHistoricalNftCoreMessage(txIds, tokenId, smartContractAddress, smartContractId);
          messages.push(message);

          //Add data for syncBatchSize transactions in a single sqs message
          if (messages.length % parseInt(BLOCKCHAIN_HISTORICAL_NFT_SYNC_BATCH_SIZE) === 0 || historicalNftTransactionIndex === (totalHistoricalNftTransactions - 1)) {
            const sqsMessage = createSqsMessage(blockchainSyncId, messages);
            logger.info({ sqsMessage });
            messages = []; // Resetting messages array to push new data in next loop
            const blockchainSyncItem = await blockchainSyncItemRepo.create(blockchainSyncId, BlockchainSyncItemType.HISTORICAL_NFT_SYNC, transaction);
            const blockchainSyncItemId: number = blockchainSyncItemRepo.getId();
            sqsMessage.i = blockchainSyncItemId;
            await blockchainSyncItemRepo.update(blockchainSyncItem, sqsMessage, transaction);
            sqsMessagesQueue.push(sqsMessage);
          }
          historicalNftTransactionIndex += 1;
        }

        if (isValidArray(sqsMessagesQueue) === false) {
          throw new CommonError(HistoricalNftSyncDataNotAvailableException);
        }

        logger.info(`Sqs Message length: ${sqsMessagesQueue.length}`);

        await blockchainSyncRepo.updateById(blockchainSyncId, null, sqsMessagesQueue.length, false, false, transaction);

        const sqs = new SQS(HISTORICAL_NFTS_QUEUE_URL);
        const response = await sqs.sendBatchMessages(blockchainSyncId, sqsMessagesQueue, 'i');
        logger.info('SQS responses', response);
        await transaction.commit();
      }
    }
  } catch (exp) {
    logger.error(exp);
    if (transaction) {
      await transaction.rollback();
    }
    throw exp;
  } finally {
    if (connection) {
      database.closeConnection(connection)
    }
  }
}

/**
 * Transform smart contracts to object
 * @param smartContracts
 * @param connection
 * @returns return object of address's as keys and ID's as Values
 */
const transformSmartContracts = (smartContracts, connection) => {
  const smartContractRepo = new repositories.SmartContract(connection);
  const transformedSmartContracts = {};
  smartContracts.forEach(smartContract => {
    const id: number = smartContractRepo.getId(smartContract);
    let address: string = smartContractRepo.getAddress(smartContract);
    address = address.toLowerCase();
    transformedSmartContracts[address] = id;
  });
  return transformedSmartContracts;
}

