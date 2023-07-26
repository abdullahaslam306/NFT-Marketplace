
/**
 * Class for parsing sqs message data for wallet nft transactions for syncing
 */
import { helpers } from 'backend-utility';

import { ISyncParser } from './isync';
import { SqsMessageTransactionSyncType, parsedTransactionSyncWalletInfoType } from '../../types'

const { functions } = helpers;
const { isValidArray } = functions;

export default class TransactionSyncMessageParser implements ISyncParser {
  syncId: number
  syncItemId: number
  currentIndex: number
  data: SqsMessageTransactionSyncType
  parsedData: Array<parsedTransactionSyncWalletInfoType>
  currentParsedSyncData: parsedTransactionSyncWalletInfoType
  constructor(messageData) {
    this.parsedData = [];
    this.currentIndex = 0;
    this.data = JSON.parse(messageData);
    this.parse();
    this.extractSyncInfo();
  }

  /**
   * Extract sync information from the data
   */
  private extractSyncInfo() {
    this.syncId = Number(this.data.bs);
    this.syncItemId = Number(this.data.i);
  }

  /**
   * Parse the sqs message data for nft transaction sync
   * @returns 
   */
  private parse() {
    const syncId = Number(this.data.bs);
    const syncItemId = Number(this.data.i);
    const { w: wallets, sc: smartContracts } = this.data.m;
    const walletsCount = wallets.length;
    for (let walletIndex = 0; walletIndex < walletsCount; walletIndex++) {
      const wallet = wallets[walletIndex];
      const syncWalletInfo: parsedTransactionSyncWalletInfoType = {
        syncId,
        syncItemId,
        smartContracts,
        walletAddress: wallet,
      };
      this.parsedData.push(syncWalletInfo);
    }
    console.log(this.parsedData);
  }

  getCount() {
    return isValidArray(this.parsedData) ? this.parsedData.length : 0;
  }

  next() {
    this.currentParsedSyncData = this.parsedData[this.currentIndex];
    this.currentIndex++;
    return this.getCount();
  }

  getCurrentSyncData() {
    return this.currentParsedSyncData;
  }

  getBlockchainSyncId(): number {
    return this.syncId || this.currentParsedSyncData.syncId;
  }

  getBlockchainSyncItemId() {
    return this.syncItemId || this.currentParsedSyncData.syncItemId || null;
  }

  getWalletAddress() {
    return this.currentParsedSyncData.walletAddress || null;
  }

  /**
   * Get smart contracts in lowercase for given wallet 
   * { '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D': 5, '0x60f80121c31a0d46b5279700f9df786054aa5ee5': 4} transformed response
   * [{id: 5, address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D'} , {id: 4, address: '0x60f80121c31a0d46b5279700f9df786054aa5ee5'} ] normal response
   * @param transform whether the response needs to a transformed array
   * @returns {Array | Record<string, string>}
   */
  getSmartContracts(transform = false, returnOnlyAddress = false) {
    let smartContracts: any = this.currentParsedSyncData.smartContracts || null;
    if (transform === true && isValidArray(smartContracts) === true) {
      let result = {};

      if (returnOnlyAddress === true) {
        result = smartContracts.map(smartContract => smartContract.address.toLowerCase());
      } else {
        smartContracts.forEach(smartContract => {
          result[smartContract['address'].toLowerCase()] = smartContract.id;
        });
      }
      smartContracts = result;
    }
    return smartContracts;
  }

  resetIndex() {
    this.currentIndex = 0;
  }

}
