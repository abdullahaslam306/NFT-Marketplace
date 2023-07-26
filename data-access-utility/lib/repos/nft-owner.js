/**
 * Class to access and manage nft owner info
 */
const { Op } = require('sequelize');
const { errors, helpers, CommonError } = require('backend-utility');

const { NftOwnershipNotFoundException } = errors.codes;
const { isValid, isValidArray, isValidErrorCode } = helpers.functions;

class NftOwner {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.nftOwner = null;
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
   * @returns
   */
  async upsert(nftId, walletAddress, editionsOwned, userId = null, editionToSell = null, transaction = null, throwError = true, errorCode = null) {
    let updatedNftOwner;
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftOwnershipNotFoundException;
    const nftOwner = await this.getByNftId(nftId, null, walletAddress, false);

    if (isValid(nftOwner) === true) {
      updatedNftOwner = await this.incrementEditionsOwned(nftOwner, editionsOwned, transaction);
    } else {
      const ownershipData = {
        nft_id: nftId,
        wallet_address: walletAddress,
        editions_owned: editionsOwned,
      };

      if (isValid(editionToSell) === true) {
        ownershipData.edition_to_sell = editionToSell;
      }

      if (isValid(userId) === true) {
        ownershipData.user_id = userId;
      }

      updatedNftOwner = await this.dbInstance.nft_owner.upsert(ownershipData, { transaction });
    }

    if (isValid(updatedNftOwner) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return nftOwner;
  }

  /**
   * Get nft ownership for given  given user or wallet
   * @param {Number} nftId
   * @param {Number} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByNftId(nftId, userId = null, walletAddress = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftOwnershipNotFoundException;

    const where = {
      nft_id: nftId,
    };

    if (isValid(userId) === true) {
      where.user_id = userId;
    }

    if (isValid(walletAddress) === true) {
      where.wallet_address = walletAddress;
    }

    this.nftOwner = await this.dbInstance.nft_owner.findOne({ where });

    if (!(this.nftOwner instanceof this.dbInstance.nft_owner) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nftOwner;
  }

  /**
   * Get all nft ownership for given criteria
   * @param {Number} userId
   * @param {Array | Number} walletId
   * @param {Boolean} checkEditionsOwned
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getAllByCriteria(userId, walletId = null, checkEditionsOwned = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftOwnershipNotFoundException;

    const where = {
      user_id: userId,
    };

    if (isValidArray(walletId) === true || (Array.isArray(walletId) === false && isValid(walletId) === true)) {
      where.wallet_id = walletId;
    }

    if (checkEditionsOwned === true) {
      where.editions_owned = {
        [Op.gt]: 0,
      };
    }
    const nftOwners = await this.dbInstance.nft_owner.findAll({ where });

    if (isValidArray(nftOwners) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return nftOwners;
  }

  /**
   * Update nft owner info based on given criteria
   * @param {Number} nftId
   * @param {Number} userId
   * @param {String} walletAddress
   * @param {number} editionsOwned
   * @param {number} editionsToSell
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async update(nftId, userId = null, walletAddress = null, editionsOwned = null, editionsToSell = null, transaction = null, throwError = null, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftOwnershipNotFoundException;
    const where = {
      nft_id: nftId,
      ...(isValid(userId) && { user_id: userId }),
      ...(isValid(walletAddress) && { wallet_address: walletAddress }),
    };
    const nftData = {
      ...(isValid(editionsOwned) && { editions_owned: editionsOwned }),
      ...(isValid(editionsToSell) && { editions_to_sell: editionsToSell }),
    };
    this.nftOwner = await this.dbInstance.nft_owner.update(nftData, { where }, { transaction });

    if (isValid(this.nftOwner) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nftOwner;
  }

  /**
   * [BLOCKCHAIN SYNC] Update NFTs editions_owned to 0
   * @param {Number} editionsOwned
   * @param {Number} userId
   * @param {Number} walletId
   * @param {Array} nftIds
   * @param {Boolean} skipNotOwned
   * @param {Object} transaction
   */
  async updateEditionsOwnedByCriteria(editionsOwned, userId, walletId, nftIds = [], skipNotOwned = true, transaction = null) {
    const nftData = {
      ...(isValid(editionsOwned) && { editions_owned: editionsOwned }),
    };

    const where = {
      user_id: userId,
      wallet_id: walletId,
      ...(nftIds.length > 0 && {
        nft_id: {
          [Op.notIn]: nftIds,
        },
      }),
      ...(skipNotOwned === true && {
        editions_owned: {
          [Op.gt]: 0,
        },
      }),
    };

    return this.dbInstance.nft_owner.update(nftData, { where }, { transaction });
  }

  /**
   * Decrement the count of editions owned for given nft owner
   * @param {Object} nftOwner
   * @param {Number} editions
   * @param {Object} transaction
   */
  async incrementEditionsOwned(nftOwner, editions, transaction = null) {
    const response = await nftOwner.increment('editions_owned', {
      by: editions,
      transaction,
    });
    return response;
  }

  /**
   * Decrement the count of editions owned for given nft owner
   * @param {Object} nftOwner
   * @param {Number} editions
   * @param {Object} transaction
   */
  async decrementEditionsOwned(nftOwner, editions, transaction = null) {
    const response = await nftOwner.decrement('editions_owned', {
      by: editions,
      transaction,
    });
    return response;
  }

  /**
    * Delete nft owner
    * @param {Number} nftId
    * @param {Object} transaction
    * @returns {Boolean}
    */
  async delete(nftId, transaction = null) {
    const where = {};
    if (isValid(nftId) === true) {
      where.nft_id = nftId;
      await this.dbInstance.nft_owner.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
   * Get total edition owned
   * @param {Object} nftOwner
   * @param {Number} defaultValue
   * @returns {number} Total editions owned
   */
  getEditionsOwned(nftOwner = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = nftOwner instanceof this.dbInstance.nft_owner ? nftOwner : this.nftOwner;
    if (nftInstance instanceof this.dbInstance.nft_owner) {
      value = nftInstance.get('editions_owned', defaultValue);
    }
    return value;
  }

  /**
   * Get nft id
   * @param {Object} nftOwner
   * @param {Number} defaultValue
   * @returns {number} nft id
   */
  getNftId(nftOwner = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = nftOwner instanceof this.dbInstance.nft_owner ? nftOwner : this.nftOwner;
    if (nftInstance instanceof this.dbInstance.nft_owner) {
      value = nftInstance.get('nft_id', defaultValue);
    }
    return value;
  }

  /**
   * Get nft ids from given nfts
   * @param {Array} nftOwners
   * @returns array of nft ids
   */
  getNftIds(nftOwners) {
    let value = [];
    if (isValidArray(nftOwners) === true) {
      value = nftOwners.map((nftOwner) => nftOwner.get('nft_id'));
    }
    return value;
  }

  /**
   * Get user id
   * @param {Object} nftOwner
   * @param {Number} defaultValue
   * @returns {number} user id
   */
  getUserId(nftOwner = null, defaultValue = null) {
    let value = defaultValue;
    const nftInstance = nftOwner instanceof this.dbInstance.nft_owner ? nftOwner : this.nftOwner;
    if (nftInstance instanceof this.dbInstance.nft_owner) {
      value = nftInstance.get('user_id', defaultValue);
    }
    return value;
  }
}

module.exports = NftOwner;
