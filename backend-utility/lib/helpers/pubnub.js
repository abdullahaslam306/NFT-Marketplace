const PubNubModule = require('pubnub');
const { v4: uuidV4 } = require('uuid');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const CommonError = require('./errors/common-error');
const { PubNubDataException } = require('./errors/error-code');
const { isValidObject, isEmptyObject, isValid } = require('./function');

class PubNub {
  /**
   * Initializing PubNub
   * @param {String} publishKey
   * @param {String} subscribeKey
   * @param {String} uuid
   * @param {String} secretKey
   * @param {String} cipherKey
   * @param {Boolean} ssl
   *
   */
  constructor(publishKey, subscribeKey, uuid = uuidV4(), secretKey = null, cipherKey = null, ssl = true) {
    this.pubnub = new PubNubModule({
      publishKey,
      subscribeKey,
      uuid,
      secretKey,
      cipherKey,
      ssl,
    });
  }

  /**
     * PubNub notification required parameters
     * @param {string} channel
     * @param {object} message
    */
  async publishMessage(channel, message, throwError = false) {
    let response = null;
    try {
      if (throwError === true && (isValid(channel) === false || isValidObject(message) === false || isEmptyObject(message) === true)) {
        throw new CommonError(PubNubDataException);
      }
      response = await this.pubnub.publish({ channel, message });
      pino.info(`PubNub Notification Success - ${response.timetoken}`);
    } catch (exp) {
      pino.error(exp);
      if (throwError === true) {
        throw exp;
      }
    }
    return response;
  }
}

module.exports = PubNub;
