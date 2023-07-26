/**
 * Class to access and manage KMS Keys
 */

const { Op } = require('sequelize');
const { CommonError, errors, helpers } = require('backend-utility');

const { isValid, isValidErrorCode } = helpers.functions;
const { dataKeysLimit } = helpers.kms;
const { CreateKmsKeysException, KmsKeysNotFoundException } = errors.codes;

class KmsKeys {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   *
   * @param {String} keyId
   * @param {Number} dataKeysCreated
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {Object} transaction
   */
  async upsert(keyId, dataKeysCreated, throwError = true, errorCode = null, transaction = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateKmsKeysException;
    const kmsKeysData = {
      key_id: keyId,
      data_keys_created: dataKeysCreated,
    };

    let kmsKey = await this.getByKeyId(keyId, false);
    if (kmsKey) {
      await kmsKey.update(kmsKeysData, { transaction });
    } else {
      kmsKey = await this.dbInstance.kms_keys.create(kmsKeysData, { transaction });
    }

    if (!(kmsKey instanceof this.dbInstance.kms_keys) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return kmsKey;
  }

  /**
   * Get by key id
   * @param {Number} keyId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getByKeyId(keyId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : KmsKeysNotFoundException;
    const where = {};
    let kmsKey = {};
    if (isValid(keyId)) {
      where.key_id = keyId;
      kmsKey = await this.dbInstance.kms_keys.findOne({
        where,
      });
    }

    if (!(kmsKey instanceof this.dbInstance.kms_keys) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return kmsKey;
  }

  /**
   *
   * Fetch data with less than 50,000 data keys created.
   *
   * @param {Object} throwError
   * @param {Object} errorCode
   * @returns
   */
  async getByCreatedDataKeysCount(throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : KmsKeysNotFoundException;
    const where = {
      'data_keys_created': {
        [Op.lt]: dataKeysLimit,
      },
    };
    let kmsKey = {};

    kmsKey = await this.dbInstance.kms_keys.findOne({
      where,
    });

    if (!(kmsKey instanceof this.dbInstance.kms_keys) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return kmsKey;
  }

  /**
   * Return the count of data keys created
   * @param {Object} kmsKeys
   * @param {Object} defaultValue
   * @returns
   */
  getCreatedDataKeys(kmsKeys, defaultValue = null) {
    let value = defaultValue;
    if (kmsKeys instanceof this.dbInstance.kms_keys) {
      value = kmsKeys.get('data_keys_created', defaultValue);
    }
    return value;
  }

  /**
   * Returns the ID of the record
   * @param {Object} kmsKeys
   * @param {Object} defaultValue
   * @returns
   */
  getId(kmsKeys, defaultValue = null) {
    let value = defaultValue;
    if (kmsKeys instanceof this.dbInstance.kms_keys) {
      value = kmsKeys.get('id', defaultValue);
    }
    return value;
  }

  /**
   * Get key id for kms key
   * @param {Object} kmsKeys
   * @param {Object} defaultValue
   * @returns
   */
  getKmsKey(kmsKeys, defaultValue = null) {
    let value = defaultValue;
    if (kmsKeys instanceof this.dbInstance.kms_keys) {
      value = kmsKeys.get('key_id', defaultValue);
    }
    return value;
  }
}

module.exports = KmsKeys;
