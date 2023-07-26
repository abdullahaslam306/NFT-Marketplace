/**
 * Class to access and manage Crypto Rates
 */

const { CommonError, errors, helpers } = require('backend-utility');

const { isValid, isValidErrorCode } = helpers.functions;
const { CreateCryptoRatesException, CryptoRateNotFoundException } = errors.codes;

class CryptoRates {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
  }

  /**
   * Update or insert latest crypto conversion rates for a given crypto
   * @param crypto
   * @param cryptoRateJson
   * @param throwError
   * @param errorCode
   * @param transaction
   * @returns {Promise<{}>}
   */
  async upsert(crypto, cryptoRateJson, throwError = true, errorCode = null, transaction = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateCryptoRatesException;
    const cryptoRateData = {
      crypto,
      crypto_rate_json: cryptoRateJson,
    };

    const where = {
      crypto,
    };

    let cryptoRate = await this.getByCrypto(crypto, false);
    if (cryptoRate) {
      await await this.dbInstance.crypto_rates.update({
        crypto_rate_json: cryptoRateJson,
      },
      {
        where,
      },
      {
        transaction,
      });
    } else {
      cryptoRate = await this.dbInstance.crypto_rates.create(cryptoRateData, {
        transaction,
      });
    }

    if (!(cryptoRate instanceof this.dbInstance.crypto_rates) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return cryptoRate;
  }

  /**
   * Get crypto rates for a given crypto currency
   * @param crypto
   * @param throwError
   * @param errorCode
   * @returns {Promise<{}>}
   */
  async getByCrypto(crypto, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CryptoRateNotFoundException;
    const where = {};
    let cryptoRate = {};
    if (isValid(crypto)) {
      where.crypto = crypto;
      cryptoRate = await this.dbInstance.crypto_rates.findOne({
        where,
      });
    }

    if (!(cryptoRate instanceof this.dbInstance.crypto_rates) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return cryptoRate;
  }

  /**
   *
   * functions returns the JSON of crypto rates
   *
   * @param {Object} cryptoRates
   * @param {Object} defaultValue
   * @returns
   */
  getCryptoRateJson(cryptoRates, defaultValue = null) {
    let value = defaultValue;
    if (cryptoRates instanceof this.dbInstance.crypto_rates) {
      value = cryptoRates.get('crypto_rate_json', defaultValue);
    }
    return value;
  }

  /**
 *
 * functions returns the updated timestamp of crypto rates
 *
 * @param {Object} cryptoRates
 * @param {Object} defaultValue
 * @returns
 */
  getUpdatedAt(cryptoRates, defaultValue = null) {
    let value = defaultValue;
    if (cryptoRates instanceof this.dbInstance.crypto_rates) {
      value = cryptoRates.get('updatedAt', defaultValue);
    }
    return value;
  }
}

module.exports = CryptoRates;
