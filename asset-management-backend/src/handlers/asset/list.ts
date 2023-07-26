/**
 * Handler to get paginated assets
 */
import * as Vandium from 'vandium';
import { Serializer } from 'jsonapi-serializer';
import { helpers, configs } from 'backend-utility';
import { repositories } from 'data-access-utility';

import { logger } from '../../common/utils/logger';
import { validationMessages } from '../../common/validation-code/en';

const { enums } = configs;
const { ORDERBY, pagination } = configs.defaults;
const {
  AUDIO, IMAGE, THREED_MODEL, VIDEO,
} = enums.AssetTypes;


 const { functions, responses } = helpers;
 const { getUserId } = functions;
 const { error: errorResponse, success: successResponse } = responses;
 
/**
 * Get paginated assets handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
 export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  // eslint-disable-next-line no-useless-escape 
  context.callbackWaitsForEmptyEventLoop = false;
   let response: any;
   
   try {
     const userId = getUserId(context);
     const name = event?.queryStringParameters?.name || null;
     const offset = event?.queryStringParameters?.offset || pagination.offset;
     const limit = event?.queryStringParameters?.limit || pagination.limit;
     const type = event?.queryStringParameters?.type || null;
     const orderBy = event?.queryStringParameters?.orderBy || ORDERBY.DESC;
     const assetRepo = new repositories.Asset(connection);
     const asset = await assetRepo.getByCriteria(userId, offset, limit, type, name, orderBy);
     response = await successResponse('AssetList', serialize(asset));
   } catch (exp) {
     logger.error(exp);
     response = await errorResponse(exp);
   }
   return response;
 };

 /**
 * Serialize assets response
 * @param {Object} data
 */
function serialize(data: Record<string, any>) {
  const serializerSchema = ({
    id: 'uid',
    attributes: [
      'name',
      'type',
      'size',
      'status',
      'original_path',
      'file_extension',
      'thumbnail_path',
      'compressed_path',
      'createdAt',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Assets', serializerSchema).serialize(data);
}

/**
 * Request validation schema
 */
 export const validationSchema = () =>
 // eslint-disable-next-line no-useless-escape
 ({
   queryStringParameters: {
     offset: Vandium.types.number().integer().min(0)
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
     name: Vandium.types.string().max(255)
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
     limit: Vandium.types.number().integer().min(1)
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
     type: Vandium.types.string()
       .allow(AUDIO, IMAGE, THREED_MODEL, VIDEO)
       .only()
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
     orderBy: Vandium.types.string().uppercase()
       .allow( ORDERBY.ASC, ORDERBY.DESC )
       .only()
       .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'asset_info')),
   },
 });