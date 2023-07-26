/**
 * Class to access and manage users
 */
const { Op } = require('sequelize');
const {
  CommonError, errors, helpers, configs,
} = require('backend-utility');

const { ORDERBY } = configs.defaults;
const { isValid, isValidArray, isValidErrorCode } = helpers.functions;
const { UserNotFoundException, CreateUserException } = errors.codes;

class User {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Create new user
   * @param {String} email
   * @param {String} username
   * @param {Boolean} isMerchant
   * @param {Boolean} isCustomer
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns new user
   */
  async create(email, username, isMerchant = false, isCustomer = false, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateUserException;
    const user = await this.dbInstance.user.create({
      email,
      username,
      is_merchant: isMerchant,
      is_customer: isCustomer,
    }, { transaction });

    if (!(user instanceof this.dbInstance.user) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return user;
  }

  /**
   * Get user by email
   * @param {String} email
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByEmail(email, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UserNotFoundException;
    const where = {};
    let user = {};
    if (isValid(email)) {
      where.email = email;
      user = await this.dbInstance.user.findOne({
        where,
      });
    }

    if (!(user instanceof this.dbInstance.user) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return user;
  }

  /**
   * Get user by id
   * @param {Integer} id
   * @param {Boolean} includeSmartContracts
   * @param {Boolean} orderSmartContract
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns User object if successful
   */
  async getById(id, includeSmartContracts = false, orderSmartContract = false, throwError = true, errorCode = null) {
    let order;
    let user = {};
    const where = {
      ...(isValid(id) && { id }),
    };
    const smartContractInclude = [];
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UserNotFoundException;

    if (includeSmartContracts === true) {
      smartContractInclude.push({
        model: this.dbInstance.smart_contracts,
        where: {
          is_active: true,
        },
        required: true,
      });
    }

    if (orderSmartContract === true) {
      order = [
        [
          this.dbInstance.smart_contracts, 'type', ORDERBY.DESC,
        ],
        [
          this.dbInstance.smart_contracts, 'identity', ORDERBY.ASC,
        ],
        [
          this.dbInstance.smart_contracts, 'created_at', ORDERBY.DESC,
        ],
      ];
    }

    user = await this.dbInstance.user.findOne({
      where,
      ...(isValidArray(smartContractInclude) && { include: smartContractInclude }),
      ...(isValidArray(order) && { order }),
    });

    if ((isValid(user) === false && throwError === true)) {
      throw new CommonError(errorCodeValue);
    }
    return user;
  }

  /**
   * Get user by ids
   * @param {Array} userIds
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns User object if successful
   */
  async getByIds(userIds, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UserNotFoundException;
    const where = {
      id: userIds,
    };

    const users = await this.dbInstance.user.findAll({
      where,
    });

    if (isValidArray(users) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return users;
  }

  /**
   * Get user by username
   * @param {Integer} username
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns User object if successful
   */
  async getByUsername(username, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UserNotFoundException;
    const where = {
      username,
    };

    const user = await this.dbInstance.user.findOne({
      where,
    });

    if (!(user instanceof this.dbInstance.user) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return user;
  }

  /**
   * Get usernames according to the criteria as indicated by exactUsernameMatch
   * @param {String} username
   * @param {Boolean} exactUsernameMatch
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns usernames list if successful
   */
  async getAllByCriteria(username, exactUsernameMatch = true, throwError = true, errorCode = null, limit = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UserNotFoundException;
    let where = {};
    if (isValid(username) === true) {
      where = { username };
      if (exactUsernameMatch === false) {
        where.username = { [Op.startsWith]: username };
      }
    }

    const usernames = await this.dbInstance.user.findAll({
      where,
      ...(isValid(limit) && { limit }),
    });

    if (isValidArray(usernames) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return usernames;
  }

  /**
   * Get users by uids
   * @param {String} uids
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns Asset object if successful
   */
  async getByUids(uids, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : UserNotFoundException;
    const where = {
      uid: uids,
    };

    const users = await this.dbInstance.user.findAll({
      where,
    });

    if (users.length !== uids.length && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return users;
  }

  /**
   * Update User attributes
   * @param {Object} user
   * @param {Object} userData
   * @param {Object} transaction
   */
  async updateUserAttributes(user, userData, transaction = null) {
    return user.update(userData, { transaction });
  }

  /**
   * Update user
   * @param {Object} user
   * @param {Boolean} isMerchant
   * @param {Boolean} isCustomer
   * @param {Object} transaction
   */
  async update(user, isMerchant = null, isCustomer = null, transaction = null) {
    const userData = {};
    if (isValid(isMerchant) === true) {
      userData.is_merchant = isMerchant;
    }
    if (isValid(isCustomer) === true) {
      userData.is_customer = isCustomer;
    }
    const updatedUser = user.update(userData, { transaction });
    return updatedUser;
  }

  /**
   * Updates users phone and its associated properties
   * @param {User} user
   * @param {String} phone
   * @param {Boolean} isPhoneVerified
   * @param {Boolean} mfaEnabled
   * @param {Object} transaction
   * @returns
   */
  async updatePhone(user, phone, isPhoneVerified = null, mfaEnabled = null, transaction = null) {
    const userData = {
      phone,
    };

    if (isValid(isPhoneVerified) === true) {
      userData.phone_verified = isPhoneVerified;
    }

    if (isValid(mfaEnabled) === true) {
      userData.mfa_enabled = mfaEnabled;
    }

    const updatedUser = user.update(userData, { transaction });
    return updatedUser;
  }

  /**
   * Set email verified for user
   * @param {Object} user
   */
  setEmailVerified(user) {
    const userData = {
      email_verified: true,
    };
    const updatedUser = user.update(userData);
    return updatedUser;
  }

  /**
   * Get Id from user
   * @param {Object} user
   * @param {Number} defaultValue
   */
  getId(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('id', defaultValue);
    }
    return value;
  }

  /**
  * Get Uid from user
  * @param {Object} user
  * @param {Number} defaultValue
  */
  getUid(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('uid', defaultValue);
    }
    return value;
  }

  /**
  * Get profile picture path from user
  * @param {Object} user
  * @param {Number} defaultValue
  */
  getPicture(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('picture', defaultValue);
    }
    return value;
  }

  /**
   * Get status from user
   * @param {Object} user
   * @param {String} defaultValue
   */
  getStatus(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('status', defaultValue);
    }
    return value;
  }

  /**
   * Get country from user
   * @param {Object} user
   * @param {String} defaultValue
   */
  getCountry(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('country', defaultValue);
    }
    return value;
  }

  /**
   * Get state from user
   * @param {Object} user
   * @param {String} defaultValue
   */
  getState(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('state', defaultValue);
    }
    return value;
  }

  /**
   * Get email from user
   * @param {Object} user
   * @param {String} defaultValue
   */
  getEmail(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('email', defaultValue);
    }
    return value;
  }

  /**
   * Get username field from user database
   * @param {Object} user
   * @param {String} defaultValue
   */
  getUsername(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('username', defaultValue);
    }
    return value;
  }

  /**
   * Get phone from user
   * @param {Object} user
   * @param {String} defaultValue
   */
  getPhone(user, defaultValue = null) {
    let value = defaultValue;
    if (user instanceof this.dbInstance.user) {
      value = user.get('phone', defaultValue);
    }
    return value;
  }

  /**
   * Get list of smart contracts from object
   * @param {Object} users
   * @param {Object} defaultValue
   * @returns
   */
  getSmartContracts(users, defaultValue = null) {
    let value = defaultValue;
    if (isValid(users) === true) {
      value = users.get('smart_contracts', defaultValue);
    }
    return value;
  }

  /**
   * Get user ids from given users
   * @param {Array} smartContracts
   * @returns array of smart contract ids
   */
  getIds(users) {
    let value = [];
    if (isValidArray(users) === true) {
      value = users.map((user) => user.get('id'));
    }
    return value;
  }
}

module.exports = User;
