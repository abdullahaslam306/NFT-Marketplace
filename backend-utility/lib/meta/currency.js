/**
 * Currencies meta data along with helper functions
*/

const { upperCase } = require('lodash');
const { isValid } = require('../helpers/function');

const currencies = [
  { code: 'USD', symbol: '$', name: 'United States Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£ ', name: 'British Pound Sterling' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'DKK', symbol: 'kr.', name: 'Danish Krone' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'ILS', symbol: '₪', name: 'Israeli New Shekel' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'ISK', symbol: 'kr', name: 'Icelandic Krona' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

/**
 * Get complete list of allowed currencies
 */
function getAll() {
  return currencies;
}

/**
 * Get currency by code
 * Search will be performed for case insensitive exact match
 * @param {String} code
 * @returns country object contains name and iso3
 */
function getByCode(code) {
  let result;
  if (isValid(code) === true && code.length > 0) {
    const searchTerm = upperCase(code);
    result = currencies.find(currency => currency.code === searchTerm);
  }
  return result;
}

module.exports = {
  getAll,
  getByCode,
};
