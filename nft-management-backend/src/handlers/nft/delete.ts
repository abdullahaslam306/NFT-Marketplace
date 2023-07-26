/**
 * Handler to delete nft
 */

import * as ld from 'lodash';
import * as Vandium from 'vandium';
import * as Sequelize from 'sequelize';
import { repositories } from 'data-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { logger } from '../../common/utils/logger';
import validationMessages from '../../common/validation-code/en';

const { functions, responses } = helpers;
const { getUserId, isValid } = functions;
const { LIVE_LOCKED, PENDING } = configs.enums.NftStatus;
const { error: errorResponse, success: successResponse } = responses;
const { NftDeleteException } = errors.codes;

/**
 * Delete nft handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let response: any;
  let transaction: Sequelize.Transaction;
  try {
    const nftUid: string = ld.get(event, 'pathParameters.uid', null);
    const userId: number = await getUserId(context);

    const nftRepo = new repositories.Nft(connection);
    const nftAssetRepo = new repositories.NftAsset(connection);
    const nftOwnerRepo = new repositories.NftOwner(connection);
    const nftSectionRepo = new repositories.NftSection(connection);
    const nftCollaboratorRepo = new repositories.NftCollaborator(connection);
    const nftBlockchainInfoRepo = new repositories.NftBlockchainInfo(connection);
    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

    const nft: repositories.Nft = await nftRepo.getByUid(nftUid, userId);
    const nftId: number = await nftRepo.getId(nft);
    const nftStatus: string = await nftRepo.getStatus(nft)

    if (nftStatus === LIVE_LOCKED || nftStatus === PENDING) {
      throw new CommonError(NftDeleteException);
    }

    transaction = await connection.sequelize.transaction();
    
    await nftOwnerRepo.delete(nftId, transaction);
    await nftAssetRepo.delete(nftId, transaction);
    await nftBlockchainInfoRepo.delete(nftId, transaction);
    await nftCollaboratorRepo.delete(nftId, transaction);
    await nftSectionRepo.deleteSectionByNftId(nftId, transaction);
    await nftTransactionHistoryRepo.deleteByNftId(nftId, transaction);
    await nftRepo.delete(nftId, transaction);

    transaction.commit();
    response = successResponse('NFT Deleted', 'Nft has been deleted successfully.');
  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
    if (isValid(transaction) === true) {
      transaction.rollback();
    }
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
    }
  };
}
