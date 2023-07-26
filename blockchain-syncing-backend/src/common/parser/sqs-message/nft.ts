
/**
 * Class for parsing sqs message data for nft syncing
 */
import { helpers } from 'backend-utility';

import { ISyncParser } from './isync';
import { SqsMessageType, parsedSyncWalletInfoType } from '../../types'

const { functions } = helpers;
const { isValidArray } = functions;

export default class NftSyncMessageParser implements ISyncParser {
  syncId: number
  syncItemId: number
  data: SqsMessageType
  currentIndex: number
  parsedData: Array<parsedSyncWalletInfoType>
  currentParsedSyncData: parsedSyncWalletInfoType;

  constructor(messageData) {
    this.parsedData = [];
    this.currentIndex = 0;
    this.data = JSON.parse(messageData);
    this.parse();
    this.extractSyncInfo();
    console.log('PARSED DATA : ', this.parsedData);
  }

  /**
   * Extract sync information from the data
   */
  private extractSyncInfo() {
    this.syncId = Number(this.data.bs);
    this.syncItemId = Number(this.data.i);
  }
  /**
   * Parse the sqs message data for nft sync
   * @returns 
   */
  private parse() {
    const syncId = Number(this.data.bs);
    const syncItemId = Number(this.data.i);
    const usersData = this.data.m;

    for (const user of usersData) {
      const userId = Number(user.u);
      const smartContracts = user.sc;
      const wallets = user.w;
      const walletsCount = wallets.length;
      for (let walletIndex = 0; walletIndex < walletsCount; walletIndex++) {
        const wallet = wallets[walletIndex];
        const syncWalletInfo: parsedSyncWalletInfoType = {
          syncId,
          userId,
          syncItemId,
          smartContracts,
          walletId: wallet.id,
          walletAddress: wallet.address,
        };
        this.parsedData.push(syncWalletInfo);
      }
    }
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

  getWalletId() {
    return this.currentParsedSyncData.walletId || null;
  }

  getWalletAddress() {
    return this.currentParsedSyncData.walletAddress || null;
  }

  getBlockchainSyncId(): number {
    return this.syncId || this.currentParsedSyncData.syncId;
  }

  getBlockchainSyncItemId() {
    return this.syncItemId || this.currentParsedSyncData.syncItemId || null;
  }


  /**
   * Get smart contracts for given wallet 
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
        result = smartContracts.map(smartContract => smartContract.address);
      } else {
        smartContracts.forEach(smartContract => {
          result[smartContract['address']] = smartContract.id;
        });
      }
      smartContracts = result;
    }
    return smartContracts;
  }

  getUserId() {
    return this.currentParsedSyncData.smartContracts || null;
  }

  resetIndex() {
    this.currentIndex = 0;
  }

}