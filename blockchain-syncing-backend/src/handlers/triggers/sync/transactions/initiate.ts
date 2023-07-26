/**
 * Lambda to initiate transaction syncing process
 * Fetch and segregate based on user
 */

import * as ld from 'lodash';
import * as Sequelize from 'sequelize';
import { database, repositories } from 'data-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { logger } from '../../../../common/utils/logger';
import { createCoreMessage, createSqsMessage } from '../../../../common/sync/functions';

const { SQS, functions } = helpers;
const { isValid, isValidArray } = functions;
const { NftSyncStage, NftSyncStatus, BlockchainSyncItemType } = configs.enums;
const { BLOCKCHAIN_TRANSACTION_SYNC_WALLET_BATCH_SIZE, TRANSACTIONS_QUEUE_URL } = process.env;
const {
  NftSyncInfoMissingException,
  NftSyncAlreadyInprogressException,
  UserSyncDataNotAvailableException,
  NftTransactionSyncAlreadyInprogressException,
} = errors.codes;
const { OWNED_NFT_SYNC, NFT_TRANSACTION_SYNC } = NftSyncStage;

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

    const walletRepo = new repositories.Wallet(connection);
    const smartContractRepo = new repositories.SmartContract(connection);
    const blockchainSyncRepo = new repositories.BlockchainSync(connection);
    const blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);

    // Fetch details of the sync stage based on event
    let blockchainSyncId: number = ld.get(event.payload, 'blockchainSyncId', null);
    logger.info(event);
    if (isValid(blockchainSyncId) === false) {
      throw new CommonError(NftSyncInfoMissingException);
    }

    // Passed blockchainSyncId must be completed and of "owned_nft_sync" stage - Otherwise throw error
    const existingBlockchainSync: Record<string, any> = await blockchainSyncRepo.getByCriteria(NftSyncStatus.COMPLETED, OWNED_NFT_SYNC, blockchainSyncId, null, false, null, null, true, NftSyncAlreadyInprogressException);
    const existingSyncBatchIdentifier = blockchainSyncRepo.getBatchIdentifier(existingBlockchainSync);

    const syncStatusForQuery = [
      NftSyncStatus.DRAFT,
      NftSyncStatus.INPROGRESS
    ];
    // Check if transaction sync job is inprogress or in draft state for given batch identifier

    const blockchainSyncTransaction = await blockchainSyncRepo.getByCriteria(syncStatusForQuery, NFT_TRANSACTION_SYNC, null, existingSyncBatchIdentifier, false, null, null, false);

    logger.info(blockchainSyncTransaction);

    if (isValid(blockchainSyncTransaction) === true) {
      throw new CommonError(NftTransactionSyncAlreadyInprogressException);
    }

    transaction = await connection.sequelize.transaction();

    // Add entry for transaction sync start
    const blockchainSync = await blockchainSyncRepo.create(transaction, NFT_TRANSACTION_SYNC, null, existingSyncBatchIdentifier);
    blockchainSyncId = blockchainSyncRepo.getId(blockchainSync);

    const sqsMessagesQueue = [];

    const smartContracts = await smartContractRepo.getAllByCriteria(null, null, null, null, true, false);

    if (isValidArray(smartContracts) === true) {

      const smartContractsInfo: Array<Record<string, string | number>> = smartContracts.map(smartContract => ({
        id: smartContractRepo.getId(smartContract),
        address: smartContractRepo.getAddress(smartContract),
      }));

      const wallets = await walletRepo.getAllByCriteria();

      if (isValidArray(wallets) === true) {
        console.log('Wallets found');
        const walletAddresses: Array<string> = walletRepo.getAddresses(wallets);
        console.log('Wallets addresses', walletAddresses);
        // TODO: Replace finding unique wallet address mechanism to DB
        const uniqueWalletAddresses: Array<string> = ld.uniq(walletAddresses);
        console.log('Unique Wallets addresses', uniqueWalletAddresses);
        const totalWallets: number = uniqueWalletAddresses.length;

        let addresses = [];  // For storing the messages temporarily 
        let walletIndex = 0;
        for (const address of uniqueWalletAddresses) {

          addresses.push(address);

          //Add data for syncBatchSize(5) wallets - along with wallets and smartContract in a single sqs message
          if (addresses.length % parseInt(BLOCKCHAIN_TRANSACTION_SYNC_WALLET_BATCH_SIZE) === 0 || walletIndex === (totalWallets - 1)) {
            console.log('Addresses', addresses);
            const message = createCoreMessage(addresses, smartContractsInfo);
            const sqsMessage = createSqsMessage(blockchainSyncId, message);
            console.log('SQS Core message', sqsMessage);
            addresses = []; // Resetting messages array to push new data in next loop
            const blockchainSyncItem = await blockchainSyncItemRepo.create(blockchainSyncId, BlockchainSyncItemType.NFT_TRANSACTION_SYNC, transaction);
            const blockchainSyncItemId = blockchainSyncItemRepo.getId();
            sqsMessage.i = blockchainSyncItemId;
            await blockchainSyncItemRepo.update(blockchainSyncItem, sqsMessage, transaction);
            sqsMessagesQueue.push(sqsMessage);
          }
          walletIndex += 1;

        }
      }
    }

    console.log('SQS Core message', sqsMessagesQueue);
    if (isValidArray(sqsMessagesQueue) === false) {
      throw new CommonError(UserSyncDataNotAvailableException);
    }

    logger.info(`Sqs message length: ${sqsMessagesQueue.length}`);

    await blockchainSyncRepo.updateById(blockchainSyncId, null, sqsMessagesQueue.length, false, false, transaction);

    const sqs = new SQS(TRANSACTIONS_QUEUE_URL);
    const response = await sqs.sendBatchMessages(blockchainSyncId, sqsMessagesQueue, 'i');
    logger.info('SQS responses', response);

    await transaction.commit();
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
