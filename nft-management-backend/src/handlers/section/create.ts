/**
 * Handler to create nft section
 */

import * as ld from 'lodash';
import * as Vandium from 'vandium';
import { Serializer } from 'jsonapi-serializer';
import { repositories } from 'data-access-utility';
import {
  CommonError, errors, configs, helpers,
} from 'backend-utility';

import { logger } from '../../common/utils/logger';
import { ApiSuccessResponse } from '../../common/types';
import validationMessages from '../../common/validation-code/en';

const { getUserId } = helpers.functions;
const { MaxNftSectionsCount } = configs.defaults;
const { PENDING, LIVE_LOCKED } = configs.enums.NftStatus;
const { error: errorResponse, success: successResponse } = helpers.responses;
const { code: sectionCreateSuccessCode } = configs.responses.CreateNFTSection;
const { MaxNftSectionException, NftSectionNotInEditStateException } = errors.codes;


/**
 * Create nft section handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {

  context.callbackWaitsForEmptyEventLoop = false;

  let response: ApiSuccessResponse;
  try {
    const title: string = ld.get(event.body, 'title', null);
    const content: string = ld.get(event.body, 'content', null);
    const nftUid: string = ld.get(event.pathParameters, 'uid', null);
    const userId = getUserId(context);

    const nftRepo: repositories.Nft = new repositories.Nft(connection);
    const nftSectionRepo: repositories.NftSection = new repositories.NftSection(connection);

    await nftRepo.getByUid(nftUid, userId, false, false, false, true);
    const nftStatus: string = nftRepo.getStatus();


    if (nftStatus === PENDING || nftStatus === LIVE_LOCKED) {
      throw new CommonError(NftSectionNotInEditStateException);
    }

    const nftId: number = nftRepo.getId();
    const nftSections: number = await nftSectionRepo.getCountByNft(nftId);

    if (nftSections >= MaxNftSectionsCount) {
      throw new CommonError(MaxNftSectionException);
    }

    const nftSection: Record<string, unknown> = await nftSectionRepo.create(nftId, title, content);

    response = await successResponse(sectionCreateSuccessCode, serialize(nftSection));
  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Serialize create nft section response
 * @param {Object} data
 */
const serialize = (data: Record<string, unknown>) => {
  const attributes: Array<string> = [
    'title'
  ];
  const serializerSchema: Record<string, unknown> = ({
    id: 'uid',
    attributes,
    keyForAttribute: 'camelCase',
  });

  return new Serializer('NftSection', serializerSchema).serialize(data);
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
    },
    body: Vandium.types.object({
      title: Vandium.types.string().trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_section')),
      content: Vandium.types.string().trim().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_section')),
    })
      .or('title', 'content')
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_section'))
  };
}
