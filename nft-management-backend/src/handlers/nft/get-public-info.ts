/**
 * Handler to get nft info for public access
 */
 import * as ld from 'lodash';
 import * as Vandium from 'vandium';
 import { helpers } from 'backend-utility';
 import { Serializer } from 'jsonapi-serializer';
 import { repositories } from 'data-access-utility';
 
 import { logger } from '../../common/utils/logger';
 import { ApiSuccessResponse } from 'src/common/types';
 import validationMessages from '../../common/validation-code/en';
 
 const { functions, responses } = helpers;
 const { getUserId, isValidArray } = functions;
 const { error: errorResponse, success: successResponse } = responses;
 
 /**
  * Get nft info handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  * @param {dbconnection} connection
  */
 export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
   // eslint-disable-next-line no-useless-escape 
   context.callbackWaitsForEmptyEventLoop = false;
 
   let response: ApiSuccessResponse;
   let owner: Record<string, unknown> = {};
   let assets: Array<Record<string, unknown>> = [];
   const collaborators: Array<Record<string, unknown>> = [];

   try {
     const nftRepo = new repositories.Nft(connection);
     const userRepo = new repositories.User(connection);
     const smartContractRepo = new repositories.SmartContract(connection);
     const nftCollaboratorRepo = new repositories.NftCollaborator(connection);

     const smartContractAddress = ld.get(event.queryStringParameters, 'contractAddress');
     const signature = ld.get(event.queryStringParameters, 'signature', null);
     const tokenId = ld.get(event.queryStringParameters, 'tokenId', null);
     
     const smartContract: Record<string, unknown> = await smartContractRepo.getByAddress(smartContractAddress);
     const smartContractId = smartContractRepo.getId(smartContract);
     const nft: Record<string, unknown> = await nftRepo.getByCriteria(smartContractId, signature, tokenId, true, true);
     const nftCollaborators: Array<Record<string, unknown>> = nftRepo.getNftCollaborators(nft);
     const nftAssets: Array<Record<string, unknown>> = nftRepo.getNftAssets(nft);

     const userId: number = nftRepo.getNftUserId(nft);
     const collaboratorIds: Array<number> = nftCollaborators.map(collaborator => nftCollaboratorRepo.getUserId(collaborator));
     const userIds: Array<number> = [userId, ...collaboratorIds];
 
     if (isValidArray(userIds) === true && userIds.includes(null) === false) {
       const users: Array<Record<string, unknown>> = await userRepo.getByIds(userIds);
 
       users.forEach(user => {
         const id: number = userRepo.getId(user);
         if (id === userId) {
           owner = user;
         } else {
           collaborators.push(user);
         }
       });
     }
 
     if (isValidArray(nftAssets) === true) {
       assets = nftAssets.map(nftAsset => {
         const updatedAsset = nftAsset.asset;
         updatedAsset['asset_type'] = nftAsset.asset_type;
         return updatedAsset;
       });
     }
 
     nft['owner'] = owner;
     nft['assets'] = assets;
     nft['collaborators'] = collaborators;
 
     response = await successResponse('Nft', serialize(nft));
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
 const serialize = (data: Record<string, any>) => {
   const serializerSchema = ({
     id: 'uid',
     attributes: [
       'tags',
       'owner',
       'title',
       'assets',
       'status',
       'createdAt',
       'properties',
       'description',
       'collaborators',
       'total_editions',
       'lockable_content',
       'has_lockable_content',
     ],
     assets: {
       ref: 'uid',
       attributes: [
         'type',
         'asset_type',
         'bucket_name',
         'original_path',
         'thumbnail_path',
         'compressed_path',
       ],
     },
     collaborators: {
       ref: 'uid',
       attributes: ['username', 'picture', 'bio', 'twitter', 'facebook', 'instagram'],
     },
     owner: {
       ref: 'uid',
       attributes: ['username', 'picture', 'bio', 'twitter', 'facebook', 'instagram'],
     },
     keyForAttribute: 'camelCase',
   });
 
   return new Serializer('Nft', serializerSchema).serialize(data);
 }
 
 /**
  * Request validation schema
  */
 export const validationSchema = () => {
  return {
    queryStringParameters:
      Vandium.types.object().keys({
        contractAddress: Vandium.types.string().max(255)
          .required()
          .custom(helpers.joi.customValidationEthAddress)
          .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'public_nft')),

        signature: Vandium.types.string().trim().allow('')
          .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'public_nft')),
        tokenId: Vandium.types.string()
          .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'public_nft')),
      })
      .or('signature', 'tokenId'),
  };
}