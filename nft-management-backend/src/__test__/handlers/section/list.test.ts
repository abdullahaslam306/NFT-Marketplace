import { action } from '../../../handlers/section/list';
import { errors } from 'backend-utility';
import { mockDatabase } from '../../mock';

const { NftNotFoundException } = errors.codes;

describe('Get NFT Section List', () => {
  let connection = ''
  beforeAll(() => {
    connection = mockDatabase.openConnection();
  });

  test('should PASS when we successfuly get NFT sections', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    
    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86216'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;

    const result = await action(event, context, connection);
    console.log(result);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response, responseCode } = result.body;
    const { data } = response;
    expect(data).hasOwnProperty('id');
    expect(data).hasOwnProperty('attributes.title');
    expect(data).hasOwnProperty('attributes.content');
  });  

  test('should PASS when NFT does not exist', async () => {

    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    
    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86218'
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