
import { repositories } from 'data-access-utility';
import { configs, helpers } from 'backend-utility';
// import * as nft_obejcts from '../../__test__/nft-objects.json';

import { logger } from '../../utils/logger';
import {
  NftTransformedDataType,
  NftTransformedMetaDataType,
  MoralisNftsApiResponseResult,
  SqsMessageSmartContractInfoType,
} from '../../types';

const { isValid, isValidArray, isValidObject, generateFunctionalUrl } = helpers.functions;
const { NftStatus, TokenProtocol, BlockChainNetwork } = configs.enums;
const { LIVE_LOCKED } = NftStatus;
const { ETHEREUM } = BlockChainNetwork;

/**
 * Class to transform NFT data
 */
export default class NftApiDataParser {
  connection: any;
  transaction;
  constructor(connection, transaction) {
    this.connection = connection;
    this.transaction = transaction;
  }

  /**
   * Transform nft object from Moralis to a format that can be used by database.
   * @param userId 
   * @param walletId 
   * @param walletAddress 
   * @param contractAddressList 
   * @param nftObjects 
   * @param connection 
   * @returns an array of transformed nft objects.
   */
  async transform(userId: number, walletId: number, walletAddress: string, contractAddressList: Array<SqsMessageSmartContractInfoType>, nftObjects: Array<MoralisNftsApiResponseResult>) {
    try {

      let nfts = [];
      let transformedNfts = [];
      let nftQueryParameters = [];
      const transformedNftData = {};
      const nftRepo = new repositories.Nft(this.connection);
      console.log('------------------------------------------------------------------');
      console.log(nftObjects);
      console.log('------------------------------------------------------------------');

      const transformedContracts = this.transformedContracts(contractAddressList);
      console.log(transformedContracts);
      console.log('------------------------------------------------------------------');
      console.log('------------------------------------------------------------------');


      nftObjects.forEach(nft => {

        const tokenAddress = nft.token_address.toLowerCase();

        const contractExists = Object.prototype.hasOwnProperty.call(transformedContracts, tokenAddress);
        console.log(`NFT TOKEN ADDRESS ${tokenAddress} |  Exists : ${contractExists}`);
        console.log(`CONTRACT ID : ${transformedContracts[tokenAddress]}`);
        if (contractExists === true) {

          const tokenId = nft.token_id;
          const contractType = nft.contract_type;
          const contractId = transformedContracts[tokenAddress];
          const transformMetadata = this.transformMetaData(nft.metadata);
          const totalEditions = TokenProtocol[contractType] === TokenProtocol.ERC721 ? 1 : null;

          const transformedNft: NftTransformedDataType = {
            tokenId,
            nftId: null,
            totalEditions,
            userId: userId,
            network: ETHEREUM,
            walletId: walletId,
            status: LIVE_LOCKED,
            ...transformMetadata,
            nftOwnersExists: false,
            contractName: nft.name,
            ipfsHash: nft.token_uri,            
            editionsOwned: nft.amount,
            contractSymbol: nft.symbol,
            smartContractId: contractId,
            walletAddress: walletAddress,
            nftBlockchainInfoExists: false,
            contractAddress: tokenAddress,
            protocol: TokenProtocol[contractType],
            blockNumberMinted: nft.block_number_minted,
            tokenUri: generateFunctionalUrl(nft.token_uri),
          }
          const key = `${tokenId}_${contractId}`;

          nftQueryParameters[key] = {
            token_id: tokenId,
            smart_contract_id: contractId,
          };

          transformedNftData[key] = transformedNft;

        }
      });
      // db but not in moralis - update editionsOwned 0

      console.log('===================== QUERY PARAMS OBJECT ==================', nftQueryParameters);

      if (Object.keys(nftQueryParameters).length > 0) {

        nftQueryParameters = Object.values(nftQueryParameters);
        console.log('===================== NFT TRANSFORMED DATA ==================', transformedNftData);

        console.log('========== NFT QUERY PARAMS ============', nftQueryParameters);

        nfts = await nftRepo.getByTokenIdAndContractId(nftQueryParameters, userId, walletId, this.transaction, false, null);
      }

      // Array of nft data which will contains nft_exists , nft_owner_exists, nft_blockchain_info
      transformedNfts = this.injectNftDbInfoData(userId, nfts, transformedNftData);

      // transform the result object back to its old structure.
      console.log('===================== TRANSFORMED NFTs ==================', transformedNfts);

      return transformedNfts;

    } catch (exp) {
      logger.error(exp);
    }
  }

  /**
   * Inject nft database schema related information in the transformed nft data
   * @param userId
   * @param nfts
   * @param transformedNftData
   * @returns
   */
  private injectNftDbInfoData(userId: number, nfts, transformedNftData: Record<string, NftTransformedDataType>): Array<NftTransformedDataType> {
    let result = [];
    const nftRepo = new repositories.Nft(this.connection);
    const nftOwnerRepo = new repositories.NftOwner(this.connection);
    const keys = Object.keys(transformedNftData);
    console.log('**************************************************************', keys);

    console.log('****injectNftDbInfoData********* LIST OF NFT ***************************', nfts);

    if (isValidArray(keys) === true) {

      if (isValidArray(nfts) === true) {

        nfts.forEach(nft => {
          const nftId = nftRepo.getId(nft);
          const tokenId = nftRepo.getTokenId(nft);
          const smartContractId = nftRepo.getSmartContractId(nft);
          const searchKey = `${tokenId}_${smartContractId}`;
          if (Object.prototype.hasOwnProperty.call(transformedNftData, searchKey) === true) {

            const nftOwners = nftRepo.getNftOwners(nft);
            const nftBlockchainInfo = nftRepo.getNftBlockchainInfo(nft);

            let nftOwnersExists = false;
            const nftBlockchainInfoExists = isValid(nftBlockchainInfo);
            if (isValidArray(nftOwners) === true) {
              const userNftOwnership = nftOwners.map(nftOwner => nftOwnerRepo.getUserId(nftOwner) === userId);
              nftOwnersExists = isValidArray(userNftOwnership);
              console.log(' USER NFT OWNERSHIP', userNftOwnership);
            }
            console.log(`NFT OWNER EXIST: ${nftOwnersExists} | NFT BLOCKCHAIN INFO EXISTS: ${nftBlockchainInfoExists}`);

            transformedNftData[searchKey].nftId = nftId;
            transformedNftData[searchKey].nftOwnersExists = nftOwnersExists;
            transformedNftData[searchKey].nftBlockchainInfoExists = nftBlockchainInfoExists;
          }

        });
      }
      result = Object.values(transformedNftData);
    }

    return result;
  }

  /**
   * Used to convert data contract address list to a reduced for better searching
   * @param contractAddressList 
   * @returns return object of address's as keys and ID's as Values
   */
  private transformedContracts(contractAddressList: Array<SqsMessageSmartContractInfoType>): Record<string, string> {
    return contractAddressList.reduce((result, ele) => {
      const address = ele.address.toLowerCase();
      result[address] = ele.id;
      return result;
    }, {});
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
        response = {
          title: parsedMeta?.name,
          description: parsedMeta?.description,
          externalLink: parsedMeta?.external_link,
          imageURL: parsedMeta?.image,
          animationUrl: parsedMeta?.animation_url
        }
      }
    }
    catch (err) {
      logger.error(err);
    }
    return response;
  }

}