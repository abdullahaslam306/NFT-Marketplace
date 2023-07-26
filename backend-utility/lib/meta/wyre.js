/**
 * constant settings for Wyre
 */

const destCurrency = 'ETH';
const paymentMethod = 'debit-card';
const amountIncludeFees = 'false';
const ethereumDestination = 'ethereum:';

const countries = [
  { code: 'DZ' },
  { code: 'AR' },
  { code: 'AU' },
  { code: 'AT' },
  { code: 'BE' },
  { code: 'BO' },
  { code: 'BR' },
  { code: 'CA' },
  { code: 'CL' },
  { code: 'CO' },
  { code: 'CR' },
  { code: 'CY' },
  { code: 'CZ' },
  { code: 'DK' },
  { code: 'DO' },
  { code: 'EE' },
  { code: 'FI' },
  { code: 'FR' },
  { code: 'DE' },
  { code: 'GR' },
  { code: 'HK' },
  { code: 'IS' },
  { code: 'IN' },
  { code: 'ID' },
  { code: 'IE' },
  { code: 'IL' },
  { code: 'IT' },
  { code: 'JP' },
  { code: 'LV' },
  { code: 'LT' },
  { code: 'LU' },
  { code: 'MY' },
  { code: 'MX' },
  { code: 'NP' },
  { code: 'NL' },
  { code: 'NZ' },
  { code: 'NO' },
  { code: 'PY' },
  { code: 'PE' },
  { code: 'PH' },
  { code: 'PL' },
  { code: 'PT' },
  { code: 'SG' },
  { code: 'SK' },
  { code: 'SI' },
  { code: 'ZA' },
  { code: 'KR' },
  { code: 'ES' },
  { code: 'SE' },
  { code: 'CH' },
  { code: 'TZ' },
  { code: 'TH' },
  { code: 'TR' },
  { code: 'GB' },
  { code: 'US' },
  { code: 'VN' },
];

function getAll() {
  return countries;
}
module.exports = {
  getAll,
  destCurrency,
  paymentMethod,
  amountIncludeFees,
  ethereumDestination,
};
