/**
 * Handler to list currencies
 */

import { helpers, meta } from 'backend-utility';

import { Currency } from '../../common/types';
import { logger } from '../../common/utils/logger';

const { error: errorResponse, success: successResponse } = helpers.responses;
 
/**
  * List of currencies handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response: any;

  try {  
    const currencies: Currency[] = meta.currencies.getAll();
    response = await successResponse('Currencies', currencies);
  } catch (exp) {
    logger.error(exp, 'Exception - List of currencies API');
    response = await errorResponse(exp);
  }
  return response;
};