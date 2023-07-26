/**
 * Lambda to process the transaction syncing for all the wallets
 * Fetch and segregate based on user
 */

import { Transaction } from 'sequelize'
import { configs, helpers } from 'backend-utility'
import { database, repositories } from 'data-access-utility'

import { logger } from '../../../../common/utils/logger'
import MoralisApiAccess from '../../../../common/moralis/api'
import TransactionApiDataParser from '../../../../common/parser/api-response/transaction'
import { NftTransactionDatabaseSync } from '../../../../common/database-sync/transaction'
import TransactionSyncMessageParser from '../../../../common/parser/sqs-message/transaction'
import {
  BlockchainSyncItemsCountType, LambdaResponse, MoralisNftsTranfersApiResponseResult, SqsMessageSmartContractInfoType,
} from '../../../../common/types'

const { functions, lambda } = helpers;
const { isValid, isValidArray } = functions;
const { MoralisApiResultLimit } = configs.defaults;
const { LambdaInvocationType, MoralisNftTokenIdFormat, NftSyncStatus } = configs.enums;
const { MORALIS_API_CHAIN, MORALIS_API_KEY, MORALIS_API_BASE_URL, REGION, STAGE } = process.env;
const { EVENT } = LambdaInvocationType;


/**
 * Handler trigger to initiate nft transaction syncing process for a batch
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
//  */
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let connection
  let transaction;
  let blockchainSyncItemRepo;
  let blockchainSyncId: number;
  let blockchainSyncItemId: number;
  try {
    connection = database.openConnection();
    const blockchainSyncRepo = new repositories.BlockchainSync(connection);
    blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);

    const moralisInstance = new MoralisApiAccess(MORALIS_API_BASE_URL, MORALIS_API_KEY, MoralisApiResultLimit, MORALIS_API_CHAIN, MoralisNftTokenIdFormat.DECIMAL);

    const transactionConfig = {
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    }

    transaction = await connection.sequelize.transaction(transactionConfig);

    const nftTransactionDbSync = new NftTransactionDatabaseSync(connection, transaction);
    const transactionApiDataParser = new TransactionApiDataParser(connection, transaction);

    //Get message from the sqs and parse the message
    const sqsMessage = event.Records[0].body;

    const parser = new TransactionSyncMessageParser(sqsMessage);
    blockchainSyncId = parser.getBlockchainSyncId();
    blockchainSyncItemId = parser.getBlockchainSyncItemId();

    for (let iter = 0; iter < parser.next(); iter++) {
      logger.info('MESSAGE LENGTH: ', parser.getCount());
      const { walletAddress } = parser.getCurrentSyncData();
      logger.info(`Iteration : ${iter} | WADD : ${walletAddress}`);
      if (iter === 0) {
        logger.info(`SID : ${blockchainSyncId} | SIID : ${blockchainSyncItemId}`);
        await blockchainSyncRepo.updateById(blockchainSyncId, NftSyncStatus.INPROGRESS);
        await blockchainSyncRepo.setStartOrEndDateById(blockchainSyncId, true, null, transaction);
        await blockchainSyncItemRepo.updateById(blockchainSyncItemId, null, NftSyncStatus.INPROGRESS, true);
      }

      const smartContractAddresses: Array<string> = parser.getSmartContracts(true, true);
      const walletNftTransactionsApiData: Array<MoralisNftsTranfersApiResponseResult> = await moralisInstance.getNftTransfersByWalletAddress(walletAddress, smartContractAddresses);

      logger.info(`Has API returned Data : ${isValidArray(walletNftTransactionsApiData)}`, walletNftTransactionsApiData);

      if (isValidArray(walletNftTransactionsApiData) === true) {
        const smartContracts: Array<SqsMessageSmartContractInfoType> = parser.getSmartContracts();
        const transformedNftTransactionsData = await transactionApiDataParser.transform(smartContracts, walletNftTransactionsApiData);

        console.log('TRANSFORMED NFT DATA', transformedNftTransactionsData);

        if (isValidArray(transformedNftTransactionsData) === true) {
          await nftTransactionDbSync.process(transformedNftTransactionsData);
        }
      }
    }

    // Mark sync item as completed
    await blockchainSyncItemRepo.updateById(blockchainSyncItemId, null, NftSyncStatus.COMPLETED, false, true, transaction);

    await transaction.commit();
  } catch (exp) {
    logger.error(exp);

    if (isValid(blockchainSyncItemRepo) === true) {
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
 * Process sync item count
 * @param connection
 * @param blockchainSyncId
 */
async function processSyncItemCount(connection, blockchainSyncId: number) {
  try {
    const blockchainSyncRepo = new repositories.BlockchainSync(connection);
    const blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);

    const syncItemStatusCounts: BlockchainSyncItemsCountType = await blockchainSyncItemRepo.getStatusCountBySyncId(blockchainSyncId);

    const { failed, inprogress, draft, completed } = syncItemStatusCounts;

    console.log(`DRAFT : ${draft} | INPROGRESS: ${inprogress} | FAILED: ${failed} | COMPLETED: ${completed}`);

    if (inprogress === 0 && draft === 0) {
      // Mark Sync job as failed if no task is in progress or in draft state and failed > 0
      const updateStatus = failed > 0 ? NftSyncStatus.FAILED : NftSyncStatus.COMPLETED;
      await blockchainSyncRepo.updateById(blockchainSyncId, updateStatus, null, null, true);
      if (updateStatus === NftSyncStatus.COMPLETED) {
        // Start the new lambda function for to initiate the process of historical nft syncing
        const payload = {
          blockchainSyncId
        };
        const lambdaResponse: LambdaResponse = await lambda.invoke(`blockchain-syncing-backend-${STAGE}-HistoricalNftSyncInitiate`, payload, EVENT, REGION, 3106);
        logger.info(lambdaResponse);
      }
    }
  } catch (exp) {
    logger.error(exp);
  }
}
