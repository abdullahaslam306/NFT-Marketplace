/**
 * Languages meta data along with helper functions
*/

const { upperCase } = require('lodash');
const { isValid } = require('../helpers/function');

const languages = [
  { code: 'ENG', name: 'English' },
];

/**
 * Get complete list of allowed languages
 */
function getAll() {
  return languages;
}

/**
 * Get languages by code
 * Search will be performed for case insensitive exact match
 * @param {String} code
 * @returns country object contains name and iso3
 */
function getByCode(code) {
  let result;
  if (isValid(code) === true && code.length > 0) {
    const searchTerm = upperCase(code);
    result = languages.find(language => language.code === searchTerm);
  }
  return result;
}

module.exports = {
  getAll,
  getByCode,
};
