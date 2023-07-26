import Moralis from 'moralis/node';
import { helpers } from 'backend-utility';
const { functions } = helpers;
const { isValidArray, isValid } = functions;

/**
 * Moralis class
 */
export class MoralisDataAccess {
  nftOwnerTableName = 'EthNFTOwners';
  nftOwnerOfColumnName = 'owner_of';
  nftOwnerTokenAddressColumnName = 'token_address';
  nftUpdatedAtColumnName = 'updatedAt';
  constructor(serverUrl, appId, masterKey) {
    Moralis.start({ serverUrl, appId, masterKey });
  }

  /**
   * Query nft from moralis based on the given criteria
   * @param walletAddresses 
   * @param smartContractAddresses 
   * @param timestamp 
   */
  async getNfts(walletAddresses, smartContractAddresses, timestamp = null) {
    const query = new Moralis.Query(this.nftOwnerTableName);

    if (isValidArray(walletAddresses)) {
      query.containedIn(this.nftOwnerOfColumnName, walletAddresses);
    }

    if (isValidArray(walletAddresses)) {
      query.containedIn(this.nftOwnerTokenAddressColumnName, smartContractAddresses);
    }

    if (isValid(timestamp)) {
      // if needed convert this timestamp in to approppriate format for moralis
      // moment js 
      query.greaterThan(this.nftUpdatedAtColumnName, timestamp);
    }

    const pipeline = [
      { project: { objectId: 0, block_number: 0 } }
    ];
    return await query.aggregate(pipeline);
  }
}

