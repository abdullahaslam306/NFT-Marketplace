/**
 * Class to manage smart contracts
 */

const { Op } = require('sequelize');
const {
  CommonError, errors, configs, helpers,
} = require('backend-utility');

const { enums, defaults } = configs;
const { SmartContractTypes, SmartContractIdentity } = enums;

const { ORDERBY } = defaults;

const { CUSTOM, PLATFORM } = SmartContractTypes;
const { EXTERNAL, INTERNAL } = SmartContractIdentity;
const { CreateSmartContractException, SmartContractNotFoundException } = errors.codes;

const {
  isValidErrorCode, isValidArray, isValid, isValidObject,
} = helpers.functions;

class SmartContract {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.smartContract = null;
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
  async create(smartContractAddress, platformName = null, tokenProtocol, smartContractType = CUSTOM,
    smartContractIdentity = EXTERNAL, isActive = true, transaction = null, throwError = true, errorCode = null, smart_contract_abi_id = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateSmartContractException;
    const smartContractInfo = {
      address: smartContractAddress,
      platform_name: platformName,
      token_protocol: tokenProtocol,
      type: smartContractType,
      identity: smartContractIdentity,
      is_active: isActive,
      smart_contract_abi_id,
    };

    this.smartContract = await this.dbInstance.smart_contracts.create(smartContractInfo, { transaction });

    if (isValid(this.smartContract) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return this.smartContract;
  }

  /**
   * Update smart contract active by criteria
   * @param {String} type
   * @param {String} identity
   * @param {Boolean} isActive
   */
  async markActiveByCriteria(type = null, identity = null, isActive = true, transaction = null) {
    const where = {};
    const smartContractData = {};
    if (isValid(type) === true) {
      where.type = type;
    }
    if (isValid(identity) === true) {
      where.identity = identity;
    }
    if (isValid(isActive) === true) {
      smartContractData.is_active = isActive;
    }
    this.smartContract = await this.dbInstance.smart_contracts.update(smartContractData, { where }, { transaction });

    return this.smartContract;
  }

  /**
   * Get smart contract by criteria provided
   * @param {String} name
   * @param {String} tokenProtocol
   * @param {String} type
   * @param {String} identity
   * @param {String} isActive
   * @param {Object} throwError
   * @param {Object} errorCode
   * @param {String} address
   * @param {Boolean} isAddressCaseSensitive
   * @param {Number} id
   * @param {Boolean} includeAbi
   */
  async getByCriteria(name, tokenProtocol, type = PLATFORM, identity = INTERNAL, isActive = true, throwError = true, errorCode = null, address = null, isAddressCaseSensitive = false,
    id = null, includeAbi = false) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : SmartContractNotFoundException;
    const where = {
      ...(isValid(type) && { type }),
      ...(isValid(address) && {
        address: isAddressCaseSensitive === false ? address : { [Op.iLike]: `${address}` },
      }),
      ...(isValid(identity) && { identity }),
      ...(isValid(name) && { platform_name: name }),
      ...(isValid(isActive) && { is_active: isActive }),
      ...(isValid(tokenProtocol) && { token_protocol: tokenProtocol }),
      ...(isValid(id) && { id }),
    };
    const include = [];
    if (includeAbi === true) {
      include.push({
        model: this.dbInstance.smart_contract_abis,
        required: true,
        as: 'smart_contract_abi',
      });
    }

    this.smartContract = await this.dbInstance.smart_contracts.findOne({
      where,
      include,
    });

    if (isValid(this.smartContract) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.smartContract;
  }

  /**
   * Get smart contracts by criteria
   * @param {Number} userId
   * @param {String | Array} uid
   * @param {String} type
   * @param {String} identity
   * @param {Boolean} isActive
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @param {Boolean} includeCount
   * @param {Boolean} orderSmartContract
   * @param {Number} offset
   * @param {Number} limit
   * @returns
   */
  async getAllByCriteria(userId = null, uid = null, type = null, identity = null, isActive = true, throwError = true, errorCode = null, includeCount = false,
    orderSmartContract = false, offset = null, limit = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : SmartContractNotFoundException;

    let order;
    let include = null;
    const where = {
      ...(isValid(type) && { type }),
      ...(isValid(identity) && { identity }),
      ...(isValid(isActive) && { is_active: isActive }),
    };

    if (isValidArray(uid) === true || (Array.isArray(uid) === false && isValid(uid) === true)) {
      where.uid = uid;
    }

    if (orderSmartContract === true) {
      order = [
        [
          'type', ORDERBY.DESC,
        ],
        [
          'identity', ORDERBY.ASC,
        ],
        [
          'created_at', ORDERBY.DESC,
        ],
      ];
    }

    if (isValid(userId) === true) {
      include = [
        {
          model: this.dbInstance.user,
          where: {
            id: userId,
          },
          required: true,
        },
      ];
    }

    const smartContractQueryOptions = {
      where,
      include,
      ...(isValidArray(order) && { order }),
      ...(isValid(offset) && { offset }),
      ...(isValid(limit) && { limit }),
    };

    if (includeCount === true) {
      this.smartContract = await this.dbInstance.smart_contracts.findAndCountAll(smartContractQueryOptions);
    } else {
      this.smartContract = await this.dbInstance.smart_contracts.findAll(smartContractQueryOptions);
    }
    if (((includeCount === false && isValidArray(this.smartContract) === false) || (includeCount === true
      && (isValidObject(this.smartContract) === false || this.smartContract.count === 0))) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.smartContract;
  }

  /**
   * Get smart contract by uid
   * @param {String} uid
   * @param {Object} throwError
   * @param {Object} errorCode
   */
  async getByUid(uid, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : SmartContractNotFoundException;
    const where = {
      uid,
    };
    this.smartContract = await this.dbInstance.smart_contracts.findOne({
      where,
    });
    if (isValid(this.smartContract) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.smartContract;
  }

  /**
   * Get id from given smart contract
   * @param {Object} smartContract
   * @param {String} defaultValue
   * @returns
   */
  getId(smartContract = null, defaultValue = null) {
    let value = defaultValue;
    const smartContractInstance = isValid(smartContract) === true ? smartContract : this.smartContract;
    if (isValid(smartContractInstance) === true) {
      value = smartContractInstance.get('id', defaultValue);
    }
    return value;
  }

  /**
   * Get smart contract ids from given smart contracts
   * @param {Array} smartContracts
   * @returns array of smart contract ids
   */
  getIds(smartContracts) {
    let value = [];
    if (isValidArray(smartContracts) === true) {
      value = smartContracts.map((smartContract) => smartContract.get('id'));
    }
    return value;
  }

  /**
   * Get smart contract addresses from given smart contracts
   * @param {Array} smartContracts
   * @returns array of smart contract addresses
   */
  getAddresses(smartContracts) {
    let value = [];
    if (isValidArray(smartContracts) === true) {
      value = smartContracts.map((smartContract) => smartContract.get('address'));
    }
    return value;
  }

  /**
   * Get the smart contract by address
   * @param {String} smartContractAddress
   * @param {Boolean} throwError
   * @param {Boolean} errorCode
   * @returns smart contract
   */
  async getByAddress(smartContractAddress, throwError = true, errorCode = null) {
    const smartContract = await this.getByCriteria(null, null, null, null, true, throwError, errorCode, smartContractAddress);
    return smartContract;
  }

  /**
   * Get smart contract address from given smart contract
   * @param {Object} smartContract
   * @returns
   */
  getAddress(smartContract, defaultValue = null) {
    let value;
    if (isValid(smartContract) === true) {
      value = smartContract.get('address', defaultValue);
    }
    return value;
  }

  /**
   * Get smart contract tokenProtocol from given smart contract
   * @param {Object} smartContract
   * @returns
   */
  getTokenProtocol(smartContract, defaultValue = null) {
    let value;
    if (isValid(smartContract) === true) {
      value = smartContract.get('token_protocol', defaultValue);
    }
    return value;
  }

  /**
   * Get smart contract smart_contract_abi from given smart contract
   * @param {Object} smartContract
   * @returns
   */
  getSmartContractAbi(smartContract, defaultValue = null) {
    let value;
    if (isValid(smartContract) === true) {
      value = smartContract.get('smart_contract_abi', defaultValue);
    }
    return value;
  }

  /**
   * Get count of user smart contracts
   * @param {String} userId
   * @param {String} type
   * @param {String} identity
   * @returns total smart contracts
   */
  async getTotalUserSmartContracts(userId, type = null, identity = null) {
    const where = {
      ...(isValid(type) && { type }),
      ...(isValid(identity) && { identity }),
    };

    const include = [
      {
        model: this.dbInstance.user,
        where: {
          id: userId,
        },
        required: true,
      },
    ];

    const smartContracts = await this.dbInstance.smart_contracts.count({
      where,
      include,
    });
    return smartContracts;
  }
}

module.exports = SmartContract;
