/**
 * Include all types for the project
 */

export type SqsMessageType = {
  i: string | number
  bs: string | number
  m: Array<InnerMessageDataType>
}

export type InnerMessageDataType = {
  u: string | number
  w: Array<SqsMessageWalletInfoType>
  sc: Array<SqsMessageSmartContractInfoType>
}

export type SqsMessageTransactionSyncType = {
  i: string | number
  bs: string | number
  m: InnerTransactionSyncMessageDataType
}

export type InnerTransactionSyncMessageDataType = {
  w: Array<string>
  sc: Array<SqsMessageSmartContractInfoType>
}

export type SqsMessageHistoricalNftsSyncType = {
  i: string | number
  bs: string | number
  m: Array<InnerHistoricalNftsSyncMessageDataType>
}

export type InnerHistoricalNftsSyncMessageDataType = {
  id: Array<number>,
  tk: string,
  c: string,
  cid: number
}


export type SqsMessageWalletInfoType = {
  id: number,
  address: string
}

export type SqsMessageSmartContractInfoType = {
  id: number,
  address: string
}

export type parsedSyncWalletInfoType = {
  syncId: number
  userId: number
  walletId: number
  syncItemId: number
  walletAddress: string
  smartContracts: Array<SqsMessageSmartContractInfoType>
}

export type parsedTransactionSyncWalletInfoType = {
  syncId: number
  syncItemId: number
  walletAddress: string
  smartContracts: Array<SqsMessageSmartContractInfoType>
}

export type parsedHistoricalNftsSyncType = {
  syncId: number
  syncItemId: number
  transactionIds: Array<number>
  tokenId: string
  contractAddress: string
  contractId: number
}

export type UserWalletSqsMessageType = {
  userId: number
  syncId: number
  batchId: number
  wallets: Array<string>
  contracts: Array<string>
}

export type MoralisNftsApiResponseResult = {
  name: string
  frozen: number
  amount: string
  symbol: string
  syncing: number
  is_valid: number
  metadata: string
  token_id: string
  owner_of: string
  token_uri: string
  synced_at: string
  block_number: string
  contract_type: string
  token_address: string
  block_number_minted: string
}

export type MoralisNftsTranfersApiResponseResult = {
  value: string
  amount: string
  token_id: string
  operator: string
  log_index: number
  block_hash: string
  to_address: string
  from_address: string
  block_number: string
  token_address: string
  contract_type: string
  block_timestamp: string
  transaction_hash: string
  transaction_type: string
  transaction_index: number
}



export type NftTransformedMetaDataType = {
  title: string
  description: string
  externalLink: string
  imageURL: string
  animationUrl: string
}

export type NftQueryParametersType = {
  token_id: string
  smart_contract_id: string
}

export type NftTransformedDataType = {
  nftId?: number
  status: string
  title?: string
  userId: number
  network: string
  tokenId: string
  ipfsHash: string
  tokenUri: string
  protocol: string
  walletId: number
  imageURL?: string
  contractName: string
  description?: string
  totalEditions: number
  externalLink?: string
  animationUrl?: string
  editionsOwned: string
  walletAddress: string
  contractSymbol: string
  smartContractId: string
  contractAddress: string
  nftOwnersExists?: boolean
  blockNumberMinted: string
  nftBlockchainInfoExists?: boolean
}

export type BlockchainSyncItemsCountType = {
  draft: number
  failed: number
  completed: number
  inprogress: number
}

export type SyncStageDetails = {
  queueUrl: string
  syncStage: string
  syncItemStage: string
  syncBatchSize: string,
  blockchainSyncId: number,
}

export type TransactionTransformedDataType = {
  nftId?: number
  price?: number
  ipfsLink?: string
  gasFee?: string
  editions?: string
  tokenId?: string
  tokenProtocol: string
  blockNumber: string
  eventName: string
  eventTime: string
  etherscanLink: string
  toWalletAddress: string
  contractAddress: string
  transactionHash?: string
  fromWalletAddress: string
}

export type LambdaResponse = {
  StatusCode: number,
  FunctionError?: string,
  ExecutedVersion: string,
  Payload: string
}

export type SqsCoreMessage = {
  u?: number,
  w: Array<string>,
  sc: Array<Record<string, number | string>>,
};

export type SqsHistoricalNftCoreMessage = {
  id: Array<number>,
  tk: string,
  c: string,
  cid: number
};

// export type MoralisTransactionsApiResponseResult = {
//   block_number: string
//   block_hash: string
//   block_timestamp: string
//   transaction_hash: string
//   transaction_index: number
//   log_index: number
//   value: string
//   contract_type: string
//   transaction_type: string
//   token_address: string
//   token_id: string
//   from_address: string
//   to_address: string
//   amount: string
//   verified: number
//   operator?: string
// }