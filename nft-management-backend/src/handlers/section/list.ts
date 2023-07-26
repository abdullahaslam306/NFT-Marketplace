/**
 * Handler to list nft sections
 */

import * as ld from 'lodash';
import * as Vandium from 'vandium';
import { Serializer } from 'jsonapi-serializer';

import { repositories } from 'data-access-utility';
import { configs, helpers } from 'backend-utility';

import { logger } from '../../common/utils/logger';
import { ApiSuccessResponse } from '../../common/types/index';
import validationMessages from '../../common/validation-code/en';

const { functions, responses } = helpers;
const { getUserId } = functions;
const { error: errorResponse, success: successResponse } = responses;
const { code: ListNftSectionsCode } = configs.responses.ListNftSections;

/**
 * List nft sections handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {

  context.callbackWaitsForEmptyEventLoop = false;

  let response: ApiSuccessResponse;
  try {
    const nftUid: string = ld.get(event.pathParameters, 'uid', null);
    const userId = getUserId(context);

    const nftRepo: repositories.Nft = new repositories.Nft(connection);
    const nftSectionRepo: repositories.NftSection = new repositories.NftSection(connection);

    await nftRepo.getByUid(nftUid, userId, false, false, false, true);
    const nftId: number = nftRepo.getId();
    const nftSections: Array<Record<string, unknown>> = await nftSectionRepo.getAllByNftId(nftId);

    response = await successResponse(ListNftSectionsCode, serialize(nftSections));
  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
* Serialize response
* @param {Object} data
*/
function serialize(data: Array<Record<string, unknown>>) {
  const attributes: Array<string> = [
    'title',
    'content',
  ];
  const serializerSchema: Record<string, unknown> = ({
    id: 'uid',
    attributes,
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Section', serializerSchema).serialize(data);
}

/**
 * Request Validation Schema
 */
export const validationSchema = () => {
  return {
    pathParameters: {
      uid: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
    }
  };
}
