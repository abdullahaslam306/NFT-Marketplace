
import  { helpers } from 'backend-utility';
const { database } = require('data-access-utility');
import { action as createAssetHandler, validationSchema as createAssetValidationSchema } from './asset/create';
import { action as updateAssetHandler, validationSchema as updateAssetValidationSchema } from './asset/update';
import { action as listAssetsHandler, validationSchema as listAssetsValidationSchema } from './asset/list';
import { action as deleteAssetHandler, validationSchema as deleteAssetValidationSchema } from './asset/delete';

let dbConnection = {};

/**
 * Assets handler
 */
export const assetsHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(listAssetsValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => listAssetsHandler(event, context, dbConnection))
  .POST(createAssetValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => createAssetHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

  /**
 * Asset handler
 */
export const assetHandle: AWSLambda.Handler = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .PATCH(updateAssetValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => updateAssetHandler(event, context, dbConnection))
  .DELETE(deleteAssetValidationSchema(), (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) => deleteAssetHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));
