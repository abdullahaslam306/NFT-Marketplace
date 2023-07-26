/**
 * Lambda to initiate syncing process
 * Fetch and segregate SQS Message
 */

import * as Sequelize from 'sequelize';
import { configs, helpers } from 'backend-utility';
import { database, repositories } from 'data-access-utility';

import { logger } from '../../../../common/utils/logger';
import MoralisApiAccess from '../../../../common/moralis/api';
import { HistoricalNftsTxsDatabaseSync } from '../../../../common/database-sync/historical';
import HistoricalNftApiDataParser from '../../../../common/parser/api-response/historical';
import HistoricalNftsSyncMessageParser from '../../../../common/parser/sqs-message/historical-nfts'
import { BlockchainSyncItemsCountType, MoralisNftsApiResponseResult } from '../../../../common/types';

const { functions } = helpers;
const { isValid } = functions;
const { MoralisApiResultLimit } = configs.defaults;
const { MoralisNftTokenIdFormat, NftSyncStatus } = configs.enums;
const { MORALIS_API_CHAIN, MORALIS_API_KEY, MORALIS_API_BASE_URL } = process.env;

/**
 * Handler trigger to initiate nft syncing process for a batch
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
//  */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let connection
  let blockchainSyncRepo;
  let blockchainSyncItemRepo;
  let blockchainSyncId: number
  let blockchainSyncItemId: number
  let transaction: Sequelize.Transaction;
  try {
    connection = database.openConnection();
    blockchainSyncRepo = new repositories.BlockchainSync(connection);
    blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);

    const moralisInstance = new MoralisApiAccess(MORALIS_API_BASE_URL, MORALIS_API_KEY, MoralisApiResultLimit, MORALIS_API_CHAIN, MoralisNftTokenIdFormat.DECIMAL);

    const transactionConfig = {
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      deferrable: connection.Sequelize.Deferrable.SET_DEFERRED,
    }

    transaction = await connection.sequelize.transaction(transactionConfig);

    const historicalNftApiDataParser = new HistoricalNftApiDataParser();
    const historicalNftsTxsDatabaseSync = new HistoricalNftsTxsDatabaseSync(connection, transaction);
    //Get message from the sqs and parse the message
    const sqsMessage = event.Records[0].body;

    const parser = new HistoricalNftsSyncMessageParser(sqsMessage);
    blockchainSyncId = parser.getBlockchainSyncId();
    blockchainSyncItemId = parser.getBlockchainSyncItemId();

    for (let iter = 0; iter < parser.next(); iter++) {
      console.log('MESSAGE LENGTH: ', parser.getCount());
      const { transactionIds, tokenId, contractAddress, contractId } = parser.getCurrentSyncData();
      console.log(`Iteration : ${iter} | TokenId : ${tokenId} | ContractAddress : ${contractAddress}`);
      if (iter === 0) {
        console.log(`SID : ${blockchainSyncId} | SIID : ${blockchainSyncItemId}`);
        await blockchainSyncRepo.updateById(blockchainSyncId, NftSyncStatus.INPROGRESS, null, true, false, transaction);
        await blockchainSyncItemRepo.updateById(blockchainSyncItemId, null, NftSyncStatus.INPROGRESS, true, false, transaction);
      }
      const historicalNftMetaData: MoralisNftsApiResponseResult = await moralisInstance.getNftMetaData(contractAddress, tokenId);

      console.log(`Has API returned Data : ${isValid(historicalNftMetaData)}`, historicalNftMetaData);

      // Check moralis api response to contain valid meta data
      if (isValid(historicalNftMetaData) === true) {
        const transformedNftData = await historicalNftApiDataParser.transform(contractId, historicalNftMetaData);
        console.log('TRANSFORMED NFT DATA', transformedNftData);

        if (isValid(transformedNftData) === true) {
          await historicalNftsTxsDatabaseSync.process(transactionIds, transformedNftData);
        }
      }
    }
    // Set sync item as completed

    await blockchainSyncItemRepo.updateById(blockchainSyncItemId, null, NftSyncStatus.COMPLETED, false, true, transaction);
    await transaction.commit();
  } catch (exp) {
    logger.error(exp);
    if (blockchainSyncItemRepo && blockchainSyncRepo) {
      await blockchainSyncItemRepo.updateById(blockchainSyncItemId, null, NftSyncStatus.FAILED, false, true);
    }
    if (transaction) {
      await transaction.rollback();
    }
    throw exp;
  } finally {
    if (connection) {
      await processSyncItemCount(connection, blockchainSyncId);
      database.closeConnection(connection)
    }
  }
}

/**
 * Process the sync item count
 * @param connection
 * @param blockchainSyncId
 */
async function processSyncItemCount(connection, blockchainSyncId: number) {
  try {
    const blockchainSyncRepo = new repositories.BlockchainSync(connection);
    const blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);

    const syncItemStatusCounts: BlockchainSyncItemsCountType = await blockchainSyncItemRepo.getStatusCountBySyncId(blockchainSyncId);
    console.log('syncItemStatusCounts', syncItemStatusCounts);
    const { failed, inprogress, draft, completed } = syncItemStatusCounts;

    console.log(`DRAFT : ${draft} | INPROGRESS: ${inprogress} | FAILED: ${failed} | COMPLETED: ${completed}`);

    if (inprogress === 0 && draft === 0) {
      // Mark Sync job as failed if no task is in progress or in draft state and failed > 0
      const updateStatus = failed > 0 ? NftSyncStatus.FAILED : NftSyncStatus.COMPLETED;
      await blockchainSyncRepo.updateById(blockchainSyncId, updateStatus, null, null, true);
    }
  } catch (exp) {
    logger.error(exp);
  }
}

