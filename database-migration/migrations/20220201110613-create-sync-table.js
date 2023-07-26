/**
 * Migration for creating sync table
 */
const Sequelize = require('sequelize');
const { configs } = require('backend-utility');

const { COMPLETED, INPROGRESS, FAILED } = configs.enums.NftSyncStatus;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    await queryInterface.createTable('syncs', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'user_id': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'status': {
        type: sequelizeDataTypes.ENUM,
        values: [COMPLETED, INPROGRESS, FAILED],
        allowNull: false,
        defaultValue: INPROGRESS,
      },
      'started_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'ended_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      'logs': {
        type: sequelizeDataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      'wallets': {
        type: sequelizeDataTypes.JSONB,
        allowNull: false,
      },
      'smart_contracts': {
        type: sequelizeDataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('syncs', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_sync_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
