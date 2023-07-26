/**
 *  Implementation of helper function
 */

const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const { CommonError, errors, helpers } = require('backend-utility');

const { isValid } = helpers.functions;
const { WalletNotFoundException } = errors.codes;
const { walletHelper } = require('../helpers');
const { paymentGateway } = require('../services');

const { NETWORK_URL } = process.env;

/**
 * Filters only rates for a provided crypto
 * @param {object} data
 * @param {String} crypto
 * @returns
 */

/* eslint-disable no-restricted-syntax */
const filterEth = (data, crypto) => {
  const rateETH = {};
  for (const i in data) {
    if (i.startsWith(crypto.toUpperCase()) || i.endsWith(crypto.toUpperCase())) {
      rateETH[i] = data[i];
    }
  }
  return rateETH;
};
/* eslint-enable no-restricted-syntax */

/**
 * Get current balance of ethers in given wallet
 * @param {String} walletAddress
 * @returns Wallet balance
 */
const getWalletBalance = async walletAddress => {
  let balance = 0;
  try {
    balance = await walletHelper.getBalanceInEth(walletAddress);
    balance = parseFloat(balance);
  } catch (exp) {
    pino.error(exp);
  }
  return balance;
};

/**
 * Get current balance of ethers in given wallet
 * @param {String} walletAddress
 * @returns Wallet balance
 */
const generateNetworkWalletLink = (networkUrl, walletAddress) => {
  const link = `${networkUrl}address/${walletAddress}`;
  return link;
};

/**
 * Get currency rate.
 * @param {String} fiatCurrency
 * @returns Currency rate.
 */
const getCurrencyRate = async (fiatCurrency = 'USD') => {
  let rate;
  try {
    const converter = await paymentGateway.CryptoToFiat();
    const currencyPair = `ETH${fiatCurrency}`;
    rate = parseFloat(converter[currencyPair]);
  } catch (exp) {
    pino.error(exp);
  }

  return rate;
};

/**
 * Get wallets with balance.
 * @param {String} walletList
 * @returns wallets with balance.
 */
const getWalletListBalance = async (walletList = null) => {
  if (isValid(walletList) === false) {
    throw new CommonError(WalletNotFoundException);
  }

  const wallets = [];
  const currencyRate = await getCurrencyRate();
  for (let index = 0; index < walletList.length; index += 1) {
    const wallet = { ...walletList[index].dataValues };
    const { address } = wallet;
    // eslint-disable-next-line no-await-in-loop
    const balance = await getWalletBalance(address);
    const fiat = balance / currencyRate;
    const url = generateNetworkWalletLink(NETWORK_URL, address);

    wallet.balance = {
      Eth: balance,
      Fiat: fiat,
      Url: url,
    };

    wallets.push(wallet);
  }

  return wallets;
};

module.exports = {
  filterEth,
  getWalletListBalance,
};
