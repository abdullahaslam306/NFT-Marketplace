/**
 * Handler to delete nft section
 */

import * as ld from 'lodash';
import * as Vandium from 'vandium';
import { repositories } from 'data-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { ApiSuccessResponse } from '../../common/types';
import { logger } from '../../common/utils/logger';
import validationMessages from '../../common/validation-code/en';

const { getUserId } = helpers.functions;
const { NftSectionDeleteException } = errors.codes;
const { error: errorResponse, success: successResponse } = helpers.responses;
const { LIVE_LOCKED, PENDING } = configs.enums.NftStatus;
const { code: deleteNftSectionCode, message: deleteNftSectionMessage } = configs.responses.DeleteNftSection;

/**
 * Delete nft section handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let response: ApiSuccessResponse;
  try {
    const nftUid: string = ld.get(event.pathParameters, 'uid', null);
    const nftSectionUid: string = ld.get(event.pathParameters, 'sectionUid', null);

    const userId: number = await getUserId(context);

    const nftRepo: repositories.Nft = new repositories.Nft(connection);
    const nftSectionRepo: repositories.NftSection = new repositories.NftSection(connection);

    await nftRepo.getByUid(nftUid, userId, false, false, false, true);
    const nftStatus: string = await nftRepo.getStatus()

    if (nftStatus === LIVE_LOCKED || nftStatus === PENDING) {
      throw new CommonError(NftSectionDeleteException);
    }
    await nftSectionRepo.delete(nftSectionUid);

    response = successResponse(deleteNftSectionCode, deleteNftSectionMessage);
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
      }
  };
}