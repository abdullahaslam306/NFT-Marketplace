/**
 * Handler to list countries
 */

import * as Vandium  from 'vandium';
import { CommonError, errors, helpers, meta } from 'backend-utility';

import { logger } from '../../common/utils/logger';
import { Country, State } from '../../common/types';
import { validationMessages } from '../../common/validation-code';

const { isValid, isValidArray } = helpers.functions;
const { error: errorResponse, success: successResponse } = helpers.responses;
const { CountryNotFoundException, StatesNotFoundException } = errors.codes;
 
/**
  * List of states by country handler
  * @param {AWSLambda.APIGatewayEvent} event
  * @param {AWSLambda.Context} context
  */
export const action = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => {
   context.callbackWaitsForEmptyEventLoop = false;
  let response: any;

  try {
    const { code } = event.pathParameters;
    const country: Country[] = meta.countries.getByCode(code);

    if( isValid(country) !== true ){
      throw new CommonError(CountryNotFoundException)
    }

    const states: State[] = meta.states.getByCountryCode(code);

    if( isValidArray(states) !== true || states.length <= 0 ){
      throw new CommonError(StatesNotFoundException)
    }

    response = await successResponse('States', states);
  } catch (exp) {
    logger.error(exp, 'Exception - List of states by country API');
    response = await errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
export function validationSchema () {
  return {
    pathParameters: {
      code: Vandium.types.string().min(3).max(3).required()
        .allow('USA', 'CAD')
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'meta-info')),
    }
  }
}