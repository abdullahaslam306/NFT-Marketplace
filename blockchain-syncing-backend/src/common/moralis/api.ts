import axios from 'axios';
import { helpers } from 'backend-utility';

import { logger } from '../utils/logger';
import { MoralisNftsApiResponseResult, MoralisNftsTranfersApiResponseResult } from '../types';

const { functions } = helpers;
const { chunkArray, isValid, isValidArray } = functions;

/**
 * Moralis class
 */
export default class MoralisApiAccess {
  limit: number
  chain: string
  apiKey: string
  baseUrl: string
  tokenIdFormat: string
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Api-Key': null
  };

  /**
   * Moralis api constructor
   * @param baseUrl
   * @param apiKey
   * @param limit
   * @param chain rinkeby | eth
   * @param tokenIdFormat decimal | hex
   */
  constructor(baseUrl: string, apiKey: string, limit: number, chain: string, tokenIdFormat: string) {
    this.limit = limit;
    this.chain = chain;
    this.baseUrl = baseUrl;
    this.tokenIdFormat = tokenIdFormat;
    this.headers['X-Api-Key'] = apiKey;
  }

  //Only for tackling GET http
  private async initializeRequest(endpoint: string, queryStringParams: URLSearchParams = null, wait = false) {
    let response = null;
    try {
      const config = {
        headers: this.headers,
        params: queryStringParams,
      };
      const promise = axios(endpoint, config);
      console.log('Moralis Endpoint', endpoint, config)

      response = wait === true ? await promise : promise;

    } catch (error) {
      logger.error(`Results : ${error}`)
    }

    return response;
  }

  /**
   * Process request for given url and params by including paginated response data
   * @param endpoint 
   * @param params 
   * @returns 
   */
  private async processRequest(endpoint: string, params: URLSearchParams) {
    let offset = 0;
    const allPromises = [];
    let records = [];

    try {
      //Resetting params.offset to 0
      if (params.has('offset') === true) {
        params.set('offset', String(0));
      }

      const url = `${this.baseUrl}${endpoint}`;

      const response = await this.initializeRequest(url, params);
      const { total, result } = response.data;
      records = [...result];
      logger.info(`Results : ${records.length} | Total Count : ${total} | Offset: ${offset} | Limit : ${this.limit} `);
      console.log(records);
      offset = offset + this.limit;

      while (total > offset) {
        params.set('offset', String(offset));
        const promise = this.initializeRequest(url, params);
        if (isValid(promise) === true) {
          allPromises.push(promise);
        }
        offset = offset + this.limit;
      }
    } catch (exp) {
      logger.info(exp);
    }

    logger.info(`PROMISE LENGTH : ${allPromises.length}`);
    if (isValidArray(allPromises) === true) {
      const resolvedPromises = await Promise.all(allPromises);
      for (let i = 0; i < resolvedPromises.length; i++) {
        records = [...records, ...resolvedPromises[i].data.result];
      }
    }

    return records;
  }

  /**
   * Get nfts data for given wallet and contract addresses
   * @param walletAddress
   * @param contractAddresses
   * @returns array of nfts data object returned from moralis
   */
  async getNftsByWalletAddress(walletAddress: string, contractAddresses: Array<string>) {
    let records: Array<MoralisNftsApiResponseResult> = [];
    // Create chuck of 10 contract addresses because of Moralis Api limitation to filter data by only 10 contract address
    const chuckedContractAddresses: Array<Array<string>> = chunkArray(contractAddresses, 10);
    for (const contractAddressChunk of chuckedContractAddresses) {
      const endpoint = `${walletAddress}/nft`;

      const params = new URLSearchParams();
      params.append('offset', '0');
      params.append('chain', this.chain);
      params.append('limit', String(this.limit));
      params.append('format', this.tokenIdFormat);
      contractAddressChunk.forEach(address => params.append('token_addressess', address));

      const response = await this.processRequest(endpoint, params)
      records = [...records, ...response];
    }
    logger.info(`GetNftsByWalletAddress: ${walletAddress} ${records.length}`);

    return records;
  }

  /**
   * Get nfts transfers filterd data for given wallet and contract addresses
   * @param walletAddress
   * @param contractAddresses
   * @returns array of nfts data object returned from moralis
   */
  async getNftTransfersByWalletAddress(walletAddress: string, contractAddresses: Array<string>): Promise<Array<MoralisNftsTranfersApiResponseResult>> {
    let records: Array<MoralisNftsTranfersApiResponseResult> = [];
    const endpoint = `${walletAddress}/nft/transfers`;

    const params = new URLSearchParams();
    params.append('chain', this.chain);
    params.append('offset', String(0));
    params.append('limit', String(this.limit));
    params.append('format', this.tokenIdFormat);

    records = await this.processRequest(endpoint, params);
    records = records.filter(item => contractAddresses.includes(item.token_address));

    return records;
  }


  /**
 * Get nfts meta data
 * @param contractAddress
 * @param tokenId
 * @returns object of nft metadata
 */
  async getNftMetaData(contractAddress: string, tokenId: string): Promise<MoralisNftsApiResponseResult> {
    const endpoint = `${this.baseUrl}nft/${contractAddress}/${tokenId}`;
    const params = new URLSearchParams();
    params.append('chain', this.chain);
    params.append('format', this.tokenIdFormat);
    const nftMetaData = await this.initializeRequest(endpoint, params, true);
    const response = (isValid(nftMetaData) === true && nftMetaData.status === 200) ? nftMetaData.data : null;
    return response;
  }
}
