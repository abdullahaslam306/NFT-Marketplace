/**
 * Handler to get financial data points for user's nft transactions
 */
 import * as Vandium from 'vandium';
 import { Serializer } from 'jsonapi-serializer';
 import { repositories } from 'data-access-utility';
 import { helpers, configs, errors } from 'backend-utility';
 
 import { logger } from '../../common/utils/logger';
 import { getDatesAndAggregate } from '../../common/utils/function';
 import validationMessages from '../../common/validation-code/en';

 import { ApiSuccessResponse, FinancialAnalyticsResponse } from 'src/common/types';

const { enums } = configs;
const { CONNECTED } = enums.WalletStatus;
const { SPENDINGS, EARNINGS } = enums.FinancialFilter; 
 const { functions, responses } = helpers;
 const { getUserId, isValidArray } = functions;
 const { error: errorResponse, success: successResponse } = responses;
 const { WalletUnavailableException, SmartContractUnavailableException } = errors.codes;

 /**
  * Get financial data points handler
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
    const filter = event?.pathParameters?.filter || null;
    const smartContractUids = event?.queryStringParameters?.smartContractUids || [];
    const startDate: any = event?.queryStringParameters?.startDate || null;
    const endDate: any = event?.queryStringParameters?.endDate || null;

    const responseData: FinancialAnalyticsResponse = {
      value: 0.0,
      data: [],
    };

    const smartContractRepo = new repositories.SmartContract(connection);
    const walletRepo = new repositories.Wallet(connection); 

    const { startDateFormated ,endDateFormated, aggregate } = getDatesAndAggregate(startDate, endDate)

    const wallets = await walletRepo.getAllByCriteria(userId, walletUids, CONNECTED, true, WalletUnavailableException);
    const walletAddresses = walletRepo.getAddresses(wallets);

    const smartContracts = await smartContractRepo.getAllByCriteria(userId, smartContractUids, null, null, true, true, SmartContractUnavailableException);
    const smartContractAddresses = smartContractRepo.getAddresses(smartContracts);

    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

    switch (filter) {
      case SPENDINGS:
        const earningsAnalytics = await nftTransactionHistoryRepo.getSpendingsAnalytics( walletAddresses, smartContractAddresses, startDateFormated, endDateFormated, aggregate);
        responseData.data = earningsAnalytics;
        break;
        case EARNINGS:
          const spendingsAnalytics = await nftTransactionHistoryRepo.getEarningsAnalytics( walletAddresses, smartContractAddresses, startDateFormated, endDateFormated, aggregate);
          responseData.data = spendingsAnalytics;
        break;
    }

    const totalValue = calculateTotalValue(responseData.data,connection)

    responseData.value = totalValue || 0;

    response = successResponse('FinancialAnalytics', serialize(responseData));

    return response;

   } catch (exp) {
     logger.error(exp);
     response = await errorResponse(exp);
   }
   return response;
 };
  
/**
 * Calculate total financial value
 * @param transactions 
 * @returns financial value
 */
const calculateTotalValue = (transactions:any, connection) => {
  let value = 0.0;
  if(isValidArray(transactions) === true){
    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

      transactions.forEach(transaction => {
        const transactionValue = nftTransactionHistoryRepo.getValue(transaction);
          value += parseFloat(transactionValue);
      });

  return value;
  }
}

 /**
 * Serialize financial analytics response
 * @param {any} data
 */
const serialize = (data: any) => {
    const serializerSchema = ({
      attributes: [
         'value',
         'data',
      ],
      keyForAttribute: 'camelCase',
    });
  
    return new Serializer('FinancialDataPoints', serializerSchema).serialize(data);
  }

 /**
  * Request validation schema
  */
 export const validationSchema = () =>
 // eslint-disable-next-line no-useless-escape
 ({
  pathParameters: {
    filter:  Vandium.types.string().trim().required().allow(EARNINGS,SPENDINGS).only()
    .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transactions_stats')),
   },
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
    endDate:  Vandium.types.date().required()
    .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transactions_stats')),
   },
 });
