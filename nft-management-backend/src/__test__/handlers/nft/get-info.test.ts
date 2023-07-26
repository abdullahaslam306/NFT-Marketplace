import { action } from '../../../handlers/nft/get-info';
import { errors } from 'backend-utility';
import { database } from 'data-access-utility';

const { NftNotFoundException } = errors.codes;


describe('GET NFT INFO API', () => {
  const context = {} as AWSLambda.Context;
  const event = {} as AWSLambda.APIGatewayEvent;
  let connection: any;

  beforeAll(() => {
    connection = database.openConnection();
  })

  afterAll(() => {
    database.closeConnection(connection);
  })

  test('Should FAIL if NFT does not exist', async () => {
    const pathParametersObject = {
      uid: 'cb484627-f436-48cf-990f-92ca35d86217'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;
    const result = await action(event, context, connection);
    expect(result).toHaveProperty('statusCode', 404);
    expect(result).toHaveProperty('body.responseCode', NftNotFoundException.code);
  })

  test('Should PASS if NFT exist with assets and collaborators', async () => {
    const pathParametersObject = {
      uid: '298ec4eb-7e9a-449b-b66b-84057897a166'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;
    const result = await action(event, context, connection);
    expect(result).toHaveProperty('statusCode', 200);
    expect(result).toHaveProperty('body.response');
    const { data } = result.body.response;
    expect(data).toHaveProperty('attributes.title');
    expect(data).toHaveProperty('attributes.status');
    expect(data).toHaveProperty('relationships.owner');
    expect(data).toHaveProperty('relationships.assets');
    expect(data).toHaveProperty('attributes.totalEditions');
    expect(data).toHaveProperty('attributes.unlockableContent');
    expect(data).toHaveProperty('relationships.collaborators');
    expect(data).toHaveProperty('attributes.hasUnlockableContent');
  })

  test('Should PASS if only NFT exist without collaborator, owner and assets, ', async () => {
    const pathParametersObject = {
      uid: 'f0a4c558-cf24-485f-a58b-9752a043d2a0'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;
    const result = await action(event, context, connection);
    expect(result).toHaveProperty('statusCode', 200);
    expect(result).toHaveProperty('body.response');
    const { data } = result.body.response;
    expect(data).toHaveProperty('attributes.title');
    expect(data).toHaveProperty('attributes.status');
    expect(data).toHaveProperty('attributes.totalEditions');
    expect(data).toHaveProperty('attributes.unlockableContent');
    expect(data).toHaveProperty('attributes.hasUnlockableContent');
    expect(data).toHaveProperty('relationships.assets.data', []);
    expect(data).toHaveProperty('relationships.owner.data', null);
    expect(data).toHaveProperty('relationships.collaborators.data', []);
  })

})
