/**
 * Handler to get paginated nft transaction history
 */
 import * as ld from 'lodash';
 import * as Vandium from 'vandium';
 import { Serializer } from 'jsonapi-serializer';
 import { helpers, configs } from 'backend-utility';
 import { repositories } from 'data-access-utility';
 
 import { logger } from '../../common/utils/logger';
 import validationMessages from '../../common/validation-code/en';
 
 const { ORDERBY, pagination } = configs.defaults;
 
 const { functions, responses } = helpers;
 const { getUserId } = functions;
 const { error: errorResponse, success: successResponse } = responses;
 
 /**
  * Get paginated nft transaction history handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  * @param {dbconnection} connection
  */
 export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
   // eslint-disable-next-line no-useless-escape 
   context.callbackWaitsForEmptyEventLoop = false;

   let response: any;
   try {
     
    const offset = ld.get(event, 'queryStringParameters.offset', null);
    const limit = ld.get(event, 'queryStringParameters.limit', null);
    const orderBy = ld.get(event, 'queryStringParameters.orderBy', null);

    const nftRepo = new repositories.Nft(connection);
    const nftTransactionHistory = new repositories.NftTransactionHistory(connection);
  
    const nftUid: string = ld.get(event, 'pathParameters.uid', null);
    const userId: number = await getUserId(context);
    const nft: repositories.Nft = await nftRepo.getByUid(nftUid, userId);
    const nftId: number = await nftRepo.getId(nft);

    const nftTransactionHistoryData = await nftTransactionHistory.getByNftId(nftId, offset, limit, orderBy);

    response = await successResponse('NftTransactionHistory', serialize(nftTransactionHistoryData, offset, limit));
 
   } catch (exp) {
     logger.error(exp);
     response = await errorResponse(exp);
   }
   return response;
 };
 
 /**
 * Serialize nfts response
 * @param {Object} data
 */
 function serialize(data: Record<string, any>, offset: number, limit: number) {
   const {count: totalRecords, rows} = data;
   const serializerSchema = ({
     meta: {
       offset,
       limit: (offset === -1) ? null : limit,
       totalRecords,
     },
     id: 'id',
     attributes: [
       'nft_id',
       'event_name',
       'price',
       'from_wallet_address',
       'to_wallet_address',
       'event_time',
       'ipfs_link',
       'gas_fees',
       'editions',
       'transaction_has'
     ],
     keyForAttribute: 'camelCase',
   });
 
   return new Serializer('NftTransactionHistory', serializerSchema).serialize(rows);
 }
 
 /**
  * Request validation schema
  */
 export const validationSchema = () =>
 // eslint-disable-next-line no-useless-escape
 ({
  pathParameters: {
    uid:  Vandium.types.string().trim().guid({ version: 'uuidv4' })
      .required()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
  },
   queryStringParameters: {
     offset: Vandium.types.number().integer().min(0).default(pagination.offset)
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
     limit: Vandium.types.number().integer().min(1).default(pagination.limit)
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
     orderBy: Vandium.types.string().uppercase()
       .allow(ORDERBY.ASC, ORDERBY.DESC)
       .only().default(ORDERBY.DESC)
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
   },
 });
 