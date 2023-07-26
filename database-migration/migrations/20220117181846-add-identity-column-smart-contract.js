/**
 * Migration for adding wallet Type and name columns to wallet table
 */
const { configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { enums } = configs;
const { INTERNAL, EXTERNAL } = enums.SmartContractIdentity;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('smart_contracts', 'identity', {
        type: sequelizeDataTypes.ENUM,
        values: [INTERNAL, EXTERNAL],
        defaultValue: EXTERNAL,
      }, { transaction });

      await queryInterface.addColumn('smart_contracts', 'is_active', {
        type: sequelizeDataTypes.BOOLEAN,
        defaultValue: true,
      }, { transaction });

      await queryInterface.changeColumn('smart_contracts', 'address', {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
        unique: true,
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
      await queryInterface.removeColumn('smart_contracts', 'identity', { transaction });
      await queryInterface.removeColumn('smart_contracts', 'is_active', { transaction });
      await queryInterface.changeColumn('smart_contracts', 'address', {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
      }, { transaction });
      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      pino.error(exp);
      throw exp;
    }
  },
};
