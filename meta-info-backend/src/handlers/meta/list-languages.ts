/**
 * Handler to list currencies
 */

import { helpers, meta } from 'backend-utility';

import { Language } from '../../common/types';
import { logger } from '../../common/utils/logger';

const { error: errorResponse, success: successResponse } = helpers.responses;
 
/**
  * List of languages handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response: any;

  try {  
    const languages: Language[] = meta.languages.getAll();
    response = await successResponse('Languages', languages);
  } catch (exp) {
    logger.error(exp, 'Exception - List of languages API');
    response = await errorResponse(exp);
  }
  return response;
};