/**
 * Class to access and manage assets
 */
const { Op } = require('sequelize');
const {
  CommonError, errors, helpers, configs,
} = require('backend-utility');

const { ORDERBY } = configs.defaults;
const { AssetStatus } = configs.enums;
const { isValid, isValidErrorCode, isValidArray } = helpers.functions;
const { CreateAssetException, AssetsNotFoundException, AssetsUserNftException } = errors.codes;

class Asset {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Create new asset
   * @param {String} userId
   * @param {String} name
   * @param {String} type
   * @param {String} extension
   * @param {Number} size
   * @param {String} bucketName
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {String} originalPath
   * @param {String} thumbnailPath
   * @param {String} status
   */
  async create(userId, name = null, type = null, extension = null, size = null, bucketName = null, transaction = null, throwError = true, errorCode = null,
    originalPath = null, thumbnailPath = null, status = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateAssetException;
    const asset = await this.dbInstance.asset.create({
      user_id: userId,
      ...(isValid(name) && { name }),
      ...(isValid(type) && { type }),
      ...(isValid(size) && { size }),
      ...(isValid(status) && { status }),
      ...(isValid(bucketName) && { bucket_name: bucketName }),
      ...(isValid(extension) && { file_extension: extension }),
      ...(isValid(originalPath) && { original_path: originalPath }),
      ...(isValid(thumbnailPath) && { thumbnail_path: thumbnailPath }),
    }, { transaction });

    if (!(asset instanceof this.dbInstance.asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return asset;
  }

  /**
  * Get asset by id
  * @param {String} assetId
  * @param {Boolean} throwError
  * @param {Object} errorCode
  * @returns Asset object if successful
  */
  async getById(assetId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : AssetsNotFoundException;
    const where = {
      id: assetId,
    };

    const asset = await this.dbInstance.asset.findOne({
      where,
    });

    if (!(asset instanceof this.dbInstance.asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return asset;
  }

  /**
   * Get asset by uid and user id
   * @param {String} uid
   * @param {Number} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns Asset object if successful
   */
  async getByUid(uid, userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : AssetsNotFoundException;
    const where = {
      uid,
      user_id: userId,
    };

    const asset = await this.dbInstance.asset.findOne({
      where,
    });

    if (!(asset instanceof this.dbInstance.asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return asset;
  }

  /**
   * Get asset by uid and userid
   * @param {String} uid
   * @param {Number} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns Asset object if successful
   */
  async getByUids(uids, userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : AssetsUserNftException;
    const where = {
      uid: uids,
      user_id: userId,
    };

    const assets = await this.dbInstance.asset.findAll({
      where,
    });

    if (assets.length !== uids.length && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return assets;
  }

  /**
    * Get Assets
    * @param {Number} userId
    * @param {Number} offset
    * @param {Number} limit
    * @param {String} type
    * @param {String} name
    * @param {String} orderBy
    * @param {Boolean} throwError
    * @param {Object} errorCode
    */
  async getByCriteria(userId, offset, limit, type = null, name = null, orderBy = ORDERBY.ASC, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : AssetsNotFoundException;
    const order = [['updated_at', orderBy]];

    const where = {
      user_id: userId,
      status: AssetStatus.PROCESSED,
      ...(isValid(type) && { type }),
      ...(isValid(name) && { name: { [Op.iLike]: `%${name}%` } }),
    };
    const assets = await this.dbInstance.asset.findAll({
      where,
      order,
      offset,
      limit,
    });
    if ((isValidArray(assets) === false || assets.length < 1) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return assets;
  }

  /**
   * Update asset info
   * @param {Object} asset
   * @param {String} name
   * @param {String} originalPath
   * @param {String} thumbnailPath
   * @param {String} status
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns updated asset
   */
  async update(asset, name = null, originalPath = null, thumbnailPath = null, status = null, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateAssetException;
    let assetData = {};

    if (isValid(name) === true) {
      assetData.name = name;
    }

    if (isValid(status) === true) {
      assetData.status = status;
    }

    if (isValid(originalPath) === true) {
      assetData.original_path = originalPath;
    }

    if (isValid(thumbnailPath) === true) {
      assetData.thumbnail_path = thumbnailPath;
    }

    assetData = (Object.keys(assetData).length > 0) ? assetData : [];
    const updatedAsset = await asset.update(assetData, { transaction });

    if (!(asset instanceof this.dbInstance.asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return updatedAsset;
  }

  /**
   * Delete Asset
   * @param {Object} asset
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns Delete asset
   */
  async delete(asset, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateAssetException;

    if (!(asset instanceof this.dbInstance.asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    await asset.destroy({ transaction });
    return true;
  }

  /**
   * Create new copy of asset
   * @param {Object} asset
   * @param {boolean} throwError
   * @param {Object} transaction
   * @param {Object} errorCode
   * @returns
   */
  async copy(asset, bucketName, isUserIdNull = false, transaction = null, throwError = true, errorCode = null) {
    let userId = null;
    if (isUserIdNull === false) {
      userId = this.getUserId(asset);
    }
    const name = this.getName(asset);
    const type = this.getType(asset);
    const size = this.getSize(asset);
    const fileExtension = this.getFileExtension(asset);
    const newAsset = await this.create(userId, name, type, fileExtension, size, bucketName, transaction, throwError, errorCode);
    return newAsset;
  }

  /**
   * Get asset by user id
   * @param {Number} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns Asset object if successful
   */
  async getByUserId(userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : AssetsNotFoundException;
    const where = {
      user_id: userId,
    };

    const asset = await this.dbInstance.asset.findOne({
      where,
    });

    if (!(asset instanceof this.dbInstance.asset) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return asset;
  }

  /**
   * Get bucket name from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getBucketName(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('bucket_name', defaultValue);
    }
    return value;
  }

  /**
   * Get original path from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getOriginalPath(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('original_path', defaultValue);
    }
    return value;
  }

  /**
   * Get thumbnail path from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getThumbnailPath(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('thumbnail_path', defaultValue);
    }
    return value;
  }

  /**
   * Get status for asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getStatus(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('status', defaultValue);
    }
    return value;
  }

  /**
   * Get Id from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getId(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('id', defaultValue);
    }
    return value;
  }

  /**
   * Get type from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getType(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('type', defaultValue);
    }
    return value;
  }

  /**
   * Get uid from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getUid(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('uid', defaultValue);
    }
    return value;
  }

  /**
   * Get name from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getName(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('name', defaultValue);
    }
    return value;
  }

  /**
   * Get userId from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getUserId(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('user_id', defaultValue);
    }
    return value;
  }

  /**
   * Get file extenstion from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getFileExtension(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('file_extension', defaultValue);
    }
    return value;
  }

  /**
   * Get size from asset
   * @param {Object} asset
   * @param {Number} defaultValue
   */
  getSize(asset, defaultValue = null) {
    let value = defaultValue;
    if (asset instanceof this.dbInstance.asset) {
      value = asset.get('size', defaultValue);
    }
    return value;
  }
}

module.exports = Asset;
