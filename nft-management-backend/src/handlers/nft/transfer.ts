/**
 * Handler to transfer of nft
 */
import * as ld from 'lodash';
import * as Vandium from 'vandium';
import { repositories } from 'data-access-utility';

import {
  CommonError, configs, errors, helpers,
} from 'backend-utility';

import { logger } from '../../common/utils/logger';
import validationMessages from '../../common/validation-code/en';

import { getSmartContractInfoByContractId, getUserWallet, sendPubNubNotification } from '../../common/utils/function'

const { PROVIDER } = process.env;

const { blockchain } = helpers;
const { NETWORK_URL } = process.env;
const { LIVE_LOCKED } = configs.enums.NftStatus;

const { MfaTransactionAction } = configs.enums;
const { getUserId, getUserUid, getOtpCodeRegex, isValid } = helpers.functions;
const { success: successResponse, error: errorResponse } = helpers.responses;
const { TransferNftNotLiveException, NftOwnershipNotFoundException, InvalidWalletAddressException, SameNftDestinationAddressException } = errors.codes;

const { NftSentNotification } = configs.pubnubNotifications;

export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  let transaction;
  let response;
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const userId = getUserId(context);
    const emailCode: number = ld.get(event, 'body.emailCode', null);
    const phoneCode: string = ld.get(event, 'body.phoneCode', null);
    const nftUid: string = ld.get(event, 'pathParameters.uid', null);
    const destinationWalletAddress: string = ld.get(event, 'body.to', null);
    const editionsToTransfer: number = ld.get(event, 'body.editions', null);
    const transactionUid: string = ld.get(event, 'body.transactionUid', null);

    const nftRepo = new repositories.Nft(connection);
    const nftOwnerRepo = new repositories.NftOwner(connection);

    await nftRepo.getByUid(nftUid, userId);

    const nftId: number = nftRepo.getId();
    const tokenId: number = nftRepo.getTokenId();
    const nftStatus: string = nftRepo.getStatus();
    const nftUserId: number = nftRepo.getNftUserId();
    const smartContractId: number = nftRepo.getSmartContractId();
    const nftTitle: string = nftRepo.getTitle();

    let nftOwnership = null;
    if (isValid(nftUserId) === true) {
      nftOwnership = await nftOwnerRepo.getByNftId(nftId, userId);
      const nftEditionsOwned: number = nftOwnerRepo.getEditionsOwned(nftOwnership);

      if (nftEditionsOwned < 1 || editionsToTransfer > nftEditionsOwned) {
        throw new CommonError(NftOwnershipNotFoundException)
      }
    }

    if (nftStatus !== LIVE_LOCKED) {
      throw new CommonError(TransferNftNotLiveException);
    }

    const mfaTransactionRepo = new repositories.MfaTransaction(connection);


    transaction = await connection.sequelize.transaction();


    const walletFromDynamo = await getUserWallet(userId);
    const { privateKey } = walletFromDynamo;
    const { tokenProtocol, smartContractAddress, smartContractAbi } = await getSmartContractInfoByContractId(connection, smartContractId);

    const walletHelper = new blockchain.WalletHelper(PROVIDER, privateKey);
    if(walletHelper.walletAddress === destinationWalletAddress){
      throw new CommonError(SameNftDestinationAddressException)
    }
    const mfaTransaction = await mfaTransactionRepo.verifyCodes(transactionUid, emailCode, phoneCode, MfaTransactionAction.SEND_NFT);
    await mfaTransactionRepo.setVerifiedAt(mfaTransaction, transaction);
    const transactionResponse = await walletHelper.transferNft(smartContractAddress, smartContractAbi, destinationWalletAddress, tokenId, tokenProtocol, editionsToTransfer);
    if (isValid(nftUserId) === true && isValid(nftOwnership) === true) {
      await nftOwnerRepo.decrementEditionsOwned(nftOwnership, editionsToTransfer, transaction);
    }
    const responseData = {
      transactionHash: transactionResponse.hash,
      url: `${NETWORK_URL}tx/${transactionResponse.hash}`,
    };

    response = successResponse('NFT Transfered', responseData);
    await transaction.commit();

    const userUid = getUserUid(context);
    const pubnubNotification = { title: NftSentNotification.title, message: `${NftSentNotification.message} ${nftTitle}`}
    await sendPubNubNotification(userUid, pubnubNotification);

  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
    if (transaction) {
      await transaction.rollback();
    }
  }
  return response;
};

/**
 * Request validation schema
 */
export const validationSchema = () => {
  const regexCode = getOtpCodeRegex();
  return {
    body: {
      transactionUid: Vandium.types.string().trim().guid({ version: 'uuidv4' }).required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transfer_nft')),
      emailCode: Vandium.types.string().trim().regex(regexCode).required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transfer_nft')),
      phoneCode: Vandium.types.string().trim().regex(regexCode).required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transfer_nft')),
      to: Vandium.types.string().trim().custom(helpers.joi.customValidationEthAddress)
        .required()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transfer_nft')),
      editions: Vandium.types.number().min(1).positive()
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transfer_nft')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
