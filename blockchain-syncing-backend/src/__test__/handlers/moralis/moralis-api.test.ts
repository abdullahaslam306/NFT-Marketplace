import { MoralisApi }  from '../../../common/moralis/moralis-api';
import MoralisApiConsumer  from '../../mock/repos/moralis-api-consumer';
import { moralisApi } from '../../mock/models';
const { mockData } = moralisApi;
const { walletAddress, contractAddresses } = mockData;

jest.mock('../../../common/moralis/moralis-api');

const mockedMoralisApi = MoralisApi as jest.MockedClass<typeof MoralisApi>;
const mockedMoralisApiConsumer = MoralisApiConsumer as jest.MockedClass<typeof MoralisApiConsumer>;

describe ('Moralis uint tests', () => {

  beforeEach(() => {
    mockedMoralisApi.mockClear();
  });

  it('Should PASS when the moralis-consumer call moralis-api main class', () => {
    const moralisApiConsumer = new MoralisApiConsumer();
    expect(moralisApiConsumer).toBeTruthy();
  });

  it('Should PASS when the funcionality of moralis-consumer class is invoked', () => {
    const moralisApiConsumer = new mockedMoralisApiConsumer();
    expect(mockedMoralisApi).toHaveBeenCalledTimes(1);
  });

  it('Sould PASS when moralis-consumer class the moralis-api function', () => {
    const moralisApiConsumer = new MoralisApiConsumer();
    const result = moralisApiConsumer.nftFetcherByWalletAddress();
    expect(result).not.toBeUndefined;
  });

  it('Should pass when moralis-consumer class call the function of moralis-api and returns appropriate data', () => {
    // Show that mockClear() is working
    expect(mockedMoralisApi).not.toHaveBeenCalled();

    const moralisApiConsumer = new MoralisApiConsumer();
    // Constructor should have been called again

    expect(mockedMoralisApi).toHaveBeenCalledTimes(1);
    moralisApiConsumer.nftFetcherByWalletAddress();

    // mock.instances is available with automatic mocks
    const mockedMoralisApiInstance = mockedMoralisApi.mock.instances[0];

    const mockGetNftsByWalletAddress = mockedMoralisApiInstance.getNftsByWalletAddress(walletAddress, contractAddresses);
    expect(mockGetNftsByWalletAddress).not.toBeUndefined;
  });
});