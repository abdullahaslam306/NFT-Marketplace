
import { configs, helpers } from 'backend-utility';
import { logger } from '../../utils/logger';
import {
  NftTransformedMetaDataType,
  MoralisNftsApiResponseResult,
} from '../../types';
const { isValidObject, generateFunctionalUrl } = helpers.functions;
const { NftStatus, TokenProtocol, BlockChainNetwork } = configs.enums;
const { LIVE_LOCKED } = NftStatus;
const { ETHEREUM } = BlockChainNetwork;

/**
 * Class to transform NFT data
 */
export default class NftApiDataParser {

/**
 * 
 * @param smartContactId 
 * @param nftObject 
 * @returns an object having transformed nft object and txHistoryIds
 */
  async transform(smartContactId: number, nftObject: MoralisNftsApiResponseResult) {
    let transformedNft = {};

    try { 
      const tokenId = nftObject.token_id;
      const contractType = nftObject.contract_type;
      const contractId = smartContactId;
      const transformMetadata = this.transformMetaData(nftObject.metadata);
      const totalEditions = TokenProtocol[contractType] === TokenProtocol.ERC721 ? 1 : null;
      transformedNft = {
        tokenId,
        nftId: null,
        totalEditions,
        network: ETHEREUM,
        status: LIVE_LOCKED,
        ...transformMetadata,
        ipfsHash: nftObject.token_uri,            
        editionsOwned: nftObject.amount,
        contractSymbol: nftObject.symbol,
        smartContractId: contractId,
        protocol: TokenProtocol[contractType],
        blockNumberMinted: nftObject.block_number_minted,
        tokenUri: generateFunctionalUrl(nftObject.token_uri),
      }
    } catch (exp) {
      logger.error(exp);
    }
    return transformedNft;
  }
  
  /**
   * Generates a meatdata object from Metadata string field.
   * @param nftMetaData 
   * @returns returns object of NFT metadata
   */
  private transformMetaData(nftMetaData: string): NftTransformedMetaDataType {
    let response = {
      title: '',
      description: '',
      externalLink: '',
      imageURL: '',
      animationUrl: ''
    };
    try {
      const parsedMeta = JSON.parse(nftMetaData);
      if (isValidObject(parsedMeta) === true) {
        response.title = parsedMeta?.name,
        response.description = parsedMeta?.description,
        response.externalLink = parsedMeta?.external_url || null,
        response.imageURL = parsedMeta?.image,
        response.animationUrl = parsedMeta?.animation_url || null
      }
    }
    catch (err) {
      logger.error(err);
    }
    return response;
  }
}