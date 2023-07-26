/**
 *  handler to update the crypto rates in the RDS
 */

const { configs, helpers } = require('backend-utility');
const { repositories, database } = require('data-access-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { paymentGateway } = require('../../services');
const { filterEth } = require('../../common/functions');

const { CryptoSymbols } = configs.enums;
const { isValid } = helpers.functions;
const { ETH } = CryptoSymbols;

const handler = async (event, context) => {
  let transaction;
  const crypto = ETH;
  let connection;
  try {
    connection = database.openConnection();
    const rates = await paymentGateway.CryptoToFiat();
    const FilterRate = filterEth(rates, crypto);
    const cryptoRateJson = FilterRate;
    const cryptoRatesRepo = new repositories.CryptoRates(connection);

    transaction = await connection.sequelize.transaction();

    await cryptoRatesRepo.upsert(crypto, cryptoRateJson, true, null, transaction);

    transaction.commit();
  } catch (exp) {
    pino.error(exp);
    if (isValid(transaction)) {
      transaction.rollback();
    }
  } finally {
    if (connection) {
      await database.closeConnection(connection);
    }
  }
  return Promise.resolve(true);
};

module.exports = {
  handler,
};
