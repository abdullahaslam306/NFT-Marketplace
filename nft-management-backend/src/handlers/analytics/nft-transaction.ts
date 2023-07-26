/**
 * Handler to get paginated nft portfolio transactions
 */
import * as Vandium from 'vandium';
import { Serializer } from 'jsonapi-serializer';
import { repositories } from 'data-access-utility';
import { configs, errors, helpers } from 'backend-utility';

import { logger } from '../../common/utils/logger';
import validationMessages from '../../common/validation-code/en';

const { functions, responses } = helpers;
const { getUserId, isValid } = functions;
const { ORDERBY, pagination } = configs.defaults;
const { WalletStatus, NftAssetType } = configs.enums;
const { WalletUnavailableException, SmartContractUnavailableException } = errors.codes;

const { MAIN } = NftAssetType
const { error: errorResponse, success: successResponse } = responses;

/**
 * Get paginated nft portfolio transactions handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let response: any;
  try {

    const endDate: string = event?.queryStringParameters?.endDate;
    const startDate: string = event?.queryStringParameters?.startDate;
    const walletUids = event?.queryStringParameters?.walletUids || [];
    const limit: number = event?.queryStringParameters?.limit || pagination.limit;
    const orderBy: string = event?.queryStringParameters?.orderBy || ORDERBY.DESC;
    const smartContractUids = event?.queryStringParameters?.smartContractUids || [];
    const offset: number = event?.queryStringParameters?.offset || pagination.offset;

    const userId: number = await getUserId(context);

    const walletRepo = new repositories.Wallet(connection);
    const smartContractRepo = new repositories.SmartContract(connection);
    const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);

    const wallets = await walletRepo.getAllByCriteria(userId, walletUids, WalletStatus.CONNECTED, true, WalletUnavailableException);
    const walletAddresses = walletRepo.getAddresses(wallets);

    const smartContracts = await smartContractRepo.getAllByCriteria(userId, smartContractUids, null, null, true, true, SmartContractUnavailableException);
    const smartContractAddresses = smartContractRepo.getAddresses(smartContracts);

    const { count: nftTransactionTotalCount, rows: nftTransactionData } = await nftTransactionHistoryRepo.listAllByCriteria(null, smartContractAddresses, walletAddresses, true, startDate, endDate, offset, limit, orderBy);
    const nftIds = nftTransactionHistoryRepo.getIds(nftTransactionData);
    logger.info('NFT Ids', nftIds);

    const transformedTransactionData = await prepareTransactionData(nftTransactionData, nftIds, smartContracts, connection);
    response = await successResponse('NftTransactionHistory', serialize(nftTransactionTotalCount, transformedTransactionData, offset, limit));

  } catch (exp) {
    logger.error(exp);
    response = await errorResponse(exp);
  }
  return response;
};

/**
 * Prepare nft transaction data
 * @param nftTransactions 
 * @param nftIds 
 * @param smartContracts 
 * @param connection 
 * @returns 
 */
const prepareTransactionData = async (nftTransactions, nftIds, smartContracts, connection) => {
  // smart contract convert 

  logger.info('Preparing transaction data');

  const nftTransactionHistoryRepo = new repositories.NftTransactionHistory(connection);
  const nftRepo = new repositories.Nft(connection);
  const transactionHistory = [];
  logger.info('Mapping contract details');
  const transformedSmartContractData = transformSmartContracts(smartContracts);
  logger.info('Mapping asset details');
  const transformedAssets = await getTransformedNftAssets(nftIds, connection);
  nftTransactions.forEach(nftTransaction => {
    const id = nftTransactionHistoryRepo.getId(nftTransaction);
    const price = nftTransactionHistoryRepo.getPrice(nftTransaction);
    const eventName = nftTransactionHistoryRepo.getEvent(nftTransaction);
    const eventTime = nftTransactionHistoryRepo.getEventTime(nftTransaction);
    const etherscanLink = nftTransactionHistoryRepo.getEtherscanLink(nftTransaction);

    const toAddress = nftTransactionHistoryRepo.getToWalletAddress(nftTransaction);
    const fromAddress = nftTransactionHistoryRepo.getFromWalletAddress(nftTransaction);
    const editions = nftTransactionHistoryRepo.getEditions(nftTransaction);
    const contractAddress = nftTransactionHistoryRepo.getContractAddress(nftTransaction);
    const nftId = nftTransactionHistoryRepo.getNftId(nftTransaction);
    const platformName = transformedSmartContractData[contractAddress.toLowerCase()];
    const nft = nftTransactionHistoryRepo.getNft(nftTransaction);
    const nftTitle = nftRepo.getTitle(nft);
    let thumbnailPath = null;
    let bucketName = null;

    const assetDetails = transformedAssets[nftId];

    if (isValid(assetDetails) === true && isValid(assetDetails.thumbnailPath) === true) {
      thumbnailPath = assetDetails.thumbnailPath;
    }

    if (isValid(assetDetails) === true && isValid(assetDetails.bucketName) === true) {
      bucketName = assetDetails.bucketName;
    }

    const transactionData = makeSingleTransactionData(id, nftTitle, contractAddress, bucketName, thumbnailPath, platformName, toAddress, fromAddress, eventName, editions, price, etherscanLink, eventTime);
    transactionHistory.push(transactionData);
  });
  return transactionHistory;
}

/**
 * Generates nft transaction object from values given
 * @param id 
 * @param nftTitle 
 * @param contractAddress 
 * @param bucketName 
 * @param thumbnailPath 
 * @param platformName 
 * @param toAddress 
 * @param fromAddress 
 * @param eventName 
 * @param editions 
 * @returns 
 */
const makeSingleTransactionData = (id, nftTitle, contractAddress, bucketName, thumbnailPath, platformName, toAddress, fromAddress, eventName, editions, price, etherscanLink, eventTime) => {
  return {
    id,
    nft_title: nftTitle,
    price,
    contract_address: contractAddress,
    bucket_name: bucketName,
    thumbnail_path: thumbnailPath,
    platform_name: platformName,
    to_address: toAddress,
    from_address: fromAddress,
    event_name: eventName,
    event_time: eventTime,
    etherscan_link: etherscanLink,
    editions
  };
}

/**
 * Generate mapping of smart contract address to platform name
 * @param smartContracts 
 * @param keyAsAttribute 
 * @param keyAsValue 
 * @returns 
 */
const transformSmartContracts = (smartContracts, keyAsAttribute = 'address', keyAsValue = 'platform_name') => {
  const transformedData = {};
  smartContracts.map(smartContract => {
    const attribute = smartContract.get(keyAsAttribute, null);
    const value = smartContract.get(keyAsValue, '');
    if (isValid(attribute) === true) {
      transformedData[attribute.toLowerCase()] = value;
    }
  })
  return transformedData;
}

/**
 * Generate mapping of assets against nfts provided
 * @param nftIds 
 * @param connection 
 * @returns 
 */
const getTransformedNftAssets = async (nftIds, connection) => {

  const assetRepo = new repositories.Asset(connection);
  const nftAssetRepo = new repositories.NftAsset(connection);
  const nftAssets = await nftAssetRepo.getAllByCriteria(nftIds, MAIN, true);
  const assetData = {};
  nftAssets.map(item => {
    const nftId = nftAssetRepo.getNftId(item);
    const asset = nftAssetRepo.getAsset(item);
    const bucketName = assetRepo.getBucketName(asset);
    const thumbnailPath = assetRepo.getThumbnailPath(asset);
    if (isValid(nftId) === true) {
      assetData[nftId] = {
        bucketName,
        thumbnailPath,
      };
    }
  })
  return assetData;
}

/**
 * Serialize nft transaction response
 * @param totalRecords 
 * @param data 
 * @param offset 
 * @param limit 
 * @returns 
 */
const serialize = (totalRecords: number, data, offset: number, limit: number) => {

  const serializerSchema = ({
    meta: {
      offset,
      limit: (offset === -1) ? null : limit,
      totalRecords,
    },
    attributes: [
      'id',
      'nft_title',
      'price',
      'contract_address',
      'bucket_name',
      'thumbnail_path',
      'platform_name',
      'to_address',
      'from_address',
      'event_name',
      'event_time',
      'etherscan_link',
      'editions',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('NftTransactionHistory', serializerSchema).serialize(data);
}

/**
 * Request validation schema
 */
export const validationSchema = () => ({
  queryStringParameters: {
    offset: Vandium.types.number().integer().min(0)
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
    limit: Vandium.types.number().integer().min(1)
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
    orderBy: Vandium.types.string().uppercase()
      .allow(ORDERBY.ASC, ORDERBY.DESC)
      .only()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft_info')),
    walletUids: Vandium.types.string().trim()
      .custom(helpers.joi.customValidationCommaSeparatedUids)
      .optional()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
    smartContractUids: Vandium.types.string().trim()
      .custom(helpers.joi.customValidationCommaSeparatedUids)
      .optional()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft')),
    startDate: Vandium.types.date()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transactions_stats')),
    endDate: Vandium.types.date()
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'transactions_stats')),
  },
});
