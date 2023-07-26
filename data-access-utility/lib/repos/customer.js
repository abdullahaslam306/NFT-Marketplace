/**
 * Class to access and manage customers
 */

const { CommonError, errors, helpers } = require('backend-utility');

const {
  isValid,
  isValidErrorCode,
} = helpers.functions;
const { CustomerNotFoundException } = errors.codes;

class Customer {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
  * Get customer by user id
  * @param {Number} userId
  * @param {Boolean} throwError
  * @param {Object} errorCode
  */
  async getByUserId(userId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CustomerNotFoundException;
    const where = {};
    let customer = {};

    if (isValid(userId)) {
      where.user_id = userId;
      customer = await this.dbInstance.customer.findOne({
        where,
      });
    }

    if (!(customer instanceof this.dbInstance.customer) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return customer;
  }
}

module.exports = Customer;
