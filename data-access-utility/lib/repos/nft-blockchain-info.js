/**
 * Class to access and manage nft blockchain info
 */

const {
  CommonError, configs, errors, helpers,
} = require('backend-utility');

const { isValid, isValidErrorCode } = helpers.functions;
const { BlockChainNetwork, TokenProtocol } = configs.enums;
const { CreateNftBlockChainInfoException, NftBlockChainInfoNotFoundException, UpdateNftBlockChainInfoException } = errors.codes;

class NftBlockchainInfo {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.nft_blockchain_info = null;
  }

  /**
   * Insert the nft blockchain information
   * @param {Number} nftId
   * @param {String} contractAddress
   * @param {Number} tokenId
   * @param {String} tokenProtocol
   * @param {String} ipfsAddress
   * @param {String} network
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {Number} blockNumberMinted
   * @param {String} tokenUri
   * @returns nftBlockchainInfo object
   */
  async create(nftId, contractAddress, tokenId = null, tokenProtocol = TokenProtocol.ERC721, ipfsAddress = null,
    network = BlockChainNetwork.ETHEREUM, setMintDate = false, transaction = null, throwError = true, errorCode = null,
    blockNumberMinted = null, tokenUri = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftBlockChainInfoException;

    const nftBlockchainData = {
      nft_id: nftId,
      ...(isValid(network) && { network }),
      ...(isValid(tokenId) && { token_id: tokenId }),
      ...(isValid(ipfsAddress) && { ipfs_address: ipfsAddress }),
      ...(isValid(tokenProtocol) && { token_protocol: tokenProtocol }),
      ...(isValid(contractAddress) && { contract_address: contractAddress }),
      ...(isValid(blockNumberMinted) && { block_number_minted: blockNumberMinted }),
      ...(isValid(tokenUri) && { token_uri: tokenUri }),
    };

    if (setMintDate === true) {
      nftBlockchainData.minted_at = new Date().toISOString();
    }

    this.nft_blockchain_info = await this.dbInstance.nft_blockchain_info.create(nftBlockchainData, { transaction, benchmark: true });

    if (isValid(this.nft_blockchain_info) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nft_blockchain_info;
  }

  /**
    * Delete nft blockchain info
    * @param {Number} nftId
    * @param {Object} transaction
    * @returns {Boolean}
  */
  async delete(nftId, transaction = null) {
    const where = {};
    if (isValid(nftId) === true) {
      where.nft_id = nftId;
      await this.dbInstance.nft_blockchain_info.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
   * Update the nft blockchain information
   * @param {Object} nftBlockChainInfo
   * @param {String} contractAddress
   * @param {Number} tokenId
   * @param {String} tokenProtocol
   * @param {String} ipfsAddress
   * @param {String} network
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns nftBlockchainInfo object
   */
  async update(nftBlockChainInfo, contractAddress, tokenId = null, tokenProtocol = TokenProtocol.ERC721, ipfsAddress = null,
    network = BlockChainNetwork.ETHEREUM, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UpdateNftBlockChainInfoException;

    const nftBlockchainData = {};

    if (isValid(contractAddress) === true) {
      nftBlockchainData.contract_address = contractAddress;
    }

    if (isValid(tokenId) === true) {
      nftBlockchainData.token_id = tokenId;
    }

    if (isValid(tokenProtocol) === true) {
      nftBlockchainData.token_protocol = tokenProtocol;
    }

    if (isValid(ipfsAddress) === true) {
      nftBlockchainData.ipfs_address = ipfsAddress;
    }

    if (isValid(network) === true) {
      nftBlockchainData.network = network;
    }

    this.nft_blockchain_info = await nftBlockChainInfo.update(nftBlockchainData, { transaction });

    if (isValid(this.nft_blockchain_info) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return this.nft_blockchain_info;
  }

  /**
   * Update the nft blockchain information by nft id
   * @param {Object} nftBlockChainInfo
   * @param {String} contractAddress
   * @param {Number} tokenId
   * @param {String} tokenProtocol
   * @param {String} ipfsAddress
   * @param {String} network
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {String} tokenUri
   * @param {Date} mintedAt
   * @param {Number} blockNumberMinted
   * @returns nftBlockchainInfo object
   */
  async updateByNftId(nftId, contractAddress, tokenId = null, tokenProtocol = TokenProtocol.ERC721, ipfsAddress = null,
    network = BlockChainNetwork.ETHEREUM, transaction = null, throwError = true, errorCode = null, tokenUri = null, mintedAt = null, blockNumberMinted = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UpdateNftBlockChainInfoException;

    const where = {
      nft_id: nftId,
    };

    const nftBlockchainData = {
      ...(isValid(network) && { network }),
      ...(isValid(tokenId) && { token_id: tokenId }),
      ...(isValid(ipfsAddress) && { ipfs_address: ipfsAddress }),
      ...(isValid(tokenProtocol) && { token_protocol: tokenProtocol }),
      ...(isValid(contractAddress) && { contract_address: contractAddress }),
      ...(isValid(tokenUri) && { token_uri: tokenUri }),
      ...(isValid(blockNumberMinted) && { block_number_minted: blockNumberMinted }),
      ...(isValid(mintedAt) && { minted_at: mintedAt }),
    };

    this.nft_blockchain_info = await this.dbInstance.nft_blockchain_info.update(nftBlockchainData, {
      transaction,
      where,
    });

    if (isValid(this.nft_blockchain_info) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return this.nft_blockchain_info;
  }

  /**
   * Get nft blockchain info by given nft id
   * @param {Number} nftId
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getByNftId(nftId, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftBlockChainInfoNotFoundException;
    let nftBlockchainInfo = {};

    const where = {
      nft_id: nftId,
    };

    nftBlockchainInfo = await this.dbInstance.nft_blockchain_info.findOne({
      where,
    }, { transaction });

    if (isValid(nftBlockchainInfo) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nftBlockchainInfo;
  }

  /**
   * Set minted at column timestamp for a given nft id
   * @param {Number} nftId
   * @param {SequelizeTransaction} transaction
   * @param {SequelizeTransaction} mintedAt
   * @param {SequelizeTransaction} checkMintedAt
   */
  async setMintedAtByNftId(nftId, transaction = null, mintedAt = null, checkMintedAt = false) {
    const where = {
      nft_id: nftId,
      ...(checkMintedAt === true && { minted_at: null }),
    };
    const nftBlockchainData = {
      minted_at: isValid(mintedAt) === true ? mintedAt : new Date().toISOString(),
    };

    await this.dbInstance.nft_blockchain_info.update(nftBlockchainData, { where }, { transaction });
  }

  /**
   * Insert or update the nft blockchain information
   * @param {Number} nftId
   * @param {String} contractAddress
   * @param {Number} tokenId
   * @param {String} tokenProtocol
   * @param {String} ipfsAddress
   * @param {String} network
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns nftBlockchainInfo object
   */
  async upsertNftBlockChainInfo(
    nftId,
    contractAddress,
    tokenId = null,
    tokenProtocol = TokenProtocol.ERC721,
    ipfsAddress = null,
    network = BlockChainNetwork.ETHEREUM,
    transaction = null,
    throwError = true,
    errorCode = null,
    blockNumberMinted = null,
    tokenUri = null,
  ) {
    const blockchainInfo = {
      nft_id: nftId,
      ...(isValid(network) && { network }),
      ...(isValid(tokenId) && { token_id: tokenId }),
      ...(isValid(ipfsAddress) && { ipfs_address: ipfsAddress }),
      ...(isValid(tokenProtocol) && { token_protocol: tokenProtocol }),
      ...(isValid(contractAddress) && { contract_address: contractAddress }),
      ...(isValid(blockNumberMinted) && { block_number_minted: blockNumberMinted }),
      ...(isValid(tokenUri) && { token_uri: tokenUri }),
    };

    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftBlockChainInfoNotFoundException;

    const nftBlockChainInfo = await this.getByNftId(nftId, transaction, false);

    if (nftBlockChainInfo instanceof this.dbInstance.nft_blockchain_info) {
      const where = { nft_id: nftId };
      this.nft_blockchain_info = await this.dbInstance.nft_blockchain_info.update(blockchainInfo, {
        where,
        transaction,
      });
    } else {
      this.nft_blockchain_info = await this.dbInstance.nft_blockchain_info.create(blockchainInfo, { transaction });
    }

    if (isValid(this.nft_blockchain_info) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return this.nft_blockchain_info;
  }
}

module.exports = NftBlockchainInfo;
