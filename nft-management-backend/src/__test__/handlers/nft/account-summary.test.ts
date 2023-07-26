import { mockDatabase } from '../../mock';
import { action } from '../../../handlers/analytics/summary';

describe('Update Nft Assets API tests', () => {
  test('Should pass when nft not found exception is thrown', async () => {

    const context = {} as AWSLambda.Context;
    const connection = mockDatabase.openConnection();

    const result = await action(context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response:responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('AccountSummary');
    expect(responseMessage.data).not.toBeUndefined;
    expect(responseMessage).hasOwnProperty('totalWallets')
    expect(responseMessage).hasOwnProperty('totalContracts')
    expect(responseMessage).hasOwnProperty('nftOwned')
    expect(responseMessage).hasOwnProperty('totalRecords')
    expect(responseMessage).hasOwnProperty('data')
  });

})