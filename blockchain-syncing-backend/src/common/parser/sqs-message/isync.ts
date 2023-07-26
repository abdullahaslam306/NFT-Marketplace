import { parsedHistoricalNftsSyncType, parsedSyncWalletInfoType, parsedTransactionSyncWalletInfoType } from '../../types';

export interface ISyncParser {
  data: any;
  parsedData: any;
  currentIndex: number
  currentParsedSyncData: parsedSyncWalletInfoType | parsedTransactionSyncWalletInfoType | parsedHistoricalNftsSyncType

  next(): number
  resetIndex(): void
  getCount(): number
  getWalletId?(): string | number
  getWalletAddress?(): string | number
  getBlockchainSyncId(): string | number
  getBlockchainSyncItemId(): string | number
  getSmartContracts?(transform: boolean): any
}