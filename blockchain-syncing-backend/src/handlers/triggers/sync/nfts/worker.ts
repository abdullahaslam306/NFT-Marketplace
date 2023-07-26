/**
 * Lambda to initiate syncing process
 * Fetch and segregate based on user
 */

import { Transaction } from 'sequelize';
import { configs, helpers } from 'backend-utility';
import { database, repositories } from 'data-access-utility';

// Loading SQS message data from the file
// import sqsMessage  from '../../../__test__/mock/sqs-message.json'

import { logger } from '../../../../common/utils/logger';
import MoralisApiAccess from '../../../../common/moralis/api';
import { NftDatabaseSync } from '../../../../common/database-sync/nft';
import NftApiDataParser from '../../../../common/parser/api-response/nft';
import NftSyncMessageParser from '../../../../common/parser/sqs-message/nft'
import { BlockchainSyncItemsCountType, LambdaResponse, MoralisNftsApiResponseResult, SqsMessageSmartContractInfoType } from '../../../../common/types';

const { functions, lambda } = helpers;
const { isValidArray } = functions;
const { MoralisApiResultLimit } = configs.defaults;
const { MoralisNftTokenIdFormat, NftSyncStatus, LambdaInvocationType } = configs.enums;
const { MORALIS_API_CHAIN, MORALIS_API_KEY, MORALIS_API_BASE_URL, REGION, STAGE } = process.env;
const { EVENT } = LambdaInvocationType;

/**
 * Handler trigger to initiate nft syncing process for a batch
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
//  */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let connection
  let transaction;
  let blockchainSyncItemRepo
  let blockchainSyncId: number
  let blockchainSyncItemId: number
  try {
    connection = database.openConnection();
    const blockchainSyncRepo = new repositories.BlockchainSync(connection);
    blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);

    const moralisInstance = new MoralisApiAccess(MORALIS_API_BASE_URL, MORALIS_API_KEY, MoralisApiResultLimit, MORALIS_API_CHAIN, MoralisNftTokenIdFormat.DECIMAL);

    const transactionConfig = {
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    }

    transaction = await connection.sequelize.transaction(transactionConfig);

    const nftApiDataParser = new NftApiDataParser(connection, transaction);
    const nftDatabaseSync = new NftDatabaseSync(connection, transaction);
    //Get message from the sqs and parse the message
    const sqsMessage = event.Records[0].body;

    const parser = new NftSyncMessageParser(sqsMessage);
    blockchainSyncId = parser.getBlockchainSyncId();
    blockchainSyncItemId = parser.getBlockchainSyncItemId();

    for (let iter = 0; iter < parser.next(); iter++) {
      console.log('MESSAGE LENGTH: ', parser.getCount());
      const { userId, walletId, walletAddress } = parser.getCurrentSyncData();
      console.log(`Iteration : ${iter} | WID : ${walletId} | WADD : ${walletAddress}`);
      if (iter === 0) {
        console.log(`SID : ${blockchainSyncId} | SIID : ${blockchainSyncItemId}`);
        await blockchainSyncRepo.updateById(blockchainSyncId, NftSyncStatus.INPROGRESS);
        await blockchainSyncRepo.setStartOrEndDateById(blockchainSyncId, true, null, transaction);
        await blockchainSyncItemRepo.updateById(blockchainSyncItemId, null, NftSyncStatus.INPROGRESS, true);
      }

      const smartContractAddresses: Array<string> = parser.getSmartContracts(true, true);
      const walletNftsApiData: Array<MoralisNftsApiResponseResult> = await moralisInstance.getNftsByWalletAddress(walletAddress, smartContractAddresses);

      console.log(`Has API returned Data : ${isValidArray(walletNftsApiData)}`, walletNftsApiData);

      let transformedNftData;
      if (isValidArray(walletNftsApiData) === true) {
        const smartContracts: Array<SqsMessageSmartContractInfoType> = parser.getSmartContracts();
        transformedNftData = await nftApiDataParser.transform(Number(userId), Number(walletId), walletAddress, smartContracts, walletNftsApiData);

        console.log('TRANSFORMED NFT DATA', transformedNftData);

        if (isValidArray(transformedNftData) === true) {
          await nftDatabaseSync.process(transformedNftData);
        }
      }

      await nftDatabaseSync.syncMissingNftEditions(transformedNftData, userId, walletId);

      // Get all nft for given wallet
      // Pass the nft data for single wallet to transform function
      // Pass transformed data to the storage function
      // getNfts(walletAddress, smartContracts);
    }
    // Set sync item as completed
    await blockchainSyncItemRepo.updateById(blockchainSyncItemId, null, NftSyncStatus.COMPLETED, false, true, transaction);

    await transaction.commit();

  } catch (exp) {
    logger.error(exp);

    if (blockchainSyncItemRepo) {
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
        if (updateStatus === NftSyncStatus.COMPLETED) {
          const payload = {
            blockchainSyncId
          };
          // Start the new lambda function for to initiate the process of historical nft syncing
          const lambdaResponse: LambdaResponse = await lambda.invoke(`blockchain-syncing-backend-${STAGE}-TransactionSyncInitiate`, payload, EVENT, REGION, 3106);
          logger.info(lambdaResponse);
        }
      }
    } catch (exp) {
    logger.error(exp);
  }

}
