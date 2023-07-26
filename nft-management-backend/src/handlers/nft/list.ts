/**
 * Handler to get paginated nfts
 */

import { uuid } from 'uuidv4';
import * as Vandium from 'vandium';
import { Serializer } from 'jsonapi-serializer';
import { repositories } from 'data-access-utility';
import { configs, errors, helpers } from 'backend-utility';

import { logger } from '../../common/utils/logger';
import validationMessages from '../../common/validation-code/en';
import { filterNftsByWallet } from '../../common/utils/function';

const { functions, responses } = helpers;
const { getUserId, isValidArray, isValid } = functions;
const { ORDERBY, pagination } = configs.defaults;
const { SmartContractUnavailableException } = errors.codes;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Get paginated nfts handler
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context, connection) => {
  // eslint-disable-next-line no-useless-escape 
  context.callbackWaitsForEmptyEventLoop = false;

  let response: any;

  try {
    let contractIds: Array<number> = [];
    const userId: number = getUserId(context);

    logger.info('Event', event);

    const nftTitle = event?.queryStringParameters?.title || null;
    const walletUids = event?.queryStringParameters?.walletUids || [];
    const orderBy = event?.queryStringParameters?.orderBy || ORDERBY.DESC
    const limit = event?.queryStringParameters?.limit || pagination.limit;
    const offset = event?.queryStringParameters?.offset || pagination.offset;
    const smartContractUids = event?.queryStringParameters?.smartContractUids || [];

    const nftRepo = new repositories.Nft(connection);
    const smartContractRepo = new repositories.SmartContract(connection);

    const { nftIds } = await filterNftsByWallet(userId, walletUids, connection);

    const smartContractError = isValidArray(smartContractUids) === true ? SmartContractUnavailableException : null;
    const smartContracts = await smartContractRepo.getAllByCriteria(userId, smartContractUids, null, null, true, true, smartContractError);
    contractIds = smartContractRepo.getIds(smartContracts);

    const nftData: Record<string, any> = await nftRepo.listAllByCriteria(userId, true, true, true, true, offset, limit, orderBy, nftIds, contractIds, null, null, true, null, nftTitle, true);
    const { count: nftTotalCount, rows: nfts } = nftData;

    const parsedNftData: Array<Record<string, any>> = parseNftData(nfts, nftRepo);

    response = await successResponse('NftList', serialize(parsedNftData, nftTotalCount, offset, limit));

  } catch (exp) {
    logger.error(exp);
    response = await errorResponse(exp);
  }
  return response;
};

/**
* Serialize nfts response
* @param {Array} data
* @param {Number} totalRecords
* @param {Number} offset
* @param {Number} limit
*/
const serialize = (data: Array<Record<string, any>>, totalRecords: number, offset: number, limit: number) => {
  
  const serializerSchema = ({
    meta: {
      offset,
      limit: (offset === -1) ? null : limit,
      totalRecords,
    },
    id: 'uid',
    attributes: [
      'title',
      'assets',
      'owners',
      'status',
      'createdAt',
      'minted_at',
      'updatedAt',
      'lazy_minted_at',
      'total_editions',
      'smart_contract',
    ],
    assets: {
      ref: 'uid',
      attributes: [
        'type',
        'asset_type',
        'bucket_name',
        'original_path',
        'thumbnail_path',
      ],
    },
    owners: {
      ref: 'uid',
      attributes: [
        'editions_owned',
        'editions_to_sell',
        'walletType'
        
      ],
    },
    smart_contract: {
      ref: 'uid',
      attributes: [
        'platform_name',
        'platform_logo',
      ],
    },
  
    keyForAttribute: 'camelCase',
  });

  return new Serializer('Nfts', serializerSchema).serialize(data);
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
    title: Vandium.types.string().min(1)
      .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'nft-info')),
  },
});

/**
 * Parse nft data to fetch and include assets and owners
 * @param {Array} nftData 
 * @param {Object} nftRepo 
 */
const parseNftData = (nftData: Array<Record<string, any>>, nftRepo: Record<string, any>) => {
  const data: Array<Record<string, any>> = nftData;
  data.forEach(nft => {
    const nftAssets: Array<Record<string, unknown>> = nftRepo.getNftAssets(nft);
    const assets: Array<Record<string, any>> = nftAssets.map(nftAsset => {
      const updatedAssets = nftAsset.asset;
      if (isValid(updatedAssets)) {
        updatedAssets['asset_type'] = nftAsset.asset_type;
      }
      return updatedAssets;
    });

    const nftOwners: Array<Record<string, unknown>> = nftRepo.getNftOwners(nft);
    let wallet;
    const owners: Array<Record<string, any>> = nftOwners.map(nftOwner => {
      nftOwner['uid'] = uuid();
      wallet = nftOwner.wallet;
      nftOwner['walletType'] = wallet.wallet_type;    
      return nftOwner;
    });

    nft['owners'] = owners;
    nft['assets'] = assets;
  });

  return data;
}
