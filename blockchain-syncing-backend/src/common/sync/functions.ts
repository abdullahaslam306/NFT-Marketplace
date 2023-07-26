/**
 * Utilities for syncing process
 */

// import { repositories } from 'data-access-utility';
import { helpers } from 'backend-utility';

import { SqsCoreMessage, SqsMessageSmartContractInfoType, SqsHistoricalNftCoreMessage } from '../types/index';

const { functions } = helpers;
const { isValid } = functions;

/**
 * Create base message
 * @param wallet
 * @param smartContracts
 * @param userId
 * @returns 
 */
export const createCoreMessage = (wallets, smartContracts, userId = null) => {
  const message: SqsCoreMessage = {
    w: wallets,
    sc: smartContracts,
  };

  if (isValid(userId) === true) {
    message.u = userId;
  }
  return message;
}

/**
 * Create SQS message
 * @param blockchainSyncId
 * @param messages
 * @returns 
 */
export const createSqsMessage = (blockchainSyncId, message) => {
  return {
    i: 0,
    m: message,
    bs: blockchainSyncId,
  }
}

/**
 * Create historical nft core message
 * @param txIds
 * @param tokenId
 * @param smartContractAddress
 * @param smartContractId
 * @returns 
 */
export const createHistoricalNftCoreMessage = (txIds, tokenId, smartContractAddress, smartContractId) => {
  const message: SqsHistoricalNftCoreMessage = {
    id: txIds,
    tk: tokenId,
    c: smartContractAddress,
    cid: smartContractId
  }
  return message;
}

/**
  * Used to convert data contract address list to a reduced for better searching
  * @param contractAddressList 
  * @returns return object of address's as keys and ID's as Values
  */
export const transformedContracts = (contractAddressList: Array<SqsMessageSmartContractInfoType>): Record<string, string> => {
  return contractAddressList.reduce((result, ele) => {
    const address = ele.address.toLowerCase();
    result[address] = ele.id;
    return result;
  }, {});
}