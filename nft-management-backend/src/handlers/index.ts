
import { helpers } from 'backend-utility';
import { database } from 'data-access-utility';

import { action as getAccountSummary } from './analytics/summary';
import { action as deleteNft, validationSchema as deleteNftValidationSchema } from './nft/delete';
import { action as updateNft, validationSchema as updateNftValidationSchema } from './nft/update';
import { action as listNftsHandler, validationSchema as listNftsValidationSchema } from './nft/list';
import { action as getNftHandler, validationSchema as getNftValidationSchema } from './nft/get-info';
import { action as transferNft, validationSchema as getTransferNftValidationSchema } from './nft/transfer';
import { action as createNftHandler, validationSchema as createNftValidationSchema } from './nft/create';
import { action as deleteNftSection, validationSchema as deleteNftSectionValidationSchema } from './section/delete';
import { action as updateNftSection, validationSchema as updateNftSectionValidationSchema } from './section/update';
import { action as listNftSectionHandler, validationSchema as listNftSectionValidationSchema } from './section/list';
import { action as createNftSectionHandler, validationSchema as createNftSectionValidationSchema } from './section/create';
import { action as getNftPortfolioStatsHandler, validationSchema as getNftPortfolioStatsValidationSchema } from './analytics/stats';
import { action as getNftBlockchainInfoHandler, validationSchema as getNftBlockchainInfoValidationSchema } from './nft/blockchain-info';
import { action as getNftTransactionDetailsHandler, validationSchema as getNftTransactionDetailsValidationSchema } from './nft/transaction-history';
import { action as nftByContractAddressHandler, validationSchema as getNftByContractAddressValidationSchema } from './nft/get-public-info';
import { action as transactionsDataHandler, validationSchema as transactionsDataValidationSchema } from './analytics/transactions';
import { action as financialDataHandler, validationSchema as financialDataHandlerValidationSchema } from './analytics/financials';
import { action as nftTransactionsHandler, validationSchema as nftTransactionsHandlerValidationSchema } from './analytics/nft-transaction';

let dbConnection = {};

/**
 * Nfts handler
 */
export const nftsHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(listNftsValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => listNftsHandler(event, context, dbConnection))
  .POST(createNftValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => createNftHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft handler
 */
export const nftHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(getNftValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => getNftHandler(event, context, dbConnection))
  .PATCH(updateNftValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => updateNft(event, context, dbConnection))
  .DELETE(deleteNftValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => deleteNft(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft transfer handler
 */
export const nftTransferHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .POST(getTransferNftValidationSchema, (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => transferNft(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft Section handler
 */
export const nftSectionHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .PATCH(updateNftSectionValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => updateNftSection(event, context, dbConnection))
  .DELETE(deleteNftSectionValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => deleteNftSection(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft Sections handler
 */
export const nftSectionsHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(listNftSectionValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => listNftSectionHandler(event, context, dbConnection))
  .POST(createNftSectionValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => createNftSectionHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/** 
 * Nft Transactions Handler
 */
export const nftTransactionHistoryHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(getNftTransactionDetailsValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => getNftTransactionDetailsHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft Blockchain Info Handler
 */
export const nftBlockchainInfoHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(getNftBlockchainInfoValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => getNftBlockchainInfoHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft Transaction Data Handler
 */
export const transactionsDataHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(transactionsDataValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => transactionsDataHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft Financial Data Handler
 */
export const financialDataHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(financialDataHandlerValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => financialDataHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/** 
 * Nft Portfolio Stats Handler
 */
export const nftPortfolioStatsHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(getNftPortfolioStatsValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => getNftPortfolioStatsHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/** 
 * Nft Account Summary Handler
 */
export const accountSummaryHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET((event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => getAccountSummary(context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/** 
 * Nft Transactions Handler
 */
export const nftTransactionsHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(nftTransactionsHandlerValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => nftTransactionsHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Nft Visitor handler
 */
export const nftByContractAddressHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(getNftByContractAddressValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => nftByContractAddressHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));