/**
 * Handler to list countries
 */
 
import { logger } from '../../common/utils/logger';
import { meta, helpers } from 'backend-utility';
import { Country } from 'src/common/types';

const { error: errorResponse, success: successResponse } = helpers.responses;

 /**
  * List of countries handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => {
   context.callbackWaitsForEmptyEventLoop = false;
  let response: any;
  try {
    const countries: Country[] = meta.countries.getAll()
    response = await successResponse('CountryList', countries);
  } catch (exp) {
    logger.error(exp, 'Exception - List of countries API');
    response = await errorResponse(exp);
  }
  return response;
};