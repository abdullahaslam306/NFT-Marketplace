const { ethers } = require('ethers');
const { isUuid } = require('uuidv4');
const ldArr = require('lodash/array');
const ldStr = require('lodash/string');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { isValidArray } = require('./function');
const { NftAssetType } = require('../configs/enum');

/**
 * Validates if any of the value in given array is a valid number
 * @param {*} data
 */
const containsNumber = data => {
  let numberExists = false;
  if (Array.isArray(data) && data.length > 1) {
    data.forEach(element => {
      // eslint-disable-next-line
      if (!isNaN(parseInt(element))) {
        numberExists = true;
      }
    });
  }
  return numberExists;
};

/**
 * Combine error paths excluding any numbers
 * @param {Array} data
 * @returns {Array}
 */
const combineErrorPath = data => {
  const combinedPathArray = [];
  if (Array.isArray(data) && data.length > 1) {
    data.forEach(element => {
      // eslint-disable-next-line
      if (isNaN(parseInt(element)) === true) {
        combinedPathArray.push(element);
      }
    });
  }
  return combinedPathArray;
};

/**
 * Create validation message for custom JOI Request Validation
 * @param {object} validationCodes
 * @param {Error} errors
 * @param {string} action
 * @param {string} field
 */
const makeValidationMessage = (validationMsgs, validationErrors, action, field = '') => {
  let validationMessage = '';
  try {
    const firstError = ldArr.head(validationErrors);
    let fieldLabel = firstError.flags.label;
    pino.info(firstError.code);
    pino.info(firstError.path);
    pino.info(firstError.flags);

    if (Array.isArray(firstError.path) && firstError.path.length > 1) {
      let errorPath = firstError.path;
      if (containsNumber(firstError.path) === true) {
        errorPath = combineErrorPath(firstError.path);
      }
      fieldLabel = ldArr.join(errorPath, '.');
    }

    fieldLabel = ldStr.replace(fieldLabel, '_', '');
    pino.info(`ACTION : ${action} | FIELD LABEL : ${fieldLabel} | FIRST ERROR CODE : ${firstError.code}`);
    validationMessage = validationMsgs[action][fieldLabel][firstError.code];
  } catch (exp) {
    console.log(exp); //eslint-disable-line
    validationMessage = validationMsgs.generic.none['any.*'];
  }

  const error = new Error(validationMessage);
  pino.error(error);
  return error;
};

/**
 * Custom joi validation method for validating ether wallet address
 * @param {String} value
 * @param {Object} joihelpers
 * @returns
 */
const customValidationEthAddress = (value, joihelpers) => {
  const isValidAddress = ethers.utils.isAddress(value);
  if (isValidAddress === false) {
    return joihelpers.error('any.invalid');
  }
  return value;
};

/**
 * Custom joi validation method for validating nft asset
 * @param {String} value
 * @param {Object} joihelpers
 * @returns
 */
const customValidationNftAssetsUpdate = (value, joihelpers) => {
  const mainAsset = [];
  const auxiliaryAssets = [];
  console.log(isValidArray(value)); // eslint-disable-line no-console
  if (isValidArray(value) === true) {
    value.forEach(assetValue => {
      // eslint-disable-next-line default-case
      switch (assetValue.assetType) {
        case NftAssetType.MAIN:
          mainAsset.push(assetValue.assetUid);
          break;
        case NftAssetType.AUXILIARY:
          auxiliaryAssets.push(assetValue.assetUid);
          break;
      }
    });
    const mainAssetLength = mainAsset.length;
    const auxiliaryAssetsLength = auxiliaryAssets.length;

    // Allow only one main asset
    if (mainAssetLength > 1) {
      return joihelpers.error('any.allow');
    }
    // Allow at max four auxiliary assets
    if (auxiliaryAssetsLength > 4) {
      return joihelpers.error('any.allow');
    }

    // Auxiliary assets must contain unique seet identifiers
    if (auxiliaryAssetsLength > 0 && ldArr.uniq(auxiliaryAssets).length !== auxiliaryAssetsLength) {
      return joihelpers.error('array.unique');
    }
    // Main asset identifier should not be present in auxiliary assets
    if (mainAssetLength > 0 && auxiliaryAssetsLength > 0 && auxiliaryAssets.indexOf(mainAsset) !== -1) {
      return joihelpers.error('array.unique');
    }
  }
  return value;
};

/**
 * Custom joi validation method for validating comma separated uids
 * @param {String} value
 * @param {Object} joihelpers
 * @returns
 */
const customValidationCommaSeparatedUids = (value, joihelpers) => {
  const uids = value.split(',');
  const uidsLength = uids.length;

  // Checking for unique uuids
  if (uidsLength > 0 && ldArr.uniq(uids).length !== uidsLength) {
    return joihelpers.error('array.unique');
  }

  // Checking validity of uuids
  const validity = uids.every(uid => isUuid(uid));
  if (validity === false) {
    return joihelpers.error('string.guid');
  }
  return uids;
};

module.exports = {
  makeValidationMessage,
  customValidationEthAddress,
  customValidationNftAssetsUpdate,
  customValidationCommaSeparatedUids,
};
