/**
 * Migration for adding wallet Type and name columns to wallet table
 */
const { configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { enums } = configs;
const { BLOCOMMERCE, EXTERNAL } = enums.WalletTypes;
const { CONNECTED, DISCONNECTED } = enums.WalletStatus;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('wallets', 'wallet_type', {
        type: sequelizeDataTypes.ENUM,
        values: [BLOCOMMERCE, EXTERNAL],
        allowNull: false,
        defaultValue: BLOCOMMERCE,
      }, { transaction });

      await queryInterface.addColumn('wallets', 'status', {
        type: sequelizeDataTypes.ENUM,
        values: [CONNECTED, DISCONNECTED],
        allowNull: false,
        defaultValue: CONNECTED,
      }, { transaction });

      await queryInterface.addColumn('wallets', 'name', {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      pino.error(exp);
      throw exp;
    }
  },
  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('wallets', 'wallet_type', { transaction });
      await queryInterface.removeColumn('wallets', 'status', { transaction });
      await queryInterface.removeColumn('wallets', 'name', { transaction });
      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      pino.error(exp);
      throw exp;
    }
  },
};
