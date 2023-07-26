/**
 * Handler to update nft
 */

import * as ld from 'lodash';
import * as Vandium from 'vandium';
import * as Sequelize from 'sequelize';
import { repositories } from 'data-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { logger } from '../../common/utils/logger';
import { getTokenProtocol, sendPubNubNotification } from '../../common/utils/function';
import validationMessages from '../../common/validation-code/en';
import {
  LambdaResponse,
  NftTagsRequest,
  NftAssetRequest,
  UnLockableContent,
  ApiSuccessResponse,
  NftPropertiesRequest,
  NftCollaboratorsRequest,
  ParsedLazyMintLambdaResponse,
} from '../../common/types';

const { defaults, enums, pubnubNotifications } = configs;
const { REGION, STAGE } = process.env;
const { functions, responses, lambda } = helpers;
const { getUserId, getUserUid, isValid, isValidArray } = functions;
const { BlocommerceSmartContractPlatformName, NftSecondarySaleRoyalty } = defaults;
const { error: errorResponse, success: successResponse, parseLambdaResponse } = responses;
const { BlockChainNetwork, NftAssetType, NftStatus, LambdaInvocationType, WalletStatus, WalletTypes } = enums;
const { CreateNftCollaboratorException, NftNotInEditStateException, CannotSetNftUnlockableContentException } = errors.codes;

const { MAIN, AUXILIARY } = NftAssetType;
const { EVENT, REQUEST_RESPONSE } = LambdaInvocationType;
const { DRAFT, LAZY_MINTED, LIVE_LOCKED, PENDING } = NftStatus;

const { NftLazyMintedNotification, NftLockMintedNotification } = pubnubNotifications;


/**
 * Update nft handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {Object} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let response: ApiSuccessResponse;
  try {
    let pubnubNotificaiton;
    let tokenId;
    let signature;
    let reqDescription: string;
    logger.info(event.body);
    let reqStatus: string = ld.get(event, 'body.status', null);
    const reqTitle: string = ld.get(event, 'body.title', null);
    const nftUid: string = ld.get(event, 'pathParameters.uid', null);

    reqDescription = ld.get(event, 'body.description', null);
    const reqTags: Array<NftTagsRequest> = ld.get(event, 'body.tags', null);
    const reqTotalEditions: number = ld.get(event, 'body.totalEditions', null);
    const reqAssets: Array<NftAssetRequest> = ld.get(event, 'body.assets', null);
    const reqUnlockableContent: string = ld.get(event, 'body.unlockableContent', null);
    const reqSecondarySaleRoyalty: number = ld.get(event, 'body.secondarySaleRoyalty', null);
    const reqHasUnlockableContent: boolean = ld.get(event, 'body.hasUnlockableContent', null);
    const reqProperties: Array<NftPropertiesRequest> = ld.get(event, 'body.properties', null);
    const reqCollaborators: Array<NftCollaboratorsRequest> = ld.get(event, 'body.collaborators', null);

    const userId: number = getUserId(context);

    const nftRepo = new repositories.Nft(connection);
    const walletRepo = new repositories.Wallet(connection);
    const smartContractRepo = new repositories.SmartContract(connection);
    const nftBlockchainInfoRepo = new repositories.NftBlockchainInfo(connection);
    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

    const nft = await nftRepo.getByUid(nftUid, userId);

    const nftId: number = nftRepo.getId();
    const nftStatus: string = nftRepo.getStatus();
    const nftDescription = nftRepo.getDescription();
    const nftSignature: string = nftRepo.getSignature();
    const nftTotalEditions: number = nftRepo.getTotalEditions();
    const nftUnlockableContent: string = nftRepo.getUnlockableContent();
    const nftHasUnlockableContent: boolean = nftRepo.getHasUnLockableContent();

    let tokenProtocol: string = getTokenProtocol(nftTotalEditions);

    let smartContract: Record<string, any> = await smartContractRepo.getByCriteria(BlocommerceSmartContractPlatformName, tokenProtocol)
    let smartContractId: number = smartContractRepo.getId(smartContract);

    if (nftStatus === LIVE_LOCKED || nftStatus === PENDING) {
      throw new CommonError(NftNotInEditStateException);
    }

    if (isValid(reqHasUnlockableContent) === false && nftHasUnlockableContent !== true && isValid(reqUnlockableContent) === true) {
      throw new CommonError(CannotSetNftUnlockableContentException);
    }

    await connection.sequelize.transaction(async transaction => {

      // Updating nft_asset information
      if (isValidArray(reqAssets) === true) {
        await updateNftAssets(userId, nftId, reqAssets, connection, transaction);
      }

      // Updating nft_collaborator information
      if (isValidArray(reqCollaborators) === true) {
        await updateNftCollaborators(nftId, reqCollaborators, connection, transaction);
      }


      if (isValid(reqDescription) === false && isValid(nftDescription) === true) {
        reqDescription = nftDescription;
      }

      if (isValid(reqTotalEditions) === true && reqTotalEditions !== nftTotalEditions) {
        // update nft_owners information about editions owned.
        const nftOwnerRepo = new repositories.NftOwner(connection);
        await nftOwnerRepo.update(nftId, userId, null, reqTotalEditions, null, transaction);

        tokenProtocol = getTokenProtocol(reqTotalEditions);
        smartContract = await smartContractRepo.getByCriteria(BlocommerceSmartContractPlatformName, tokenProtocol)
        smartContractId = smartContractRepo.getId(smartContract);
      }
      // Update the nft lazy mint signature only if
      // - Status changes from draft to lazy minted or
      // - no. of total editions are changed
      let payload;
      switch (reqStatus) {
        case LAZY_MINTED:
          if (nftStatus === DRAFT || (nftStatus === LAZY_MINTED && isValid(reqTotalEditions) === true && reqTotalEditions !== nftTotalEditions)) {
            const editions = isValid(reqTotalEditions) ? reqTotalEditions : nftTotalEditions;
            payload = {
              editions,
              tokenId: nftId,
              userId: userId,
            };
            const lambdaResponse: LambdaResponse = await lambda.invoke(`nft-management-backend-${STAGE}-LazyMint`, payload, REQUEST_RESPONSE, REGION, 3105);
            const parsedResponse: ParsedLazyMintLambdaResponse = parseLambdaResponse(lambdaResponse);
            signature = parsedResponse?.signature;
            tokenId = parsedResponse?.tokenId;
            const contractAddress = smartContractRepo.getAddress(smartContract);
            await nftBlockchainInfoRepo.upsertNftBlockChainInfo(nftId, contractAddress, tokenId, tokenProtocol, null, BlockChainNetwork.ETHEREUM, transaction);

            if (isValid(nftSignature) === false) {
              const wallet = await walletRepo.getByUserId(userId, BlockChainNetwork.ETHEREUM, true, null, WalletTypes.BLOCOMMERCE, WalletStatus.CONNECTED);
              const walletAddress = walletRepo.getAddress(wallet);

              await nftTransactionHistoryRepo.create(nftId, LAZY_MINTED, tokenId, contractAddress, null, walletAddress, editions, null, 0, 0, null, null, transaction);
            }
            else {
              await nftTransactionHistoryRepo.update(nftId, LAZY_MINTED, reqTotalEditions, contractAddress, transaction)
            }

            logger.info(parsedResponse, 'Parsed Lambda Response');

            pubnubNotificaiton = { title: NftLazyMintedNotification.title, message: `${NftLazyMintedNotification.message} ${reqTitle}`}
          }
          break;
        case LIVE_LOCKED:
          if (isValid(reqDescription) === false) {
            reqDescription = 'This NFT has no description'
          }
          reqStatus = PENDING;
          payload = {
            userId,
            nftUid: nftUid,
          };
          //eslint-disable-next-line no-case-declarations
          const lambdaResponse: LambdaResponse = await lambda.invoke(`nft-management-backend-${STAGE}-MoveNftAsset`, payload, EVENT, REGION, 3105);
          logger.info(lambdaResponse, 'Lambda Response MoveNftAsset');

          pubnubNotificaiton = { title: NftLockMintedNotification.title, message: `${NftLockMintedNotification.message} ${reqTitle}`}

          break;
      }
      logger.info(`${reqStatus}`, payload);

      const { hasUnlockableContent, unlockableContent }: UnLockableContent = determineNftUnlockableContent(reqHasUnlockableContent, reqUnlockableContent, nftHasUnlockableContent, nftUnlockableContent);
      await nftRepo.update(nft, reqTitle, reqDescription, reqTotalEditions, reqSecondarySaleRoyalty, hasUnlockableContent, unlockableContent, reqTags, reqProperties, reqStatus, signature, smartContractId, transaction, tokenId);
    });

    const userUid = getUserUid(context);
    await sendPubNubNotification(userUid, pubnubNotificaiton);

    response = successResponse('NFT Updated', 'Nft information has been updated successfully.');
  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Update nft assets for given nft id and requested assets
 * @param {Number} userId
 * @param {Number} nftId
 * @param {Array<NftAssetRequest>} reqAssets 
 * @param {Object} connection
 * @param {Sequelize.Transaction} transaction 
 */
async function updateNftAssets(userId: number, nftId: number, reqAssets: Array<NftAssetRequest>, connection: Record<string, unknown>, transaction: Sequelize.Transaction) {
  const assetRepo = new repositories.Asset(connection);
  const nftAssetRepo = new repositories.NftAsset(connection);

  const assetUids = getUids(reqAssets);
  const assets = await assetRepo.getByUids(assetUids, userId);

  await nftAssetRepo.delete(nftId, transaction);
  await nftAssetRepo.associateAssets(nftId, reqAssets, assets, transaction);
}

/**
 * Update collaborators for given nft id
 * @param {Number} nftId
 * @param {Array<String>} collaborators
 * @param {Object} connection 
 * @param {Sequelize.Transaction} transaction 
 */
const updateNftCollaborators = async (nftId: number, collaborators: Array<NftCollaboratorsRequest>, connection: Record<string, unknown>, transaction: Sequelize.Transaction) => {
  const userRepo = new repositories.User(connection);
  const nftCollaboratorRepo = new repositories.NftCollaborator(connection);

  const users = await userRepo.getByUids(collaborators, true, CreateNftCollaboratorException);
  await nftCollaboratorRepo.associateCollaborators(nftId, users, transaction);
}

/**
 * Get uids from the list of asset
 * @param {Array<String>} assets 
 * @returns 
 */
const getUids = assets => {
  const assetUids = []
  assets.forEach(asset => {
    assetUids.push(asset.assetUid);
  });

  return assetUids
}

/**
 * Determine unlockablecontent and hasunlockablecontent values in an object for given request
 * @param {Boolean} reqHasUnlockableContent
 * @param {String} reqUnlockableContent
 * @param {Boolean} nftHasUnlockableContent 
 * @param {String} nftUnlockableContent 
 * @returns {UnLockableContent} Value of has_unlockable_content column in nft
 */
const determineNftUnlockableContent = (reqHasUnlockableContent: boolean, reqUnlockableContent: string, nftHasUnlockableContent: boolean, nftUnlockableContent: string) => {
  const unlockableContentObj: UnLockableContent = {
    hasUnlockableContent: isValid(reqHasUnlockableContent) === true ? reqHasUnlockableContent : nftHasUnlockableContent,
    unlockableContent: isValid(reqUnlockableContent) === true ? reqUnlockableContent : nftUnlockableContent
  };

  if (unlockableContentObj.hasUnlockableContent !== true) {
    unlockableContentObj.unlockableContent = null;
  }
  return unlockableContentObj;
}

/**
 * Request Validation Schema
 */
export const validationSchema = () => {

  const assetRequest = Vandium.types.object().keys({
    assetUid: Vandium.types.string().trim().guid({ version: 'uuidv4' }).required(),
    assetType: Vandium.types.string().allow(MAIN, AUXILIARY).only().required(),
  });

  const collaboratorsRequest = Vandium.types.string().trim().guid({ version: 'uuidv4' }).required().min(1);

  const tagsRequest = Vandium.types.string().trim();

  const propertiesRequest = Vandium.types.object().keys({
    name: Vandium.types.string().trim().required(),
    value: Vandium.types.string().trim().required().allow(''),
  });

  return {
    pathParameters: {
      uid: Vandium.types.string().trim().guid({ version: 'uuidv4' })
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
    },
    body: {
      title: Vandium.types.string().max(255)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
      totalEditions: Vandium.types.number().integer().min(1)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
      secondarySaleRoyalty: Vandium.types.number().precision(2)
        .min(NftSecondarySaleRoyalty.MIN).max(NftSecondarySaleRoyalty.MAX)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
      description: Vandium.types.string().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      hasUnlockableContent: Vandium.types.boolean()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      unlockableContent: Vandium.types.string().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      hasLockableContent: Vandium.types.boolean()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      lockableContent: Vandium.types.string().allow('')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      assets: Vandium.types.array().items(assetRequest)
        .custom(helpers.joi.customValidationNftAssetsUpdate)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      tags: Vandium.types.array().items(tagsRequest).unique()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      properties: Vandium.types.array().items(propertiesRequest)
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      collaborators: Vandium.types.array().items(collaboratorsRequest).unique()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
      status: Vandium.types.string().trim().allow(LAZY_MINTED, LIVE_LOCKED,).only()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'update_nft')),
    }
  };
}
