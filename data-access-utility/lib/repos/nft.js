/**
 * Class to access and manage nfts
 */
const { Op } = require('sequelize');
const {
  CommonError, errors, helpers, configs,
} = require('backend-utility');

const { MAIN } = configs.enums.NftAssetType;
const { NftStatus } = configs.enums;
const { LIVE_LOCKED, LAZY_MINTED } = NftStatus;
const { ORDERBY, pagination } = configs.defaults;
const { CreateNftException, NftNotFoundException, NoNftsFoundException } = errors.codes;
const {
  isUndefined, isValidErrorCode, isValid, isValidObject, isValidArray,
} = helpers.functions;
class Nft {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.nft = null;
  }

  /**
   * Create new nft in draft state
   * @param {Number} userId
   * @param {String} title
   * @param {Number} totalEditions
   * @param {Number} secondarySalesRoyalty
   * @param {Number} smartContractId
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {String} description
   * @param {String} status
   * @param {Number} tokenId
   * @param {Number} blockNumberMinted
   * @returns
   */
  async create(userId, title, totalEditions = null, secondarySalesRoyalty, smartContractId, transaction = null, throwError = true, errorCode = null,
    description = null, status = null, tokenId = null, blockNumberMinted = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftException;
    const nftData = {
      title,
      user_id: userId,
      total_editions: totalEditions,
      smart_contract_id: smartContractId,
      ...(isValid(totalEditions) && { total_editions: totalEditions }),
      ...(isValid(secondarySalesRoyalty) && { secondary_sale_royalty: secondarySalesRoyalty }),
      ...(isValid(description) && { description }),
      ...(isValid(status) && { status }),
      ...(isValid(tokenId) && { token_id: tokenId }),
      ...(isValid(blockNumberMinted) && { block_number_minted: blockNumberMinted }),
    };
    this.nft = await this.dbInstance.nft.create(nftData, { transaction });

    if (isValid(this.nft) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nft;
  }

  /**
   * Get nft by user id and nft uid
   * @param {String} nftUid
   * @param {Number} userId
   * @param {Boolean} includeAsset
   * @param {Boolean} includeCollaborator
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {Boolean} includeOwners
   * @returns
   */
  async getByUid(nftUid, userId = null, includeAsset = false, includeCollaborator = false, includeSmartContracts = false, throwError = true, errorCode = null, includeOwners = true) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftNotFoundException;

    const where = {
      uid: nftUid,
    };

    const nftInclude = [];
    if (includeAsset === true) {
      nftInclude.push({
        model: this.dbInstance.nft_asset,
        include: [
          {
            model: this.dbInstance.asset,
          },
        ],
        required: false,
      });
    }

    if (includeCollaborator === true) {
      nftInclude.push({
        model: this.dbInstance.nft_collaborator,
        required: false,
      });
    }

    if (includeSmartContracts === true) {
      const smartContractInclude = {
        model: this.dbInstance.smart_contracts,
        where: {
          is_active: true,
        },
        include: {
          model: this.dbInstance.smart_contract_abis,
          as: 'smart_contract_abi',
        },
        // required: false,
      };
      nftInclude.push(smartContractInclude);
    }

    if (includeOwners === true) {
      const ownershipInclude = {
        model: this.dbInstance.nft_owner,
        where: {
          ...(isValid(userId) && { user_id: userId }),
          editions_owned: {
            [Op.gt]: 0,
          },
        },
        required: false,
      };
      nftInclude.push(ownershipInclude);
    }

    this.nft = await this.dbInstance.nft.findOne({
      where,
      include: nftInclude,
    }, { benchmark: true });

    if (isValid(this.nft) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nft;
  }

  /**
   * Get nft by Smart Contract Address and Signature ID / Token ID
   * @param {Number} smartContractId
   * @param {Number} signatureId
   * @param {Number} tokenId
   * @param {Boolean} includeAsset
   * @param {Boolean} includeCollaborator
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getByCriteria(smartContractId, signature = null, tokenId = null, includeAsset = false, includeCollaborator = false, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftNotFoundException;

    const where = {
      smart_contract_id: smartContractId,
      ...(isValid(signature) && { signature }),
    };

    const nftInclude = [];

    // TODO: Remove the token id fetching from nft blockchain info
    if (isValid(tokenId) === true) {
      nftInclude.push({
        model: this.dbInstance.nft_blockchain_info,
        where: {
          token_id: tokenId,
        },
        required: true,
      });
    }

    if (includeAsset === true) {
      nftInclude.push({
        model: this.dbInstance.nft_asset,
        include: [
          {
            model: this.dbInstance.asset,
          },
        ],
        required: false,
      });
    }

    if (includeCollaborator === true) {
      nftInclude.push({
        model: this.dbInstance.nft_collaborator,
        required: false,
      });
    }

    this.nft = await this.dbInstance.nft.findOne({
      where,
      include: nftInclude,
    }, { benchmark: true });

    if (isValid(this.nft) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nft;
  }

  /**
   * Get nft by user id
   * @param {Number} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getByUserId(userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftNotFoundException;
    const where = {};
    let nft = null;

    if (isValid(userId) === true) {
      where.user_id = userId;
      nft = await this.dbInstance.nft.findOne({
        where,
      });
    }

    if (isValid(nft) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nft;
  }

  /**
   * Add ownership of nft for given user / wallet
   * @param {Number} nftId
   * @param {String} walletAddress
   * @param {Number} editionsOwned
   * @param {Number} userId
   * @param {Number} editionToSell
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {Number} walletId
   * @returns
   */
  async addOwnership(nftId, walletAddress, editionsOwned, userId = null, editionToSell = 0, transaction = null, throwError = true, errorCode = null, walletId = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftException;

    const ownershipData = {
      nft_id: nftId,
      wallet_address: walletAddress,
      editions_owned: editionsOwned,
      edition_to_sell: editionToSell,
    };

    if (isValid(userId) === true) {
      ownershipData.user_id = userId;
    }

    if (isValid(walletId) === true) {
      ownershipData.wallet_id = walletId;
    }

    const nftOwner = await this.dbInstance.nft_owner.create(ownershipData, { transaction });

    if (isValid(nftOwner) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nftOwner;
  }

  /**
   * A wrapper function over list all by criteria to reduce number of params
   * @param {Number} userId
   * @param {Boolean} includeAssets
   * @param {Boolean} includeOwnership
   * @param {Boolean} includeSmartContracts
   * @param {Array | Number} nftId
   * @param {Array | Number} smartContractId
   * @param {String} status
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns List of nfts which fulfills the given criteria
   */
  async getAllByCriteria(userId, includeAssets = true, includeOwnership = true, includeSmartContracts = true, nftId = null,
    smartContractId = null, status = null, transaction = null, throwError = true, errorCode = null) {
    // eslint-disable-next-line no-console
    console.log(`
        userId: ${includeAssets} |
        includeAssets : ${includeAssets} |
        includeOwnership : ${includeOwnership} |
        includeSmartContracts : ${includeSmartContracts} |
        nftId : ${nftId} |
        smartContractId = ${smartContractId},
        status : ${status} |
        transaction : ${transaction} |
        throwError : ${throwError} |
        errorCode : ${errorCode}`);

    return this.listAllByCriteria(userId, includeAssets, includeOwnership, includeSmartContracts, false, null, null, null,
      nftId, smartContractId, status, transaction, throwError, errorCode);
  }

  /**
   * List all nfts by given criteria
   * @param {Number} userId
   * @param {Boolean} includeAssets
   * @param {Boolean} includeOwnership
   * @param {Boolean} includeSmartContracts
   * @param {Boolean} includeTotalCount
   * @param {Number} offset
   * @param {Number} limit
   * @param {String} orderBy
   * @param {Number | Array} nftId single nft id or an array of ids
   * @param {Number | Array} smartContractId  single smart contract id or an array of smart contract ids
   * @param {String} status
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {String} nftTitle
   * @returns List of nfts which fulfills the given criteria
   */
  async listAllByCriteria(userId, includeAssets = true, includeOwnership = true, includeSmartContracts = true, includeTotalCount = true,
    offset = pagination.offset, limit = pagination.limit, orderBy = ORDERBY.DESC, nftId = null, smartContractId = null, status = null,
    transaction = null, throwError = true, errorCode = null, nftTitle = null, isWalletIncluded = false) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftNotFoundException;
    let nfts = [];
    const nftInclude = [];

    const where = {
      // user_id: userId,
      ...(isValid(status) && { status }),
      ...(isValid(nftTitle) && {
        title: {
          [Op.iLike]: `%${nftTitle}%`,
        },
      }),
    };

    if (isValidArray(nftId) === true || (Array.isArray(nftId) === false && isValid(nftId) === true)) {
      where.id = nftId;
    }

    if (isValidArray(smartContractId) === true || (Array.isArray(smartContractId) === false && isValid(smartContractId) === true)) {
      where.smart_contract_id = smartContractId;
    }

    const order = [
      [
        'created_at',
        isValid(orderBy) ? orderBy : ORDERBY.DESC,
      ],
    ];

    if (includeAssets === true) {
      const assetInclude = {
        model: this.dbInstance.nft_asset,
        include: [
          {
            model: this.dbInstance.asset,
          },
        ],
        required: false,
        where: {
          asset_type: MAIN,
        },
      };
      nftInclude.push(assetInclude);
    }

    if (includeOwnership === true) {
      const ownershipInclude = {
        model: this.dbInstance.nft_owner,
        where: {
          user_id: userId,
          editions_owned: {
            [Op.gt]: 0,
          },
        },
        ...(isWalletIncluded === true && {
          include: [{
            model: this.dbInstance.wallet,
          }],
        }),

      };
      nftInclude.push(ownershipInclude);
    }

    if (includeSmartContracts === true) {
      const smartContractInclude = {
        model: this.dbInstance.smart_contracts,
        where: {
          is_active: true,
        },
        // required: false,
      };
      nftInclude.push(smartContractInclude);
    }

    const nftQueryOptions = {
      where,
      order,
      ...(isValid(limit) && { limit }),
      ...(isValid(offset) && { offset }),
      ...(isValidArray(nftInclude) && { include: nftInclude }),
    };

    if (includeTotalCount === true) {
      nftQueryOptions.distinct = true;
      nfts = await this.dbInstance.nft.findAndCountAll(nftQueryOptions, { transaction, benchmark: true });
    } else {
      nfts = await this.dbInstance.nft.findAll(nftQueryOptions, { transaction, benchmark: true });
    }

    if (((includeTotalCount === false && isValidArray(nfts) === false) || (includeTotalCount === true && (isValidObject(nfts) === false || nfts.count === 0))) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return nfts;
  }

  /**
   * [BLOCKCHAIN SYNC] Get nfts by given query parameters along with user id and wallet id
   * Query parameters is array of objects containing token_id and smart_contract_id
   * Query will be executed using OR between items
   * @param {Array<Records<string, string>>} queryParameters
   * @param {Number} userId
   * @param {Number} walletId
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Boolean} errorCode
   */
  async getByTokenIdAndContractId(queryParameters, userId = null, walletId = null, transaction = null, throwError = true, errorCode = null) {
    // QueryParameters value will be token id and smart contract id. The token Id has to
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NoNftsFoundException;
    let nfts = [];
    const andQuery = [];

    queryParameters.forEach((queryParam) => {
      andQuery.push({
        [Op.and]: [
          { token_id: queryParam.token_id },
          { smart_contract_id: queryParam.smart_contract_id },
        ],
      });
    });

    const where = {
      [Op.or]: andQuery,
    };

    const nftInclude = [];
    if (isValid(userId) === true) {
      nftInclude.push({
        model: this.dbInstance.nft_owner,
        attributes: ['editions_owned', 'wallet_address', 'wallet_id'],
        where: {
          user_id: userId,
          ...(isValid(walletId) && { wallet_id: walletId }),
        },
        required: false,
      });

      nftInclude.push({
        model: this.dbInstance.nft_blockchain_info,
        attributes: ['nft_id', 'token_id', 'contract_address'],
      });
    }

    nfts = await this.dbInstance.nft.findAll({
      where,
      attributes: ['id', 'token_id', 'smart_contract_id', 'block_number_minted'],
      ...(isValidArray(nftInclude) && { include: nftInclude }),
      ...(isValid(transaction) && { transaction }),
    }, {
      benchmark: true,
    });

    if (isValidArray(nfts) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nfts;
  }

  /**
   * Update nft essential information
   * @param {Object} nft
   * @param {String} title
   * @param {Number} totalEditions
   * @param {Number} secondarySaleRoyalty
   * @param {Boolean} hasUnockableContent
   * @param {String} unlockableContent
   * @param {Object} tags
   * @param {Object} properties
   * @param {String} signature
   * @param {Number} smartContractId
   * @param {Object} transaction
   * @returns {Object} Updated nft instance
   */
  async update(
    nft, title = null, description = null, totalEditions = null, secondarySaleRoyalty = null, hasUnlockableContent = null, unlockableContent = null,
    tags = null, properties = null, status = null, signature = null, smartContractId = null, transaction, tokenId = null,
  ) {
    const nftData = {
      ...(isValid(tags) && { tags }),
      ...(isValid(title) && { title }),
      ...(isValid(status) && { status }),
      ...(isValid(signature) && { signature }),
      ...(isValid(properties) && { properties }),
      ...(isValid(description) && { description }),
      ...(isValid(tokenId) && { token_id: tokenId }),
      ...(isValid(totalEditions) && { total_editions: totalEditions }),
      ...(isValid(smartContractId) && { smart_contract_id: smartContractId }),
      ...(isValid(secondarySaleRoyalty) && { secondary_sale_royalty: secondarySaleRoyalty }),
      ...(isValid(hasUnlockableContent) && { has_unlockable_content: hasUnlockableContent }),
    };

    if (isUndefined(unlockableContent) === false) {
      nftData.unlockable_content = unlockableContent;
    }

    if (status === LAZY_MINTED) {
      nftData.lazy_minted_at = new Date().toISOString();
    }

    this.nft = await nft.update(nftData, { transaction });
    return this.nft;
  }

  /**
   * Update nft
   * @param {Number} nftId
   * @param {String} nftStatus
   * @param {Boolean} updateAssociatedTimestamp
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {String} description
   * @param {String} title
   * @param {Number} totalEditions
   * @param {Number} tokenId
   * @param {Number} blockNumberMinted
   * @returns {Object} Updated nft status
   */
  async updateById(nftId, nftStatus, updateAssociatedTimestamp = false, transaction = null, throwError = true, errorCode = null,
    description, title, totalEditions, tokenId = null, blockNumberMinted = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftNotFoundException;
    const nftData = {
      ...(isValid(title) && { title }),
      ...(isValid(description) && { description }),
      ...(isValid(tokenId) && { token_id: tokenId }),
      ...(isValid(nftStatus) && { status: nftStatus }),
      ...(isValid(totalEditions) && { total_editions: totalEditions }),
      ...(isValid(blockNumberMinted) && { block_number_minted: blockNumberMinted }),
    };
    const where = { id: nftId };
    const timestamp = new Date().toISOString();

    if (updateAssociatedTimestamp === true) {
      // eslint-disable-next-line default-case
      switch (nftStatus) {
        case LAZY_MINTED:
          nftData.lazy_minted_at = timestamp;
          break;
        case LIVE_LOCKED:
          nftData.minted_at = timestamp;
          break;
      }
    }

    this.nft = await this.dbInstance.nft.update(nftData, { where }, { transaction });

    if (isValid(this.nft) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nft;
  }

  /**
    * Delete nft
    * @param {Number} nftId
    * @param {Object} transaction
    * @returns {Boolean}
    */
  async delete(nftId, transaction = null) {
    const where = {};
    if (isValid(nftId) === true) {
      where.id = nftId;
      await this.dbInstance.nft.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
   * [BLOCKCHAIN SYNC] update NFT mintedAt date
   * @param {Number} nftId
   * @param {Number} mintedAt
   * @param {Object} transaction
   */
  async updateMintedAt(nftId, mintedAt, transaction = null) {
    const nftData = {
      ...(isValid(mintedAt) && { minted_at: mintedAt }),
    };
    const where = {
      id: nftId,
      minted_at: null,
    };

    return this.dbInstance.nft.update(nftData, { where }, { transaction });
  }

  /**
   * Get uid from nft
   * @param {Object} nft
   * @param {String} defaultValue
   * @returns Nft uid
   */
  getUid(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('uid', defaultValue);
    }
    return value;
  }

  /**
   * Get id from nft
   * @param {Object} nft
   * @param {null} defaultValue
   */
  getId(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('id', defaultValue);
    }
    return value;
  }

  /**
   * Get nft ids from given nfts
   * @param {Array} nfts
   * @returns array of nft ids
   */
  getIds(nfts) {
    let value = [];
    if (isValidArray(nfts) === true) {
      value = nfts.map((nft) => nft.get('id'));
    }
    return value;
  }

  /**
   * Get token_id from nft
   * @param {Object} nft
   * @param {null} defaultValue
   */
  getTokenId(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('token_id', defaultValue);
    }
    return value;
  }

  /**
   * Get block_number_minted from nft
   * @param {Object} nft
   * @param {null} defaultValue
   */
  getBlockNumberMinted(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('block_number_minted', defaultValue);
    }
    return value;
  }

  /**
   * Get block_number_minted from nft
   * @param {Object} nft
   * @param {null} defaultValue
   */
  getSmartContractId(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('smart_contract_id', defaultValue);
    }
    return value;
  }

  /**
   * Get nft status
   * @param {Object} nft
   * @param {String} defaultValue
   * @returns {Boolean} Value of status column in nft
   */
  getStatus(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('status', defaultValue);
    }
    return value;
  }

  /**
   * Get nft signature
   * @param {Object} nft
   * @param {String} defaultValue
   * @returns {Boolean} Value of signature column in nft
  */
  getSignature(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('signature', defaultValue);
    }
    return value;
  }

  /**
 * Get nft description
 * @param {Object} nft
 * @param {String} defaultValue
 * @returns {Boolean} Value of description column in nft
*/
  getDescription(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('description', defaultValue);
    }
    return value;
  }

  /**
 * Get nft title
 * @param {Object} nft
 * @param {String} defaultValue
 * @returns {Boolean} Value of title column in nft
*/
  getTitle(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('title', defaultValue);
    }
    return value;
  }

  /**
* Get nft properties
* @param {Object} nft
* @param {String} defaultValue
* @returns {Boolean} Value of properties column in nft
*/
  getProperties(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('properties', defaultValue);
    }
    return value;
  }

  /**
   * Get nft total edition
   * @param {Object} nft
   * @param {Number} defaultValue
   * @returns {Boolean} Value of status column in nft
   */
  getTotalEditions(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('total_editions', defaultValue);
    }
    return value;
  }

  /**
   * Get value of has_unlockable_content from nft
   * @param {Object} nft
   * @param {null} defaultValue
   * @returns {Boolean} Value of has_unlockable_content column in nft
   */
  getHasUnLockableContent(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('has_unlockable_content', defaultValue);
    }
    return value;
  }

  /**
   * Get nft unlockable content from nft
   * @param {Object} nft
   * @param {null} defaultValue
   * @returns {String} Value of unlockable_content column in nft
   */
  getUnlockableContent(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftObj = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftObj) === true) {
      value = nftObj.get('unlockable_content', defaultValue);
    }
    return value;
  }

  /**
  * Get nft collaborators
  * @param {Object} nft
  * @param {null} defaultValue
  * @returns {Array} Array of nft collaborators
  */
  getNftCollaborators(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('nft_collaborators', defaultValue);
    }
    return value;
  }

  /**
   * Get nft assets from nft
   * @param {Object} nft
   * @param {null} defaultValue
   * @returns {Array} Array of nft assets
   */
  getNftAssets(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('nft_assets', defaultValue);
    }
    return value;
  }

  /**
   * Get nft owners from nft
   * @param {Object} nft
   * @param {null} defaultValue
   * @returns {Array} Array of nft_owners
   */
  getNftOwners(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('nft_owners', defaultValue);
    }
    return value;
  }

  /**
   * Get nft blockchain info
   * @param {Object} nft
   * @param {null} defaultValue
   * @returns {Array} Array of nft_owners
   */
  getNftBlockchainInfo(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('nft_blockchain_info', defaultValue);
    }
    return value;
  }

  /**
  * Get nft userId
  * @param { Object } nft
  * @param { null } defaultValue
  * @returns { Number } nft user Id
  */
  getNftUserId(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('user_id', defaultValue);
    }
    return value;
  }

  /**
   * Get nft smart contracts
   * @param {Object} nft
   * @param {null} defaultValue
   * @returns {Array} Array of smart_contracts
   */
  getNftSmartContracts(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('smart_contract', defaultValue);
    }
    return value;
  }

  /**
  * Get nft smartContractId
  * @param { Object } nft
  * @param { null } defaultValue
  * @returns { Number } nft smart_contract_id
  */
  getNftSmartContractId(nft = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = isValid(nft) === true ? nft : this.nft;
    if (isValid(nftInstance) === true) {
      value = nftInstance.get('smart_contract_id', defaultValue);
    }
    return value;
  }
}

module.exports = Nft;
