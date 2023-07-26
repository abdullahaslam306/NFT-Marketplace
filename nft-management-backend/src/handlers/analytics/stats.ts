/**
 * Handler to get portfolio stats
 */

import * as Vandium from 'vandium';
import { configs, errors, helpers } from 'backend-utility';
import { Serializer } from 'jsonapi-serializer';
import { repositories } from 'data-access-utility';

import { logger } from '../../common/utils/logger';
import validationMessages from '../../common/validation-code/en';
import { filterNftsByWallet } from '../../common/utils/function';
import { ApiSuccessResponse, OverallPortfolioStatsResponse } from '../../common/types';

const { functions, responses } = helpers;
const { getUserId, isValidArray, isValid } = functions;
const { InvalidSmartContractException } = errors.codes;
const { NftTransactionEvents } = configs.enums;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Get portfolio stats handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  // eslint-disable-next-line no-useless-escape 
  context.callbackWaitsForEmptyEventLoop = false;
  logger.info('Event', event)
  let response: ApiSuccessResponse;
  try {
    let contractIds = [];
    const userId: number = getUserId(context);
    const walletUids = event?.queryStringParameters?.walletUids || [];
    const smartContractUids = event?.queryStringParameters?.smartContractUids || [];

    const responseData: OverallPortfolioStatsResponse = {
      nftOwned: 0,
      portfolioValue: 0.0,
      totalTransactions: 0
    };

    const nftRepo = new repositories.Nft(connection);
    const walletRepo = new repositories.Wallet(connection);
    const smartContractRepo = new repositories.SmartContract(connection);
    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

    const { wallets, nftIds } = await filterNftsByWallet(userId, walletUids, connection, false);

    logger.info(nftIds);
    logger.info(wallets);

    const smartContracts = await smartContractRepo.getAllByCriteria(userId, smartContractUids, null, null, true, true, InvalidSmartContractException);
    contractIds = smartContractRepo.getIds(smartContracts);

    // when walletUid is not set | when walletUids is set and nftIds is set &
    // smartContractId not set | when smart contract Uids is set and contract Ids is set
    let nfts = [];
    if (isValidArray(nftIds) === true &&
      (isValidArray(smartContractUids) === false || (isValidArray(smartContractUids) === true && isValidArray(contractIds) === true))) {
      nfts = await nftRepo.getAllByCriteria(userId, false, false, false, nftIds, contractIds, null, null, false);

      if (isValidArray(nfts) === true) {
        // NFT Owned Count
        responseData.nftOwned = nfts.length;
      }
    }

    const walletAddresses = walletRepo.getAddresses(wallets)
    const contractAddresses = smartContractRepo.getAddresses(smartContracts);
    const allnftTransactions = await nftTransactionHistoryRepo.getAllByCriteria(null, contractAddresses, walletAddresses, null);
    const nftTransactions = await nftTransactionHistoryRepo.getPurchaseTxsByCriteria(nftIds, contractAddresses, walletAddresses, NftTransactionEvents.TRANSFER);

    if (isValidArray(nftTransactions) === true) {
      responseData.totalTransactions = allnftTransactions.length;
      responseData.portfolioValue = calculatePortfolioValue(nftTransactions, nftIds, walletAddresses, connection);
    }

    response = successResponse('PortfolioStats', serialize(responseData));
  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Calculate purchase value of portfolio from given nft transactions along with wallet addresses and nftid
 * @param nftTransactions 
 * @param nftIds 
 * @param walletAddresses 
 * @param connection 
 * @returns 
 */
function calculatePortfolioValue(nftTransactions: Array<Record<string, string>>, nftIds: Array<number>, walletAddresses: Array<string>, connection) {
  let portfolioValue = 0.0;

  const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

  if (isValidArray(nftTransactions) === true && isValidArray(nftIds) === true && isValidArray(walletAddresses) === true) {

    nftTransactions.forEach(nftTransaction => {
      const price = nftTransactionHistoryRepo.getPrice(nftTransaction);
        portfolioValue += parseFloat(price);
    });
  }
  return portfolioValue;
}

/**
 * Serialize portfolio stats response
 * @param {OverallPortfolioStatsResponse} data
 */
const serialize = (data: OverallPortfolioStatsResponse) => {
  const serializerSchema = ({
    attributes: [
      'nftOwned',
      'portfolioValue',
      'totalTransactions',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('PortfolioStats', serializerSchema).serialize(data);
}

/**
 * Request validation schema
 */
export const validationSchema = () => ({
  queryStringParameters: {
    walletUids: Vandium.types.string().trim()
      .custom(helpers.joi.customValidationCommaSeparatedUids)
      .optional()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
    smartContractUids: Vandium.types.string().trim()
      .custom(helpers.joi.customValidationCommaSeparatedUids)
      .optional()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
  }
});
