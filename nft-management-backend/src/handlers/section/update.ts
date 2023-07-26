/**
 * Handler to update nft section
 */

import * as ld from 'lodash';
import * as Vandium from 'vandium';

import {
  CommonError, errors, configs, helpers,
} from 'backend-utility';
import { repositories } from 'data-access-utility';

import { logger } from '../../common/utils/logger';
import { ApiSuccessResponse } from '../../common/types/index';
import validationMessages from '../../common/validation-code/en';

const { PENDING, LIVE_LOCKED } = configs.enums.NftStatus;
const { UpdateNFTSection } = configs.responses;
const { NftNotInEditStateException, NftSectionUpdateException } = errors.codes;

const { functions, responses } = helpers;
const { getUserId, isValid } = functions;
const { code: sectionUpdateSuccessCode, message: sectionUpdateSuccessMessage } = UpdateNFTSection;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Update nft section handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} context
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {

  context.callbackWaitsForEmptyEventLoop = false;

  let response: ApiSuccessResponse;
  try {
    const nftUid: string = ld.get(event.pathParameters, 'uid', null);
    const nftSectionUid: string = ld.get(event.pathParameters, 'sectionUid', null);
    const title: string = ld.get(event.body, 'title', null);
    const content: string = ld.get(event.body, 'content', null);
    const userId = getUserId(context);

    if (isValid(title) === false && isValid(content) === false) {
      throw new CommonError(NftSectionUpdateException);
    }

    const nftRepo: repositories.Nft = new repositories.Nft(connection);
    const nftSectionRepo: repositories.NftSection = new repositories.NftSection(connection);
    await nftRepo.getByUid(nftUid, userId, false, false, false, true);
    const nftStatus: string = nftRepo.getStatus();

    if (nftStatus === PENDING || nftStatus === LIVE_LOCKED) {
      throw new CommonError(NftNotInEditStateException);
    }

    const nftSection: Record<string, unknown> = await nftSectionRepo.getByUid(nftSectionUid);
    await nftSectionRepo.update(nftSection, title, content);

    response = await successResponse(sectionUpdateSuccessCode, sectionUpdateSuccessMessage);
  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request Validation Schema
 */
export const validationSchema = () => {
  return {
    pathParameters: {
      uid: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
      sectionUid: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_section')),
    },
    body: Vandium.types.object({
      title: Vandium.types.string()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_section')),
      content: Vandium.types.string()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_section')),
    })
      .or('title', 'content')
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_section'))
  };
}
