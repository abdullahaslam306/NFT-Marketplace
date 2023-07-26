/**
 *  KMS service for encrypting wallet private data
 */

const crypto = require('crypto');

/**
 * The function is used to encrypt data using symetric encryption
 *
 * @param {String} dataKey
 * @param {Buffer} data
 * @returns
 */
const encryptData = async (dataKey, data) => {
  const algorithm = 'AES-256-CBC';
  const iv = Buffer.from('00000000000000000000000000000000', 'hex');
  const encryptor = crypto.createCipheriv(algorithm, dataKey, iv);
  encryptor.write(data);
  encryptor.end();

  return encryptor.read();
};

/**
 * The function is used to decrypt data using symetric encryption
 *
 * @param {String} dataKey
 * @param {Buffer} data
 * @returns
 */
const decryptData = async (dataKey, data) => {
  const algorithm = 'AES-256-CBC';
  const iv = Buffer.from('00000000000000000000000000000000', 'hex');
  const dencryptor = crypto.createDecipheriv(algorithm, dataKey, iv);
  dencryptor.write(data);
  dencryptor.end();

  return dencryptor.read();
};

module.exports = {
  decryptData,
  encryptData,
};
