import { action } from '../../../handlers/nft/blockchain-info';
import { errors } from 'backend-utility';
import { database } from 'data-access-utility';

const { NftNotFoundException } = errors.codes;


describe('GET Blockchain INFO API', () => {
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
    const { data } = result.body.response;
    expect(result.statusCode).toEqual(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('attributes.nftId');
    expect(data).toHaveProperty('attributes.network');
    expect(data).toHaveProperty('attributes.tokenId');
    expect(data).toHaveProperty('attributes.tokenProtocol');
    expect(data).toHaveProperty('attributes.contractAddress');
    expect(data).toHaveProperty('attributes.ipfsAddress');
    expect(data).toHaveProperty('attributes.mintedAt');
  })

  test('Should PASS if NFT exist', async () => {
    const pathParametersObject = {
      uid: 'b07232e9-0670-455c-b013-9b328f5ddd45'
    };
    const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;
    event.pathParameters = pathParams;
    const result = await action(event, context, connection);
    expect(result.statusCode).toEqual(404);
    expect(result).toHaveProperty('body.responseCode', NftNotFoundException.code);
    const { data } = result.body.response;
  })
})
