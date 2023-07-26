/**
 * Class to access and manage wallets
 */

const {
  CommonError, errors, helpers, configs,
} = require('backend-utility');

const { isValid, isValidArray, isValidErrorCode } = helpers.functions;
const { CreateWalletException, WalletNotFoundException, WalletUpdateException } = errors.codes;

const { WalletStatus, WalletTypes } = configs.enums;
const { BLOCOMMERCE, EXTERNAL } = WalletTypes;
const { CONNECTED } = WalletStatus;

class Wallet {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Add wallet
   * @param {String} userId
   * @param {String} address
   * @param {String} name
   * @param {String} walletType
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns wallet
   */
  async add(userId, address, name, walletType = EXTERNAL, transaction = null, throwError = true, errorCode = null) {
    return this.create(userId, address, name, walletType, transaction, throwError, errorCode);
  }

  /**
   * Create wallet
   * @param {String} userId
   * @param {String} address
   * @param {String} name
   * @param {String} walletType
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns wallet
   */
  async create(userId, address, name, walletType = BLOCOMMERCE, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateWalletException;
    const walletInfo = {
      user_id: userId,
      wallet_type: walletType,
      address,
    };

    if (isValid(name) === true) {
      walletInfo.name = name;
    }

    const wallet = await this.dbInstance.wallet.create(walletInfo, { transaction });

    if (!(wallet instanceof this.dbInstance.wallet) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return wallet;
  }

  /**
   * Update wallet information
   * @param {Wallet} wallet
   * @param {String} publicKey
   * @param {String} name
   * @param {String} status
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns updated wallet
   */
  async update(wallet, name = null, status = null, publicKey = null, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : WalletUpdateException;
    const walletData = {};
    if (!(wallet instanceof this.dbInstance.wallet) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    if (isValid(publicKey) === true) {
      walletData.public_key = publicKey;
    }
    if (isValid(name) === true) {
      walletData.name = name;
    }
    if (isValid(status) === true) {
      walletData.status = status;
    }
    const updatedWallet = await wallet.update(walletData, { transaction });
    return updatedWallet;
  }

  /**
   * Get user total wallets
   * @param {String} userId
   * @returns total wallets
   */
  async getTotalUserWallets(userId, walletType = null) {
    const where = {
      user_id: userId,
    };

    if (isValid(userId) === true) {
      where.wallet_type = walletType;
    }

    const totalWallets = await this.dbInstance.wallet.count({
      where,
    });
    return totalWallets;
  }

  /**
   * Get wallet for given user id
   * @param {String} userId
   * @param {String} network
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {String} walletType
   * @param {String} status
   */
  async getByUserId(userId, network, throwError = true, errorCode = null, walletType = null, status = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : WalletNotFoundException;

    const where = {
      network,
      user_id: userId,
      ...(isValid(status) && { status }),
      ...(isValid(walletType) && { wallet_type: walletType }),
    };

    const wallet = await this.dbInstance.wallet.findOne({
      where,
    });

    if (isValid(wallet) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return wallet;
  }

  /**
   * Get wallet info for given address
   * @param {String} address
   * @param {String} network
   * @param {String} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByAddress(address, network, userId = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : WalletNotFoundException;
    const where = {
      address,
      network,
    };

    if (isValid(userId) === true) {
      where.user_id = userId;
    }

    const wallet = await this.dbInstance.wallet.findOne({
      where,
    });
    if (!(wallet instanceof this.dbInstance.wallet) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return wallet;
  }

  /**
   * Get address for given wallet
   * @param {Object} wallet
   * @param {String} defaultValue
   */
  getAddress(wallet, defaultValue = null) {
    let value = defaultValue;
    if (isValid(wallet) === true) {
      value = wallet.get('address', defaultValue);
    }
    return value;
  }

  /**
   * Get wallets list by criteria
   * @param {String} userId
   * @param {Array | String} uid
   * @param {String} status
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getAllByCriteria(userId = null, uid = null, status = CONNECTED, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : WalletNotFoundException;
    const where = {
      ...(isValid(status) && { status }),
      ...(isValid(userId) && { user_id: userId }),
    };

    if (isValidArray(uid) === true || (Array.isArray(uid) === false && isValid(uid) === true)) {
      where.uid = uid;
    }

    const wallets = await this.dbInstance.wallet.findAll({
      where,
    });

    if ((isValidArray(wallets) === false
      || (isValidArray(uid) === true && isValidArray(wallets) === true && uid.length !== wallets.length)
    ) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return wallets;
  }

  /**
   * Get wallets list
   * @param {String} userId
   * @param {String} walletStatus
   */
  async getlistByUserId(userId, walletStatus = null) {
    const where = {
      user_id: userId,
    };

    if (isValid(walletStatus) === true) {
      where.status = walletStatus;
    }

    const wallets = await this.dbInstance.wallet.findAll({
      where,
    });
    return wallets;
  }

  /**
   * Get associated user id for given wallet
   * @param {Object} wallet
   * @param {String} defaultValue
   */
  getUserId(wallet, defaultValue = null) {
    let value = defaultValue;
    if (wallet instanceof this.dbInstance.wallet) {
      value = wallet.get('user_id', defaultValue);
    }
    return value;
  }

  /**
   * Get wallet for given uid
   * @param {String} uid
   * @param {String} userId
   * @param {Object} errorCode
   * @param {Boolean} throwError
   */
  async getByUid(uid, userId = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : WalletNotFoundException;
    const where = {
      uid,
    };

    if (isValid(userId) === true) {
      where.user_id = userId;
    }

    const wallet = await this.dbInstance.wallet.findOne({
      where,
    });
    if (!(wallet instanceof this.dbInstance.wallet) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return wallet;
  }

  /**
   * Get id from given wallet
   * @param {Object} wallet
   * @param {String} defaultValue
   * @returns
   */
  getId(wallet, defaultValue = null) {
    let walletId;
    if (wallet instanceof this.dbInstance.wallet) {
      walletId = wallet.get('id', defaultValue);
    }
    return walletId;
  }

  /**
   * Get status from given wallet
   * @param {Object} wallet
   * @param {String} defaultValue
   * @returns
   */
  getStatus(wallet, defaultValue = null) {
    let walletStatus;
    if (wallet instanceof this.dbInstance.wallet) {
      walletStatus = wallet.get('status', defaultValue);
    }
    return walletStatus;
  }

  /**
   * Get smart contract ids from given smart contracts
   * @param {Array} wallets
   * @returns array of ids
   */
  getIds(wallets) {
    let value = [];
    if (isValidArray(wallets) === true) {
      value = wallets.map((wallet) => wallet.get('id'));
    }
    return value;
  }

  /**
   * Get smart contract address from given smart contracts
   * @param {Array} wallet
   * @returns
   */
  getAddresses(wallets) {
    let value = [];
    if (isValidArray(wallets) === true) {
      value = wallets.map((wallet) => wallet.get('address'));
    }
    return value;
  }
}

module.exports = Wallet;
