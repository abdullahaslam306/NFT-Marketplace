/**
 * Migration for creating sync table
 */
const Sequelize = require('sequelize');

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('syncs', 'logs', { transaction });
      await queryInterface.removeColumn('syncs', 'user_id', { transaction });
      await queryInterface.removeColumn('syncs', 'wallets', { transaction });
      await queryInterface.removeColumn('syncs', 'smart_contracts', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('syncs', 'user_id', {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      }, { transaction });

      await queryInterface.addColumn('syncs', 'logs', {
        type: sequelizeDataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await queryInterface.addColumn('syncs', 'wallets', {
        type: sequelizeDataTypes.JSONB,
        allowNull: false,
      }, { transaction });

      await queryInterface.addColumn('syncs', 'smart_contracts', {
        type: sequelizeDataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
