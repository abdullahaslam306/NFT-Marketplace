/**
 * Migration for creating batch table
 */
const Sequelize = require('sequelize');
const { configs } = require('backend-utility');

const { NftSyncStatus } = configs.enums;
const { COMPLETED, INPROGRESS, FAILED } = NftSyncStatus;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    await queryInterface.createTable('batch', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'sync_id': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'syncs',
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
    });
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('batch', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_batch_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
