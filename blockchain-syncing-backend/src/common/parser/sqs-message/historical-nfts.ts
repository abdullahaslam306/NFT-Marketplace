/**
 * Class for parsing sqs message data for historical nfts syncing
*/
import { helpers } from 'backend-utility';

import { ISyncParser } from './isync';
import { SqsMessageHistoricalNftsSyncType, parsedHistoricalNftsSyncType } from '../../types'

const { functions } = helpers;
const { isValidArray } = functions;

export default class HistoricalNftsSyncMessageParser implements ISyncParser {
  syncId: number;
  syncItemId: number;
  currentIndex: number;
  data: SqsMessageHistoricalNftsSyncType;
  parsedData: Array<parsedHistoricalNftsSyncType>;
  currentParsedSyncData: parsedHistoricalNftsSyncType;

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
   * Parse the sqs message data for Historical NFT sync
   * @returns 
   */
  private parse() {
    const syncId = Number(this.data.bs);
    const syncItemId = Number(this.data.i);
    const transactions = this.data.m;
    for (const transaction of transactions) {
      console.log('Single Transaction: ', transaction);
      const syncTransactionInfo: parsedHistoricalNftsSyncType = {
        syncId,
        syncItemId,
        transactionIds: transaction.id,
        tokenId: transaction.tk,
        contractAddress: transaction.c,
        contractId: transaction.cid,
      };
      console.log('Single Sync Transaction Info: ', syncTransactionInfo);
      this.parsedData.push(syncTransactionInfo);
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

  resetIndex() {
    this.currentIndex = 0;
  }

}
