const Moralis = require('moralis/node');
const { errors } = require('backend-utility');

const { mockDatabase } = require('../../mock');
const { action } = require('../../../handler/smart-contract/import-custom');

const { ImportSmartContractFailureException, SmartContractAlreadyExistsException } = errors.codes;

const createEvent = address => ({
  body: {
    address,
  },
});

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
jest.mock('moralis/node');

describe('Import custom smart contracts api', () => {
  test('Should pass when smart contract already exist exception is thrown', async () => {
    const event = createEvent('0x7be8076f4ea4a4ad08075c2508e481d6c946d12b');
    const context = createContext(2);

    const connection = mockDatabase.openConnection();
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(400);
    expect(result.body).not.toBeUndefined;
    const { response: responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual(SmartContractAlreadyExistsException.code);
    expect(responseMessage).toEqual(SmartContractAlreadyExistsException.message);
  });

  test('Should pass when smart contract failure exception is thrown', async () => {
    const event = createEvent('0x7be8076f4ea4a4ad08075c2508e481d6c946d12d');
    const context = createContext(2);

    const connection = mockDatabase.openConnection();
    Moralis.start.mockReturnValueOnce('mock response');
    Moralis.Web3API.token.getNFTMetadata.mockResolvedValueOnce(null);
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(400);
    expect(result.body).not.toBeUndefined;
    const { response: responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual(ImportSmartContractFailureException.code);
    expect(responseMessage).toEqual(ImportSmartContractFailureException.message);
  });

  test('Should pass when smart contract already exist exception is thrown', async () => {
    const event = createEvent('0x7be8076f4ea4a4ad08075c2508e481d6c946d12d');
    const context = createContext(2);

    const connection = mockDatabase.openConnection();
    Moralis.start.mockReturnValueOnce('mock response');
    Moralis.Web3API.token.getNFTMetadata.mockResolvedValueOnce({
      contract_type: 'mock smart contract type',
      name: 'mocked smart contract name',
    });
    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined;
    expect(result.statusCode).not.toBeUndefined;
    expect(result.statusCode).toEqual(200);
    expect(result.body).not.toBeUndefined;
    const { response: responseMessage, responseCode } = result.body;
    expect(responseCode).toEqual('ImportSmartContract');
    expect(responseMessage).toEqual('Smart contract imported successfully.');
  });
});
