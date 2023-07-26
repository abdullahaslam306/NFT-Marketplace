const eventGenerator = require('./testUtils/eventGenerator');
const createReservation = require('../src/handler/wallet/refill-eth');

describe('Wyre unit tests', () => {
  test('Should generate a new Wyre widget based on the parameters given', async () => {
    const event = eventGenerator({
      body: {
        'sourceAmount': '50',
        'sourceCurrency': 'GBP',
        'walletAddress': '0x0e5Df4277388C9e156038Db9f09C390ED2730F2e',
        'street1': '1550 Bryant Street',
        'postalCode': '94103',
        'city': 'San Francisco',
        'state': 'CA',
        'country': 'US',
      },
    });
    const response = await createReservation.handler(event);
    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).toBe(200);
    expect(responseBody.url).not.toBe('');
    expect(responseBody.reservation).not.toBe('');
  });
});
