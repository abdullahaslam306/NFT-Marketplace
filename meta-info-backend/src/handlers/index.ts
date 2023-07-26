
import  { helpers } from 'backend-utility';
// const { database } = require('data-access-utility');
import { action as countriesMetaHandler } from './meta/list-countries';
import { action as languagesMetaHandler } from './meta/list-languages';
import { action as currenciesMetaHandler } from './meta/list-currencies';
import { validationSchema, action as countryStatesMetaHandler } from './meta/list-states';

// let dbConnection = {};

/**
 * Countries meta info handler
 */
export const countriesHandle: AWSLambda.Handler = helpers.vandium.init()
//   .before(() => { dbConnection = database.openConnection(); })
  .GET((event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => countriesMetaHandler(event, context))
//   .finally(() => database.closeConnection(dbConnection));

/**
 * States meta info handler
 */
export const countryStatesHandle: AWSLambda.Handler = helpers.vandium.init()
  .GET()
    .validation(validationSchema)
    .handler((event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => countryStatesMetaHandler(event, context))

/**
 * Currencies meta info handler
 */
export const currenciesHandle: AWSLambda.Handler = helpers.vandium.init()
  .GET()
    .handler((event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => currenciesMetaHandler(event, context))

/**
 * Languages meta info handler
 */
export const languagesHandle: AWSLambda.Handler = helpers.vandium.init()
  .GET()
    .handler((event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => languagesMetaHandler(event, context))
