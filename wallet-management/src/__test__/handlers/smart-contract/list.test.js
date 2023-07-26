const { errors } = require('backend-utility');

const { mockDatabase } = require('../../mock');
const { action } = require('../../../handler/smart-contract/list');

const { SmartContractNotFoundException } = errors.codes;

const createContext = userId => (
  {
    event: {
      requestContext: {

        authorizer: {
          user_id: userId,
        },
      },
    },
  }
);

describe('List Users smart contracts', () => {
  test('Should pass when smart contracts are listed successfully', async () => {
    const event = null;
    const context = createContext(2);

    const connection = mockDatabase.openConnection();
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response, responseCode } = result.body;
    expect(responseCode).toEqual('SmartContracts');
    expect(response.data).not.toBeUndefined;
    expect(response.data).not.toBeNull;
  });

  test('Should pass when smart contracts not found exception is thrown', async () => {
    const event = null;
    const context = createContext(3);

    const connection = mockDatabase.openConnection();
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(404);
    expect(result.body).not.toBeUndefined;
    const { response, responseCode } = result.body;
    expect(responseCode).toEqual(SmartContractNotFoundException.code);
    expect(response).toEqual(SmartContractNotFoundException.message);
  });
});
