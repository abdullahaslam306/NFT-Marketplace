import { errors } from 'backend-utility';

import { mockDatabase } from '../../mock';
import { action } from '../../../handlers/nft/list';

const { NftNotFoundException, WalletNotFoundException, SmartContractNotFoundException } = errors.codes;

describe('Update Nft Assets API tests', () => {
  test('Should pass when nft not found exception is thrown', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    event['queryStringParameters'] = {
        title: 'Nft Title',
    };
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 2,
        },
      },
    };
    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('NftList');
    expect(responseMessage).hasOwnProperty('meta')
    expect(responseMessage).hasOwnProperty('offset')
    expect(responseMessage).hasOwnProperty('limit')
    expect(responseMessage).hasOwnProperty('totalRecords')
    expect(responseMessage.meta.offset).toEqual(0);
    expect(responseMessage.meta.limit).toEqual(10);
    expect(responseMessage.meta.totalRecords).toEqual(2);
    expect(responseMessage).hasOwnProperty('data')
    expect(responseMessage.data).not.toBeUndefined;
    expect(responseMessage.data).hasOwnProperty('relationships')
    expect(responseMessage.data).hasOwnProperty('relationships.owner')
    expect(responseMessage.data).hasOwnProperty('relationships.assets')
  });

  test('Should pass when wallet not found exception is thrown and no wallet exist against that user', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    event['queryStringParameters'] = {
        title: 'Nft Title',
    };
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 3,
        },
      },
    };
    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(400);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual(WalletNotFoundException.code);
    expect(responseMessage).toEqual(WalletNotFoundException.message);
  });

  test('Should pass when smart contract not found exception is thrown and no smartcontract exist against that user', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    event['queryStringParameters'] = {
        title: 'Nft Title',
    };
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 4,
        },
      },
    };
    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(404);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual(SmartContractNotFoundException.code);
    expect(responseMessage).toEqual(SmartContractNotFoundException.message);
  });
 test('Should pass when filtered with wallet uids', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    event['queryStringParameters'] = {
        walletUids: 'fa75bf1d-8f61-4734-98cb-191bb7db6849\',\'fa75bf1d-8f62-4734-98cb-191bb7db6849',
    };
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 5,
        },
      },
    };
    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('NftList');
    expect(responseMessage).hasOwnProperty('meta')
    expect(responseMessage).hasOwnProperty('offset')
    expect(responseMessage).hasOwnProperty('limit')
    expect(responseMessage).hasOwnProperty('totalRecords')
    expect(responseMessage.meta.offset).toEqual(0);
    expect(responseMessage.meta.limit).toEqual(10);
    expect(responseMessage.meta.totalRecords).toEqual(2);
    expect(responseMessage).hasOwnProperty('data')
    expect(responseMessage.data).not.toBeUndefined;
    expect(responseMessage.data).hasOwnProperty('relationships')
    expect(responseMessage.data).hasOwnProperty('relationships.owner')
    expect(responseMessage.data).hasOwnProperty('relationships.assets')
  });

test('Should pass when filtered with smartContracts uids', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    event['queryStringParameters'] = {
        smartContractUids: 'fa75bf1d-8f61-4734-98cb-191bb7db6849\',\'fa75bf1d-8f62-4734-98cb-191bb7db6849',
    };
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 5,
        },
      },
    };
    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('NftList');
    expect(responseMessage).hasOwnProperty('meta')
    expect(responseMessage).hasOwnProperty('offset')
    expect(responseMessage).hasOwnProperty('limit')
    expect(responseMessage).hasOwnProperty('totalRecords')
    expect(responseMessage.meta.offset).toEqual(0);
    expect(responseMessage.meta.limit).toEqual(10);
    expect(responseMessage.meta.totalRecords).toEqual(2);
    expect(responseMessage).hasOwnProperty('data')
    expect(responseMessage.data).not.toBeUndefined;
    expect(responseMessage.data).hasOwnProperty('relationships')
    expect(responseMessage.data).hasOwnProperty('relationships.owner')
    expect(responseMessage.data).hasOwnProperty('relationships.assets')
  });

  test('Should pass when nft not found exception is thrown', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    event['queryStringParameters'] = {
        smartContractUids: 'fa75bf1d-8f61-4734-98cb-191bb7db6849\',\'fa75bf1d-8f62-4734-98cb-191bb7db6849',
    };
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 6,
        },
      },
    };
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



})