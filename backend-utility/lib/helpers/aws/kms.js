/* eslint-disable new-cap */
/**
 *  Implementation of helper methods related AWS KMS
 */

const ld = require('lodash');
const aws = require('aws-sdk');
const crypto = require('crypto');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { REGION } = process.env;
const kms = new aws.KMS({ region: REGION });

const dataKeysLimit = 50000;

/**
 * Generates a new Root Key for KMS
 * @param {String} KeyId
 * @returns
 */
async function generateDataKeys(KeyId) {
  let response;
  try {
    response = await kms.generateDataKey({ KeyId, KeySpec: 'AES_256' }).promise();
  } catch (exp) {
    pino.error(exp);
    throw exp;
  }
  return response;
}

/**
 * Used to decrypt the data keys from kms
 * @param {Buffer} cipherTextBlob
 * @param {String} keyId
 * @returns
 */
async function decryptDataKeys(cipherTextBlob, keyId) {
  let response;
  try {
    response = await kms.decrypt({
      CiphertextBlob: cipherTextBlob,
      KeyId: keyId,
    }).promise();
  } catch (exp) {
    pino.error(exp);
    throw exp;
  }
  return response;
}

/**
 * Create kms root key
 * @returns Newly generated KMS keys
 */
async function createKmsRootKey(alias = null) {
  return new Promise((resolve, reject) => {
    kms.createKey({
      KeyUsage: 'ENCRYPT_DECRYPT',
      KeySpec: 'SYMMETRIC_DEFAULT',
      Origin: 'AWS_KMS',
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const keyId = ld.get(data, 'KeyMetadata.KeyId', null);
        resolve(keyId);
      }
    });
  });
}

/**
 * The function is used to encrypt data using symetric encryption
 * @param {String} dataKey
 * @param {Buffer} data
 * @returns
 */
async function encryptData(dataKey, data) {
  const algorithm = 'AES-256-CBC';
  // eslint-disable-next-line new-cap
  const iv = new Buffer.from('00000000000000000000000000000000', 'hex');
  const encryptor = crypto.createCipheriv(algorithm, dataKey, iv);
  encryptor.write(data);
  encryptor.end();

  return encryptor.read();
}

/**
 * Function to decrypt data using symmetric encryption
 * @param {String} dataKey
 * @param {Buffer} data
 * @returns
 */
async function decryptData(dataKey, data) {
  const algorithm = 'AES-256-CBC';
  // eslint-disable-next-line new-cap
  const iv = new Buffer.from('00000000000000000000000000000000', 'hex');
  const encryptor = crypto.createDecipheriv(algorithm, dataKey, iv);
  encryptor.write(data);
  encryptor.end();

  return encryptor.read();
}

module.exports = {
  encryptData,
  decryptData,
  dataKeysLimit,
  decryptDataKeys,
  createKmsRootKey,
  generateDataKeys,
};
