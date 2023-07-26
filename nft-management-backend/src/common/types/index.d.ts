/**
 * Include all types for the project
 */

export type NftAssetRequest = {
  assetUid: string,
  assetType: string
}

export type NftTagsRequest = {
  tag: string,
}

export type NftPropertiesRequest = {
  name: string,
  value: string
}

export type NftCollaboratorsRequest = {
  name: string
}

export type UnLockableContent = {
  hasUnlockableContent: boolean,
  unlockableContent: string
}

export type LambdaResponse = {
  StatusCode: number,
  FunctionError?: string,
  ExecutedVersion: string,
  Payload: string
}

export type ParsedLazyMintLambdaResponse = {
  userId: number,
  tokenId: number,
  signature: string
}

export type ApiSuccessResponse = {
  statusCode: number,
  body: ApiResponse
}

type ApiResponse = {
  responseCode: string
  response: Record<string, string>,
}

export type TokenInformation = {
    creator : string 
    tokenId : number
    editions ?: number
}

export type OverallPortfolioStatsResponse = {
    nftOwned : number,
    portfolioValue: number,
    totalTransactions: number,
}

export type TransactionsAnalyticsResponse = {
  count: number,
  data: Record<any, any>,
}

export type FinancialAnalyticsResponse = {
  value: number,
  data: Record<any, any>,
}

export type AccountSummaryResponse = {
  totalWallets : number,
  totalContracts: number,
  nftOwned: number,
}