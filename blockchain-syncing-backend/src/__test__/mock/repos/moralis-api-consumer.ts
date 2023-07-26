

import { MoralisApi } from '../../../common/moralis/moralis-api';
import { moralisApi } from '../models/';
const { mockData } = moralisApi;
const { walletAddress, contractAddresses, limit, chain, format } = mockData;

export default class MoralisApiConsumer {
    moralisApi : any
    constructor() {
    this.moralisApi = new MoralisApi(limit, chain, format);
  }

  nftFetcherByWalletAddress() {
    this.moralisApi.getNftsByWalletAddress(walletAddress, contractAddresses);
  }
}


