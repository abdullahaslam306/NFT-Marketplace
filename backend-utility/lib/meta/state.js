/**
 * States meta data along with helper functions
*/

const { upperCase } = require('lodash');
const { isValid, isValidArray } = require('../helpers/function');
const { codes } = require('../helpers/errors');
const CommonError = require('../helpers/errors/common-error');

const countryStates = [
  {
    'iso3': 'CAN',
    'states': [
      { name: 'Alberta', code: 'AB' },
      { name: 'British Columbia', code: 'BC' },
      { name: 'Manitoba', code: 'MB' },
      { name: 'New Brunswick', code: 'NB' },
      { name: 'Newfoundland and Labrador', code: 'NL' },
      { name: 'Northwest Territories', code: 'NT' },
      { name: 'Nova Scotia', code: 'NS' },
      { name: 'Nunavut', code: 'NU' },
      { name: 'Ontario', code: 'ON' },
      { name: 'Prince Edward Island', code: 'PE' },
      { name: 'Quebec', code: 'QC' },
      { name: 'Saskatchewan', code: 'SK' },
      { name: 'Yukon', code: 'YT' },
    ],
  },
  {
    iso3: 'USA',
    states: [
      { name: 'Alabama', code: 'AL' },
      { name: 'Alaska', code: 'AK' },
      { name: 'American Samoa', code: 'AS' },
      { name: 'Arizona', code: 'AZ' },
      { name: 'Arkansas', code: 'AR' },
      { name: 'Baker Island', code: 'UM-81' },
      { name: 'California', code: 'CA' },
      { name: 'Colorado', code: 'CO' },
      { name: 'Connecticut', code: 'CT' },
      { name: 'Delaware', code: 'DE' },
      { name: 'District of Columbia', code: 'DC' },
      { name: 'Florida', code: 'FL' },
      { name: 'Georgia', code: 'GA' },
      { name: 'Guam', code: 'GU' },
      { name: 'Hawaii', code: 'HI' },
      { name: 'Howland Island', code: 'UM-84' },
      { name: 'Idaho', code: 'ID' },
      { name: 'Illinois', code: 'IL' },
      { name: 'Indiana', code: 'IN' },
      { name: 'Iowa', code: 'IA' },
      { name: 'Jarvis Island', code: 'UM-86' },
      { name: 'Johnston Atoll', code: 'UM-67' },
      { name: 'Kansas', code: 'KS' },
      { name: 'Kentucky', code: 'KY' },
      { name: 'Kingman Reef', code: 'UM-89' },
      { name: 'Louisiana', code: 'LA' },
      { name: 'Maine', code: 'ME' },
      { name: 'Maryland', code: 'MD' },
      { name: 'Massachusetts', code: 'MA' },
      { name: 'Michigan', code: 'MI' },
      { name: 'Midway Atoll', code: 'UM-71' },
      { name: 'Minnesota', code: 'MN' },
      { name: 'Mississippi', code: 'MS' },
      { name: 'Missouri', code: 'MO' },
      { name: 'Montana', code: 'MT' },
      { name: 'Navassa Island', code: 'UM-76' },
      { name: 'Nebraska', code: 'NE' },
      { name: 'Nevada', code: 'NV' },
      { name: 'New Hampshire', code: 'NH' },
      { name: 'New Jersey', code: 'NJ' },
      { name: 'New Mexico', code: 'NM' },
      { name: 'New York', code: 'NY' },
      { name: 'North Carolina', code: 'NC' },
      { name: 'North Dakota', code: 'ND' },
      { name: 'Northern Mariana Islands', code: 'MP' },
      { name: 'Ohio', code: 'OH' },
      { name: 'Oklahoma', code: 'OK' },
      { name: 'Oregon', code: 'OR' },
      { name: 'Palmyra Atoll', code: 'UM-95' },
      { name: 'Pennsylvania', code: 'PA' },
      { name: 'Puerto Rico', code: 'PR' },
      { name: 'Rhode Island', code: 'RI' },
      { name: 'South Carolina', code: 'SC' },
      { name: 'South Dakota', code: 'SD' },
      { name: 'Tennessee', code: 'TN' },
      { name: 'Texas', code: 'TX' },
      { name: 'United States Minor Outlying Islands', code: 'UM' },
      { name: 'United States Virgin Islands', code: 'VI' },
      { name: 'Utah', code: 'UT' },
      { name: 'Vermont', code: 'VT' },
      { name: 'Virginia', code: 'VA' },
      { name: 'Wake Island', code: 'UM-79' },
      { name: 'Washington', code: 'WA' },
      { name: 'West Virginia', code: 'WV' },
      { name: 'Wisconsin', code: 'WI' },
      { name: 'Wyoming', code: 'WY' },
    ],

  },
];

/**
 * Validate state of country
 * @param {String} stateCode
 * @param {String} countryIso
 */
function validateCountryState(stateCode, countryIso) {
  if (isValid(stateCode) === false || isValid(countryIso) === false) {
    throw new CommonError(codes.InternalServerError);
  }
  const stateFind = upperCase(stateCode);
  const countryFind = upperCase(countryIso);
  let result = '';
  const states = getByCountryCode(countryFind);
  if (isValidArray(states) && states.length > 0) {
    const validState = states.find(state => state.code === stateFind);
    result = (isValid(validState)) === true ? validState : result;
  }
  if (isValid(result) === false) {
    throw new CommonError(codes.StatesNotFoundException);
  }
}

/**
 * Get states of country by given iso3 code
 * Search will be performed for case insensitive exact match
 * @param {String} code
 * @returns states object contains name and code
 */
function getByCountryCode(code) {
  let result;
  if (isValid(code) === true && code.length > 0) {
    const searchTerm = upperCase(code);
    result = countryStates.find(countryState => countryState.iso3 === searchTerm);
    result = (isValid(result)) === true ? result.states : result;
  }
  return result;
}

module.exports = {
  getByCountryCode,
  validateCountryState,
};
