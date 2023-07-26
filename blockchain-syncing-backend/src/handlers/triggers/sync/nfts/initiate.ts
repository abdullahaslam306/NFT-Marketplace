/**
 * Lambda to initiate nft syncing process
 * Fetch and segregate based on user
 */

import * as Sequelize from 'sequelize';
import { database, repositories } from 'data-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { logger } from '../../../../common/utils/logger';
import { createCoreMessage, createSqsMessage } from '../../../../common/sync/functions';


const { SQS, functions } = helpers;
const { isValid, isValidArray } = functions;
const { BLOCKCHAIN_NFT_SYNC_USER_BATCH_SIZE, NFTS_QUEUE_URL } = process.env;
const { NftSyncStage, NftSyncStatus, BlockchainSyncItemType, WalletStatus } = configs.enums;
const { NftSyncAlreadyInprogressException, UserSyncDataNotAvailableException } = errors.codes;
const { OWNED_NFT_SYNC } = NftSyncStage;

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

    transaction = await connection.sequelize.transaction();

    // Check for already inprogress sync
    const blockchainSync: Record<string, any> = await blockchainSyncRepo.getByCriteria(NftSyncStatus.INPROGRESS, OWNED_NFT_SYNC, null, null, false, null, null, false);
    if (isValid(blockchainSync) === true) {
      throw new CommonError(NftSyncAlreadyInprogressException);
    }

    await blockchainSyncRepo.create(transaction, OWNED_NFT_SYNC);
    const blockchainSyncId: number = blockchainSyncRepo.getId();

    logger.info(`Sync id: ${blockchainSyncId}`);

    const userRepo = new repositories.User(connection);
    const walletRepo = new repositories.Wallet(connection);
    const smartContractRepo = new repositories.SmartContract(connection);
    const blockchainSyncItemRepo = new repositories.BlockchainSyncItem(connection);

    let users: Array<Record<string, any>> = await userRepo.getAllByCriteria(null, false, true, null);
    const userIds: Array<number> = userRepo.getIds(users);
    const totalUsers: number = userIds.length;
    console.log(`TOTAL USERS : ${totalUsers}`);
    users = null;

    let messages = []; // For storing the messages temporarily 
    let userIndex = 0;
    const sqsMessagesQueue = [];

    for (const userId of userIds) {
      logger.info(`Initiating sync for user id: ${userId}`);
      let userWalletsInfo: Array<Record<string, string>> = [];
      let smartContractsInfo: Array<Record<string, string>> = [];

      // Fetch all smart contracts
      const smartContracts: Array<Record<string, any>> = await smartContractRepo.getAllByCriteria(userId, null, null, null, true, false);
      if (isValidArray(smartContracts) === true) {
        smartContractsInfo = smartContracts.map(smartContract => ({
          id: smartContractRepo.getId(smartContract),
          address: smartContractRepo.getAddress(smartContract),
        }));

        // logger.info('Smart Contracts:', smartContractsInfo);

        const wallets: Array<Record<string, any>> = await walletRepo.getAllByCriteria(userId, null, WalletStatus.CONNECTED, false);

        if (isValidArray(wallets) === true) {
          userWalletsInfo = wallets.map(wallet => ({
            id: walletRepo.getId(wallet),
            address: walletRepo.getAddress(wallet)
          }));

          // logger.info('Wallets:', userWalletsInfo);

          const message = createCoreMessage(userWalletsInfo, smartContractsInfo, userId);
          messages.push(message);

          //Add data for syncBatchSize(5) users - along with wallets and smartContract in a single sqs message
          if (messages.length % parseInt(BLOCKCHAIN_NFT_SYNC_USER_BATCH_SIZE) === 0 || userIndex === (totalUsers - 1)) {
            const sqsMessage = createSqsMessage(blockchainSyncId, messages);
            messages = []; // Resetting messages array to push new data in next loop
            const blockchainSyncItem = await blockchainSyncItemRepo.create(blockchainSyncId, BlockchainSyncItemType.OWNED_NFT_SYNC, transaction);
            const blockchainSyncItemId = blockchainSyncItemRepo.getId();
            sqsMessage.i = blockchainSyncItemId;
            await blockchainSyncItemRepo.update(blockchainSyncItem, sqsMessage, transaction);
            sqsMessagesQueue.push(sqsMessage);
          }
        }
      }
      userIndex += 1;
    }

    if (isValidArray(sqsMessagesQueue) === false) {
      throw new CommonError(UserSyncDataNotAvailableException);
    }

    logger.info(`Sqs Message length: ${sqsMessagesQueue.length}`);

    await blockchainSyncRepo.updateById(blockchainSyncId, null, sqsMessagesQueue.length, false, false, transaction);

    const sqs = new SQS(NFTS_QUEUE_URL);
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
