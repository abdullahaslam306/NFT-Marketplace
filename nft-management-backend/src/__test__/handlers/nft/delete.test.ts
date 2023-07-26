import { errors } from 'backend-utility';
const { database } = require('data-access-utility');

import { action } from '../../../handlers/nft/delete';

const { EmptyAttributeException } = errors.codes;

const uid = 'cb484627-f436-48cf-990f-92ca35d86217'

describe('Delete Nft Assets API', () => {
  test('True case', async () => {
    const pathParametersObject = {
      nftUid: 'cb484627-f436-48cf-990f-92ca35d86217'
    }

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;

    event.pathParameters = pathParams;
    const connection = database.openConnection();

    const result = await action(event, context, connection);
    expect(result.statusCode).toEqual(200);
      });
});

describe('Delete Nft Assets API', () => {
  test('Delete NFT that is in LIVE state', async () => {
    const pathParametersObject = {
      nftUid: 'cb484627-f436-48cf-990f-92ca35d86217'
    }

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;

    event.pathParameters = pathParams;
    const connection = database.openConnection();

    const result = await action(event, context, connection);
    expect(result.statusCode).toEqual(400);
      });
});