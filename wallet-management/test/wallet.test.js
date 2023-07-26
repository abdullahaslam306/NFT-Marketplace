const createWallet = require('../src/handler/wallet/create-wallet');
const getWalletEthBalance = require('../src/handler/wallet/get-eth-balance');
const updateWalletName = require('../src/handler/wallet/update');
const eventGenerator = require('./testUtils/eventGenerator');

describe('Wallet unit tests', () => {
  test('Should return the wallet address and private key of the wallet', async () => {
    const response = await createWallet.handler();
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(responseBody.message).toBe('Wallet successfully created.');
    expect(responseBody.wallet).not.toBe({});
  });

  test('Should return the user Ether balance from the Ethereum testnet/mainnet', async () => {
    const walletAddress = '0x0e5Df4277388C9e156038Db9f09C390ED2730F2e';
    const event = eventGenerator({
      body: {
        walletAddress,
      },
    });
    const response = await getWalletEthBalance.handler(event);
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(responseBody.address).not.toEqual(null);
    expect(responseBody.Eth).not.toEqual(null);
  });

  test('Should throw an error if the wallet address is not provided', async () => {
    const walletAddress = '0x0e5Df4277388C9e156038Db9f09C390ED2730F2e';
    const event = eventGenerator({
      body: {
        walletAddress: null,
      },
    });
    const response = await getWalletEthBalance.handler(event);
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).toBe(400);
  });
  test('Should return the wallets list of authorized user', async () => {
    const name = 'wallet';
    const uid = '5d8e143b-cef1-4b6b-919d-7341f89b918d';
    const event = eventGenerator({
      body: {
        name,
      },
      pathParameters: {
        uid
      }
    });
    const response = await updateWalletName.handler(event);
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(responseBody.responseCode).toBe('UpdateWallet');
    expect(responseBody.response).not.toBe('Wallet updated successfully.');
  });
});
