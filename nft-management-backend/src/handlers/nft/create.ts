/**
 * Handler to create nft
 */

import * as ld from 'lodash';
import * as Vandium from 'vandium';
import * as Sequelize from 'sequelize';
import { Serializer } from 'jsonapi-serializer';
import { repositories } from 'data-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { logger } from '../../common/utils/logger';
import { ApiSuccessResponse } from '../../common/types';
import { getTokenProtocol } from '../../common/utils/function';
import validationMessages from '../../common/validation-code/en';

const { functions, responses } = helpers;
const { isValid, getUserId } = functions;
const { BlockChainNetwork, WalletTypes } = configs.enums;
const { BlocommerceSmartContractPlatformName, NftSecondarySaleRoyalty } = configs.defaults;
const { error: errorResponse, success: successResponse } = responses;

const { NoAssociatedWalletException } = errors.codes;

/**
 * Create nft handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let response: ApiSuccessResponse;
  let transaction: Sequelize.Transaction;
  try {
    const title = ld.get(event.body, 'title');
    const totalEditions = ld.get(event.body, 'totalEditions');
    const secondarySaleRoyalty = ld.get(event.body, 'secondarySaleRoyalty');

    transaction = await connection.sequelize.transaction();
    const userId = getUserId(context);

    const nftRepo = new repositories.Nft(connection);
    const walletRepo = new repositories.Wallet(connection);
    const smartContractRepo = new repositories.SmartContract(connection);

    const tokenProtocol = getTokenProtocol(totalEditions);
    
    await smartContractRepo.getByCriteria(BlocommerceSmartContractPlatformName, tokenProtocol);
    const smartContractId = smartContractRepo.getId();
    
    let userWalletAddress = null;
    let walletId = null;
   
    if (isValid(userId) === true) {
      const userWallet = await walletRepo.getByUserId(userId, BlockChainNetwork.ETHEREUM, true, null, WalletTypes.BLOCOMMERCE);
      walletId = walletRepo.getId(userWallet);
      userWalletAddress = walletRepo.getAddress(userWallet);
      
      if (isValid(userWalletAddress) !== true) {
        throw new CommonError(NoAssociatedWalletException);
      }
    }

    const nft = await nftRepo.create(userId, title, totalEditions, secondarySaleRoyalty, smartContractId, transaction);
    
    if (isValid(userId) === true) {
      const nftId: number = nftRepo.getId();
      await nftRepo.addOwnership(nftId, userWalletAddress, totalEditions, userId, 0, transaction, true, null, walletId);
    }
    response = await successResponse('NFTCreated', serialize(nft));
    transaction.commit();
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
    body: {
      title: Vandium.types.string().max(255)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
      totalEditions: Vandium.types.number().integer().min(1)
        .required()
        .cast('string')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
      secondarySaleRoyalty: Vandium.types.number().precision(2)
        .min(NftSecondarySaleRoyalty.MIN)
        .max(NftSecondarySaleRoyalty.MAX)
        .default(0)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
    }
  };
}

/**
 * Serialize create nft response
 * @param {Object} data
 */
const serialize = (data: Record<string, any>) => {
  const attributes: Array<string> = [
    'title',
    'total_editions',
    'secondary_sale_royalty',
    'status',
  ];
  const serializerSchema: Record<string, any> = ({
    id: 'uid',
    attributes,
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Nft', serializerSchema).serialize(data);
}
