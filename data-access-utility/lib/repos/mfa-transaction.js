/**
 * Class to access and manage mfa transaction
 */

const { CommonError, errors, helpers } = require('backend-utility');

const { isValid, isValidErrorCode, checkCodeExpiry } = helpers.functions;
const {
  CodeExpiredException,
  GenerateMfaException,
  MfaTransactionNotFoundException,
  InvalidVerificationCodeException,
} = errors.codes;
class MfaTransaction {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Create new mfa transaction
   * @param {Number} userId
   * @param {String} action
   * @param {String} email
   * @param {String} emailCode
   * @param {String} phone
   * @param {String} phoneCode
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async create(userId, action, email, emailCode, phone = null, phoneCode = null, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : GenerateMfaException;

    const mfaTransactionData = {
      email,
      action,
      user_id: userId,
      email_code: emailCode,
    };

    if (isValid(phone) === true && isValid(phoneCode) === true) {
      mfaTransactionData.phone = phone;
      mfaTransactionData.phone_code = phoneCode;
    }

    const mfaTransaction = await this.dbInstance.mfa_transaction.create(
      mfaTransactionData,
      { transaction },
    );

    if (!(mfaTransaction instanceof this.dbInstance.mfa_transaction) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return mfaTransaction;
  }

  /**
   * Get merchant by user id
   * @param {Number} userId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByUid(uid, userId, action, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : MfaTransactionNotFoundException;
    let mfaTransaction = {};
    const where = { uid };

    if (isValid(userId) === true) {
      where.user_id = userId;
    }

    if (isValid(action) === true) {
      where.action = action;
    }

    mfaTransaction = await this.dbInstance.mfa_transaction.findOne({
      where,
    });

    if (!(mfaTransaction instanceof this.dbInstance.mfa_transaction) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return mfaTransaction;
  }

  /**
   * Verify the codes for given transaction
   * @param {String} transactionUid
   * @param {String} emailCode
   * @param {String} phoneCode
   * @param {String} action
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async verifyCodes(transactionUid, emailCode, phoneCode, action, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : MfaTransactionNotFoundException;

    let mfaTransaction = {};
    const where = {
      uid: transactionUid,
    };

    mfaTransaction = await this.dbInstance.mfa_transaction.findOne({
      where,
    });

    if (!(mfaTransaction instanceof this.dbInstance.mfa_transaction) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    const transactionAction = this.getAction(mfaTransaction);
    const transactionEmailCode = this.getEmailCode(mfaTransaction);
    const transactionPhoneCode = this.getPhoneCode(mfaTransaction);

    if (transactionAction !== action
      || (isValid(transactionEmailCode) === true && transactionEmailCode !== emailCode)
      || (isValid(transactionPhoneCode) === true && transactionPhoneCode !== phoneCode)
    ) {
      throw new CommonError(InvalidVerificationCodeException);
    }

    const transactionCreationTime = this.getCreationDate(mfaTransaction);

    // Checking for expired verification codes
    const codesValidity = checkCodeExpiry(transactionCreationTime);
    if (codesValidity === false) {
      throw new CommonError(CodeExpiredException);
    }

    return mfaTransaction;
  }

  /**
   * Get email from mfa transaction
   * @param {Object} mfaTransaction
   * @param {Number} defaultValue
   */
  getEmail(mfaTransaction, defaultValue = null) {
    let value = defaultValue;
    if (mfaTransaction instanceof this.dbInstance.mfa_transaction) {
      value = mfaTransaction.get('email', defaultValue);
    }
    return value;
  }

  /**
   * Get phone from mfa transaction
   * @param {Object} mfaTransaction
   * @param {Number} defaultValue
   */
  getPhone(mfaTransaction, defaultValue = null) {
    let value = defaultValue;
    if (mfaTransaction instanceof this.dbInstance.mfa_transaction) {
      value = mfaTransaction.get('phone', defaultValue);
    }
    return value;
  }

  /**
   * Get action from mfa transaction
   * @param {Object} mfaTransaction
   * @param {Number} defaultValue
   */
  getAction(mfaTransaction, defaultValue = null) {
    let value = defaultValue;
    if (mfaTransaction instanceof this.dbInstance.mfa_transaction) {
      value = mfaTransaction.get('action', defaultValue);
    }
    return value;
  }

  /**
   * Get email code
   * @param {Object} mfaTransaction
   * @param {Number} defaultValue
   */
  getEmailCode(mfaTransaction, defaultValue = null) {
    let value = defaultValue;
    if (mfaTransaction instanceof this.dbInstance.mfa_transaction) {
      value = mfaTransaction.get('email_code', defaultValue);
    }
    return value;
  }

  /**
   * Get phone code
   * @param {Object} mfaTransaction
   * @param {Number} defaultValue
   */
  getPhoneCode(mfaTransaction, defaultValue = null) {
    let value = defaultValue;
    if (mfaTransaction instanceof this.dbInstance.mfa_transaction) {
      value = mfaTransaction.get('phone_code', defaultValue);
    }
    return value;
  }

  /**
   * Get mfa transaction creation time
   * @param {Object} mfaTransaction
   * @param {Number} defaultValue
   */
  getCreationDate(mfaTransaction, defaultValue = null) {
    let value = defaultValue;
    if (mfaTransaction instanceof this.dbInstance.mfa_transaction) {
      value = mfaTransaction.get('createdAt', defaultValue);
    }
    return value;
  }

  /**
   * Set verified at for mfa transaction
   * @param {Object} mfaTransaction
   * @param {Object} transaction
   */
  async setVerifiedAt(mfaTransaction, transaction = null) {
    const time = new Date().toISOString();
    const mfaTransactionData = {
      verified_at: time,
    };
    const updatedTransaction = mfaTransaction.update(mfaTransactionData, { transaction });
    return updatedTransaction;
  }

  /**
   * Set deleted at for mfa transaction
   * @param {Object} mfaTransaction
   * @param {Object} transaction
   */
  delete(mfaTransaction, transaction = null) {
    return mfaTransaction.destroy({ transaction });
  }
}

module.exports = MfaTransaction;
