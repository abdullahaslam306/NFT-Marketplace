/**
 * Class to access and manage merchants
 */

const { CommonError, errors, helpers } = require('backend-utility');

const { isValid, isValidErrorCode } = helpers.functions;
const { MerchantNotFoundException, CreateMerchantException } = errors.codes;

class Merchant {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Create new merchant
   * @param {Number} userId
   * @param {String} sid
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async create(userId, sid, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateMerchantException;
    const merchant = await this.dbInstance.merchant.create(
      {
        user_id: userId,
        sid,
      },
      { transaction },
    );

    if (!(merchant instanceof this.dbInstance.merchant) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return merchant;
  }

  /**
   * Get merchant by user id
   * @param {Number} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByUserId(userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : MerchantNotFoundException;
    const where = {};
    let merchant = {};

    if (isValid(userId)) {
      where.user_id = userId;
      merchant = await this.dbInstance.merchant.findOne({
        where,
      });
    }

    if (!(merchant instanceof this.dbInstance.merchant) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return merchant;
  }

  /**
   * Get Merchant by SID
   * @param {String} sid
   * @param {Boolean} throwError
   * @param {errors} errorCode
   * @returns merchant object
   */
  async getBySid(sid, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : MerchantNotFoundException;
    let merchant = {};

    const where = {
      sid,
    };

    merchant = await this.dbInstance.merchant.findOne({
      where,
    });

    if (!(merchant instanceof this.dbInstance.merchant) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return merchant;
  }

  /**
   * Get merchant Info
   * @param {Number} userId
   * @param {Boolean} getWallet
   */
  async getMerchantInfo(userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : MerchantNotFoundException;

    const where = {
      user_id: userId,
    };

    const include = [
      {
        model: this.dbInstance.user,
        include: [
          {
            model: this.dbInstance.wallet,
            attributes: ['address', 'network'],
          },
        ],
      },
    ];

    const merchant = await this.dbInstance.merchant.findOne({
      where,
      include,
    });

    if (!(merchant instanceof this.dbInstance.merchant) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return merchant;
  }

  /**
   * Get UserId from merchant
   * @param {Object} merchant
   * @param {Number} defaultValue
   */
  getUserId(merchant, defaultValue = null) {
    let value = defaultValue;
    if (merchant instanceof this.dbInstance.merchant) {
      value = merchant.get('user_id', defaultValue);
    }
    return value;
  }
}

module.exports = Merchant;
