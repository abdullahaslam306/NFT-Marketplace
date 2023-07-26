/**
 * Class to access and manage user smart contracts
 */

const {
  CommonError, errors, helpers,
} = require('backend-utility');

const { isValid, isValidErrorCode, isValidArray } = helpers.functions;
const { SmartContractNotFoundException, SmartContractForUserNotFoundException, CreateUserSmartContractException } = errors.codes;

class UserSmartContract {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Get user smart contract for given user id and smart contract id
   * @param {String} userId
   * @param {String} smartContractId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByUserIdAndSmartContractId(userId, smartContractId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : SmartContractNotFoundException;
    const where = {
      user_id: userId,
      smart_contract_id: smartContractId,
    };
    const smartContract = await this.dbInstance.user_smart_contracts.findOne({
      where,
    });
    if (!(smartContract instanceof this.dbInstance.user_smart_contracts) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return smartContract;
  }

  /**
   * Get user smart contract for given user id
   * @param {String} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByUserId(userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : SmartContractNotFoundException;

    const where = {
      id: userId,
    };
    const smartContractInclude = [{
      model: this.dbInstance.smart_contracts,
      required: false,
    }];

    const smartContract = await this.dbInstance.user.findOne({
      where,
      include: smartContractInclude,
    });

    if (!(smartContract instanceof this.dbInstance.user) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return smartContract;
  }

  /**
   * Get smart contract for given user id and smart contract id
   * @param {String} userId
   * @param {String} smartContractId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByCriteria(userId, smartContractId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : SmartContractForUserNotFoundException;
    const where = {
      user_id: userId,
      smart_contract_id: smartContractId,
    };
    const smartContract = await this.dbInstance.user_smart_contracts.findOne({
      where,
    });
    if (isValid(smartContract) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return smartContract;
  }

  /**
   * Delete user smart contract
   * @param {Object} userSmartContract
   * @param {Object} transaction
   * @returns Delete user smart contract
   */
  async delete(userSmartContract, transaction = null) {
    await userSmartContract.destroy({ transaction });
    return true;
  }

  /**
   * Associates smart contract to the given userId
   * @param {String} smartContractId
   * @param {String} userId
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Boolean} errorCode
   * @returns
   */
  async create(smartContractId, userId, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateUserSmartContractException;

    const ownershipData = {
      smart_contract_id: smartContractId,
      user_id: userId,
    };

    const smartContractOwner = await this.dbInstance.user_smart_contracts.create(ownershipData, { transaction });

    if (isValid(smartContractOwner) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return smartContractOwner;
  }

  /**
   * Associates given userId to each smart contract ID present in the smartContractsId array
   * @param {String} userId
   * @param {Array} smartContractsIds
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Boolean} errorCode
   */
  async associateSmartContracts(userId, smartContractsIds, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateUserSmartContractException;

    const ownershipData = smartContractsIds.map((id) => ({
      user_id: userId,
      smart_contract_id: id,
    }));

    const userSmartContractBulk = await this.dbInstance.user_smart_contracts.bulkCreate(ownershipData, { transaction });
    if (isValidArray(userSmartContractBulk) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
  }
}

module.exports = UserSmartContract;
