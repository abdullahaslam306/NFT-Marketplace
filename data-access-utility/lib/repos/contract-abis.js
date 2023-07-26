/**
 * Class to access and manage smart contract abi
 */

const { CommonError, errors, helpers } = require('backend-utility');
const { Op } = require('sequelize');

const { isValidErrorCode } = helpers.functions;
const { CreateContractAbiException, ContractAbiNotFoundException } = errors.codes;

class SmartContractAbi {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Create new smart contract based abi transaction
   * @param {String} smartContractAddress
   * @param {JSON} abiJson
   * @param {Object} transaction
   * @param {Object} throwError
   * @param {Object} errorCode
   * @returns Return smart contract abi
   */
  async create(smartContractAddress, abiJson, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateContractAbiException;
    const smartConstractAbiData = {
      contract_address: smartContractAddress,
      abi: abiJson,
    };
    const smartContracAbi = await this.dbInstance.smart_contract_abis.create(smartConstractAbiData, { transaction });
    if (!(smartContracAbi instanceof this.dbInstance.smart_contract_abis) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return smartContracAbi;
  }

  /**
   * Get smart contract abi by smart contract address
   * @param {String} smartContractAddress
   * @param {Object} throwError
   * @param {Object} errorCode
   * @returns Return smart contract abi data
   */
  async getBySmartContractAddress(smartContractAddress, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : ContractAbiNotFoundException;
    const where = {};
    let smartConstractAbiData = {};
    where.contract_address = smartContractAddress;
    smartConstractAbiData = await this.dbInstance.smart_contract_abis.findOne({
      where,
    });

    if (!(smartConstractAbiData instanceof this.dbInstance.smart_contract_abis) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return smartConstractAbiData;
  }

  /**
   * Get smart contract abi by tokenProtocol
   * @param {String} tokenProtocol
   * @param {Object} throwError
   * @param {Object} errorCode
   * @returns Return smart contract abi data
   */
  async getByTokenProtocol(tokenProtocol, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : ContractAbiNotFoundException;
    const where = {
      token_protocol: {
        [Op.iLike]: `${tokenProtocol}`,
      },
    };
    let smartConstractAbiData = {};
    smartConstractAbiData = await this.dbInstance.smart_contract_abis.findOne({
      where,
    });

    if (!(smartConstractAbiData instanceof this.dbInstance.smart_contract_abis) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return smartConstractAbiData;
  }

  /**
   * Get smart contract abi by default
   * @param {String} smartContractAbi
   * @param {Object} defaultValue
   * @returns Return the abi
   */
  getSmartContractAbi(smartContractAbi, defaultValue = null) {
    let value = defaultValue;
    if (smartContractAbi instanceof this.dbInstance.smart_contract_abis) {
      value = smartContractAbi.get('abi', defaultValue);
    }
    return value;
  }

  /**
   * Get id from given smart contract abi
   * @param {Object} smartContractAbi
   * @param {String} defaultValue
   * @returns
   */
  getId(smartContractAbi, defaultValue = null) {
    let value = defaultValue;
    if (smartContractAbi instanceof this.dbInstance.smart_contract_abis) {
      value = smartContractAbi.get('id', defaultValue);
    }
    return value;
  }
}

module.exports = SmartContractAbi;
