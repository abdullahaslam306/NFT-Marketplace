/**
 * Handler to get nft blockchain information
 */
 import * as ld from 'lodash';
 import * as Vandium from 'vandium';
 import { Serializer } from 'jsonapi-serializer';
 import { helpers } from 'backend-utility';
 import { repositories } from 'data-access-utility';
 
 import { logger } from '../../common/utils/logger';
 import validationMessages from '../../common/validation-code/en';
 
 const { functions, responses } = helpers;
 const { getUserId } = functions;
 const { error: errorResponse, success: successResponse } = responses;
 
 /**
  * Get nft blockchain history handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  * @param {dbconnection} connection
  */
 export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
   // eslint-disable-next-line no-useless-escape 
   context.callbackWaitsForEmptyEventLoop = false;
   let response: any;

   try {
     const nftRepo = new repositories.Nft(connection);
     const nftBlockchainInfoRepo = new repositories.NftBlockchainInfo(connection);
    
     const nftUid: string = ld.get(event, 'pathParameters.uid', null);
     const userId: number = getUserId(context);
     const nft: repositories.Nft = await nftRepo.getByUid(nftUid, userId);
     const nftId: number = await nftRepo.getId(nft);

     const nftBlockchainInfoData = await nftBlockchainInfoRepo.getByNftId(nftId);

     response = successResponse('NftBlockchainInfo', serialize(nftBlockchainInfoData));
 
   } catch (exp) {
     logger.error(exp);
     response = errorResponse(exp);
   }
   return response;
 };
 
 /**
 * Serialize nft response
 * @param {Object} data
 */
 function serialize(data: Record<string, any>) {
   const serializerSchema = ({
     id: 'token_id',
     attributes: [
       'network',
       'token_id',
       'token_protocol',
       'contract_address',
       'token_uri',
       'minted_at'
     ],
     keyForAttribute: 'camelCase',
   });
 
   return new Serializer('NftBlockchainInfo', serializerSchema).serialize(data);
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
  }
 });
 