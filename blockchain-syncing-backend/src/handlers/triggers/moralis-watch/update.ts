/**
 * Lambda to update watch address in moralis
 */

import { configs } from 'backend-utility';
import { logger } from '../../../common/utils/logger';
import { MoralisDataAccess } from '../../../common/moralis/database';

const { MoralisWatchType } = configs.enums;
const { MORALIS_APP_ID, MORALIS_SERVER_URL, MORALIS_MASTER_KEY } = process.env;

/**
 * Handler trigger to update moralis to watch wallet address
 * @param {Object} event
 * @param {AWSLambda.Context} context
 */
export const handler = async (event, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const { walletAddress, action } = event.payload;
    const moralis = new MoralisDataAccess(MORALIS_SERVER_URL, MORALIS_APP_ID, MORALIS_MASTER_KEY);

    switch (action) {
      case MoralisWatchType.WATCH:
        logger.info('Setting moralis to watch', walletAddress);
        await moralis.watchWalletAddress(walletAddress);
        break;
      case MoralisWatchType.UNWATCH:
        logger.info('Setting moralis to unwatch', walletAddress);
        await moralis.unWatchWalletAddress(walletAddress);
        break;
      default:
        break;
    }

  } catch (exp) {
    logger.error(exp);
    throw exp;
  }
}
