import { errors } from 'backend-utility';

import { lambda } from '../../mock/aws-mock';
import { mockDatabase } from '../../mock';
import { action } from '../../../handlers/nft/update';
import { responses } from '../../mock/responses';


const { lazyMintMockLambdaResponse } = responses.lambda;
const { mockLambdaInvoke } = lambda;
const { NftNotFoundException, NftNotInEditStateException, CannotSetNftUnlockableContentException } = errors.codes;

describe('Update Nft Assets API tests', () => {
  test('Should pass when nft not found exception is thrown', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: null,
        },
      },
    };
  
    event.body = JSON.parse(`{
     "nftUid": "cb484627-f436-48cf-990f-92ca35d86216",
      "title": "New NFT title"
    }`);
    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(404);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual(NftNotFoundException.code);
    expect(responseMessage).toEqual(NftNotFoundException.message);
  });

  test('Should pass when nft is not in edit state and exception is thrown', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {
      requestContext: { 
        authorizer: {
          user_id: '231',
        },
      },
    };
  
    event.body = JSON.parse(`{
      "title": "New NFT title"
    }`);

    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86216',
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(400);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual(NftNotInEditStateException.code);
    expect(responseMessage).toEqual(NftNotInEditStateException.message);
  });



  test('Should pass when cannot set unlockable content exception is thrown', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: '231',
        },
      },
    };
  
    event.body = JSON.parse(`{
      "title": "New NFT title",
      "unlockableContent": true
    }`);

    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86217',
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const connection = mockDatabase.openConnection();
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(400);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual(CannotSetNftUnlockableContentException.code);
    expect(responseMessage).toEqual(CannotSetNftUnlockableContentException.message);
  });
  
  test('Should pass when nft is in draft state and total editions are not changed and updated successfully', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 2,
        },
      },
    };
  
    event.body = JSON.parse(`{
      "title": "New NFT title",
      "totalEditions": 10
    }`);

   const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86217',
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('NFT Updated');
    expect(responseMessage).toEqual('Nft information has been updated successfully.');
  });

 test('Should pass when nft is in draft state and total editions are changed and updated successfully', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {
      requestContext: { 
        authorizer: {
          user_id: 2,
        },
      },
    };
  
    event.body = JSON.parse(`{
      "title": "New NFT title",
      "totalEditions": 11
    }`);

    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86217',
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('NFT Updated');
    expect(responseMessage).toEqual('Nft information has been updated successfully.');
  });


  test('Should pass when nft is in Lazy state and nft updated successfully', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {
      requestContext: { 
        authorizer: {
          user_id: 2,
        },
      },
    };
  
    event.body = JSON.parse(`{
      "title": "New NFT title",
      "totalEditions": 11,
      "status": "lazy"
    }`);

    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86217',
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const connection = mockDatabase.openConnection();
    mockLambdaInvoke(lazyMintMockLambdaResponse);
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('NFT Updated');
    expect(responseMessage).toEqual('Nft information has been updated successfully.');
  });

  test('Should pass when nft status is set to Live and updated successfully', async () => {
    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {requestContext: { 
        authorizer: {
          user_id: 2,
        },
      },
    };
  
    event.body = JSON.parse(`{
      "title": "New NFT title",
      "totalEditions": 10,
      "status": "live",
      "hasUnlockableContent": true
    }`);

    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86218',
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const connection = mockDatabase.openConnection();
    mockLambdaInvoke('response');
      
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('NFT Updated');
    expect(responseMessage).toEqual('Nft information has been updated successfully.');
  });
});