/**
 * Handler to get data points for user's nft transactions
 */
 import * as Vandium from 'vandium';
 import { Serializer } from 'jsonapi-serializer';
 import { repositories } from 'data-access-utility';
 import { helpers, configs, errors } from 'backend-utility';
 
 import { logger } from '../../common/utils/logger';
 import validationMessages from '../../common/validation-code/en';
 import { getDatesAndAggregate } from '../../common/utils/function';

import { ApiSuccessResponse, TransactionsAnalyticsResponse } from 'src/common/types'; 

const { enums } = configs;
const { CONNECTED } = enums.WalletStatus;

 const { functions, responses } = helpers;
 const { getUserId, isValidArray } = functions;
 const { error: errorResponse, success: successResponse } = responses;
 const { WalletUnavailableException, SmartContractUnavailableException } = errors.codes;

 /**
  * Get transactions data points handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  * @param {dbconnection} connection
  */
 export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
   // eslint-disable-next-line no-useless-escape 
   context.callbackWaitsForEmptyEventLoop = false;

   let response: ApiSuccessResponse;

   try {
    const userId = getUserId(context);
    const walletUids = event?.queryStringParameters?.walletUids || [];
    const smartContractUids = event?.queryStringParameters?.smartContractUids || [];
    const startDate: any = event?.queryStringParameters?.startDate || null;
    const endDate: any = event?.queryStringParameters?.endDate || null;
    const smartContractRepo = new repositories.SmartContract(connection);
    const walletRepo = new repositories.Wallet(connection); 

    const responseData: TransactionsAnalyticsResponse = {
      count : 0,
      data: []
    }

    const { startDateFormated ,endDateFormated, aggregate } = getDatesAndAggregate(startDate, endDate)

    const wallets = await walletRepo.getAllByCriteria(userId, walletUids, CONNECTED, true, WalletUnavailableException);
    const walletAddresses = walletRepo.getAddresses(wallets);

    const smartContracts = await smartContractRepo.getAllByCriteria(userId, smartContractUids, null, null, true, true, SmartContractUnavailableException);
    const smartContractAddresses = smartContractRepo.getAddresses(smartContracts);

    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);
    const nftTransactionAnalytics = await nftTransactionHistoryRepo.getTransactionsAnalytics( walletAddresses, smartContractAddresses, startDateFormated, endDateFormated, aggregate );

    const transactionCount = calculateTransactionsCount(nftTransactionAnalytics,connection);
    responseData.data = nftTransactionAnalytics;
    responseData.count = transactionCount || 0;

    response = successResponse('TransactionsAnalytics',serialize(responseData));

    return response;

   } catch (exp) {
     logger.error(exp);
     response = await errorResponse(exp);
   }
   return response;
 };
 
/**
 * Calculate total transactions count
 * @param transactions 
 * @returns transaction count
 */
function calculateTransactionsCount(transactions:any, connection){
  let count = 0;
  if(isValidArray(transactions) === true){
    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

      transactions.forEach(transaction => {
        const transactionCount = nftTransactionHistoryRepo.getCount(transaction);
          count += parseInt(transactionCount);
      });

  return count;
  }
}
 /**
 * Serialize transactions analytics response
 * @param {any} data
 */
  const serialize = (data: any) => {
    const serializerSchema = ({
      attributes: [
         'count',
         'data',
      ],
      keyForAttribute: 'camelCase',
    });
  
    return new Serializer('TransactionsDataPoints', serializerSchema).serialize(data);
  }

 /**
  * Request validation schema
  */
 export const validationSchema = () =>
 // eslint-disable-next-line no-useless-escape
 ({
   queryStringParameters: {
    walletUids: Vandium.types.string()
      .custom(helpers.joi.customValidationCommaSeparatedUids)
      .optional()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
    smartContractUids: Vandium.types.string()
      .custom(helpers.joi.customValidationCommaSeparatedUids)
      .optional()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
    startDate:  Vandium.types.date().required()
    .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transactions_stats')),
    endDate:  Vandium.types.date().required().required()
    .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transactions_stats')),
   },
 });
