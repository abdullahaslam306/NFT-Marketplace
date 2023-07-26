import { action } from '../../../handlers/section/delete';
import { errors } from 'backend-utility';
import { mockDatabase } from '../../mock';

const { NftSectionDeleteException, NftNotFoundException } = errors.codes;

describe('Delete NFT Section', () => {
  let connection = ''
  beforeAll(() => {
    connection = mockDatabase.openConnection();
  });

  test('should PASS when we are not able to delete NFT section of a LIVE NFT', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    
    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86216',
      sectionUid: '01e22cc1-a319-4861-a4e4-6bac73ae485'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(400);
    expect(result).toHaveProperty('body.responseCode', NftSectionDeleteException.code);
  });  

  test('should PASS when we are able to delete NFT section of a DRAFT NFT', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    
    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86217',
      sectionUid: '01e22cc1-a319-4861-a4e4-6bac73ae485'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
  }); 

  test('should PASS when NFT Does not exist', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    
    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86218',
      sectionUid: '01e22cc1-a319-4861-a4e4-6bac73ae485'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(404);
    expect(result).toHaveProperty('body.responseCode', NftNotFoundException.code);
  }); 
});