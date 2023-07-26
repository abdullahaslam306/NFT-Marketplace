/**
 * Class to access and manage nft assets
 */

const { CommonError, errors, helpers } = require('backend-utility');

const { isValid, isValidArray, isValidErrorCode } = helpers.functions;
const { NftAssetNotFoundException, CreateNftAssetException } = errors.codes;

class NftAsset {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Get Nft Asset by asset id
   * @param {Integer} assetId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getByAssetId(assetId, throwError = false, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftAssetNotFoundException;
    const where = {};
    let nftAsset = {};

    if (isValid(assetId) === true) {
      where.asset_id = assetId;
      nftAsset = await this.dbInstance.nft_asset.findOne({
        where,
      });
    }

    if (!(nftAsset instanceof this.dbInstance.nft_asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nftAsset;
  }

  /**
   * Get Nft Asset by NFT id
   * @param {Integer} assetId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getByNftId(NftId, assetType, throwError = false, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftAssetNotFoundException;
    const where = {};
    let nftAsset = {};

    if (isValid(NftId) === true) {
      where.nft_id = NftId;
      where.asset_type = assetType;
      nftAsset = await this.dbInstance.nft_asset.findOne({
        where,
      });
    }

    if (!(nftAsset instanceof this.dbInstance.nft_asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nftAsset;
  }

  /**
   * Get nft asset by criteria
   * @param {Integer} assetId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getAllByCriteria(nftIds, assetType, includeAsset = false, includeNft = false, throwError = false, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftAssetNotFoundException;
    const where = {
      nft_id: nftIds,
      asset_type: assetType,
    };

    const include = [];

    if (includeAsset === true) {
      const assetInclude = {
        model: this.dbInstance.asset,
        required: false,
      };
      include.push(assetInclude);
    }

    if (includeNft === true) {
      const nftInclude = {
        model: this.dbInstance.nft,
        required: true,
      };
      include.push(nftInclude);
    }

    const nftAsset = await this.dbInstance.nft_asset.findAll({
      where,
      ...(isValidArray(include) && { include }),
    });

    if (isValidArray(nftAsset) === true && nftAsset.length !== nftIds.length && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nftAsset;
  }

  /**
   * Create nft asset
   * @param {Integer} nftId
   * @param {Integer} assetId
   * @param {String} assetType
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns {nftAsset}
   */
  async create(nftId, assetId, assetType, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftAssetException;
    const nftAsset = await this.dbInstance.nft_asset.create({
      nft_id: nftId,
      asset_id: assetId,
      asset_type: assetType,
    }, { transaction });

    if (!(nftAsset instanceof this.dbInstance.nft_asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nftAsset;
  }

  /**
    * Associate assets in bulk with an nft
    * @param {Number} nftId
    * @param {Array of nftAssets Uids} referencedAssetUids
    * @param {Array of nftAssets} assets
    * @param {Boolean} throwError
    * @param {Object} errorCode
    * @returns {nftAsset}
    */
  async associateAssets(nftId, referencedAssetUids, assets, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftAssetException;
    const nftAssets = referencedAssetUids.map((asset) => {
      const value = assets.filter((a) => a.dataValues.uid === asset.assetUid);
      return {
        asset_id: value[0].dataValues.id,
        nft_id: nftId,
        asset_type: asset.assetType,
      };
    });
    const nftAssetsBulk = await this.dbInstance.nft_asset.bulkCreate(nftAssets, { transaction });
    if (isValidArray(nftAssetsBulk) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
  }

  /**
    * Delete nft asset
    * @param {Number} nftId
    * @param {Object} transaction
    * @returns {Boolean}
    */
  async delete(nftId, transaction = null) {
    const where = {};
    if (isValid(nftId) === true) {
      where.nft_id = nftId;
      await this.dbInstance.nft_asset.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
 * Create associations of nft with their assets
 * @param {Array} nftAssets
 * @param {Object} transaction
 * @param {Boolean} throwError
 * @param {Object} errorCode
 */
  async createAssociations(nftId, nftAssets, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftAssetException;
    const nftAssetAssociation = [];

    nftAssets.forEach((asset) => {
      nftAssetAssociation.push({
        nft_id: nftId,
        asset_id: asset.id,
        asset_type: asset.type,
      });
    });
    const nftAsset = await this.dbInstance.nft_asset.bulkCreate(nftAssetAssociation, { transaction });
    if (isValidArray(nftAsset) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
  }

  /**
   * Get asset for given nft asset association
   * @param {Object} nftAsset
   * @param {Object} defaultValue
   * @returns
   */
  getAsset(nftAsset = null, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftAsset) === true) {
      value = nftAsset.get('asset', defaultValue);
    }
    return value;
  }

  /**
   * Get nfts for given nft_asset
   * @param {Object} nftAsset
   * @param {Object} defaultValue
   * @returns
   */
  getNfts(nftAsset = null, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftAsset) === true) {
      value = nftAsset.get('nft', defaultValue);
    }
    return value;
  }

  /**
  * Get asset id for given nft asset association
  * @param {Object} nftAsset
  * @param {number} defaultValue
  * @returns
  */
  getAssetId(nftAsset = null, defaultValue = null) {
    let value = defaultValue;
    if (nftAsset instanceof this.dbInstance.nft_asset) {
      value = nftAsset.get('asset_id', defaultValue);
    }
    return value;
  }

  /**
   * Get asset type for given nft asset association
   * @param {Object} nftAsset
   * @param {string} defaultValue
   * @returns
   */
  getAssetType(nftAsset = null, defaultValue = null) {
    let value = defaultValue;
    if (nftAsset instanceof this.dbInstance.nft_asset) {
      value = nftAsset.get('asset_type', defaultValue);
    }
    return value;
  }

  /**
   * Get asset type for given nft asset association
   * @param {Object} nftAsset
   * @param {string} defaultValue
   * @returns
   */
  getNftId(nftAsset = null, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftAsset) === true) {
      value = nftAsset.get('nft_id', defaultValue);
    }
    return value;
  }
}

module.exports = NftAsset;
