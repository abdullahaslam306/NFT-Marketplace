/**
 * Handler to get account summary
 */

import { configs, helpers } from 'backend-utility';
import { Serializer } from 'jsonapi-serializer';
import { repositories } from 'data-access-utility';

import { logger } from '../../common/utils/logger';
import { filterNftsByWallet } from '../../common/utils/function';
import { ApiSuccessResponse, AccountSummaryResponse } from '../../common/types';

const { functions, responses } = helpers;
const { getUserId, isValidArray } = functions;
const { WalletStatus } = configs.enums;
const { error: errorResponse, success: successResponse } = responses;

/**
 * Get account summary handler
 * @param {AWSLambda.Context} context
 * @param {dbconnection} connection
 */
export const action = async (context: AWSLambda.Context, connection) => {
  // eslint-disable-next-line no-useless-escape 
  context.callbackWaitsForEmptyEventLoop = false;
  let response: ApiSuccessResponse;
  try {
    const userId: number = getUserId(context);
    const responseData: AccountSummaryResponse = {
      totalWallets: 0,
      totalContracts: 0,
      nftOwned: 0
    };

    const walletRepo = new repositories.Wallet(connection);
    const smartContractRepo = new repositories.SmartContract(connection);

    const { nftIds } = await filterNftsByWallet(userId, null, connection, false);

    const connectedWallets = await walletRepo.getAllByCriteria(userId, null, WalletStatus.CONNECTED, false);

    const smartContracts = await smartContractRepo.getAllByCriteria(userId, null, null, null, true, false);

    if (isValidArray(connectedWallets) === true) {
      // Connected Wallets Count
      responseData.totalWallets = connectedWallets.length;
    }

    if (isValidArray(smartContracts) === true) {
      // Supported Smart Contracts Count
      responseData.totalContracts = smartContracts.length;
    }

    if (isValidArray(nftIds) === true) {
      // NFT Owned Count
      responseData.nftOwned = nftIds.length;
    }

    response = successResponse('AccountSummary', serialize(responseData));
  } catch (exp) {
    logger.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Serialize account summary response
 * @param {AccountSummaryResponse} data
 */
const serialize = (data: AccountSummaryResponse) => {
  const serializerSchema = ({
    attributes: [
      'totalWallets',
      'totalContracts',
      'nftOwned',
    ],
    keyForAttribute: 'camelCase',
  });

  return new Serializer('AccountSummary', serializerSchema).serialize(data);
}
