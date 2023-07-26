/**
 * Migration to create crypto rates table
 */

const { configs } = require('backend-utility');

const { enums } = configs;

const {
  ETH,
  BTC,
  XRP,
} = enums.CryptoSymbols;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('crypto_rates', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'crypto': {
        type: sequelizeDataTypes.ENUM,
        values: [BTC, ETH, XRP],
        defaultValue: ETH,
      },
      'crypto_rate_json': {
        type: sequelizeDataTypes.JSONB,
        allowNull: false,
      },
      'created_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'updated_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('crypto_rates');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_crypto_rates_crypto;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
