/**
 * Migration for creating blockchain_sync table
 */
const { configs } = require('backend-utility');

const { NftSyncStatus, NftSyncStage } = configs.enums;
const { NFT_SYNC, TRANSACTION_SYNC } = NftSyncStage;
const {
  COMPLETED, DRAFT, INPROGRESS, FAILED,
} = NftSyncStatus;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('blockchain_sync', {
        'id': {
          type: sequelizeDataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        'stage': {
          type: sequelizeDataTypes.ENUM,
          values: [NFT_SYNC, TRANSACTION_SYNC],
          allowNull: false,
        },
        'status': {
          type: sequelizeDataTypes.ENUM,
          values: [COMPLETED, DRAFT, FAILED, INPROGRESS],
          allowNull: false,
          defaultValue: DRAFT,
        },
        'sync_item_count': {
          type: sequelizeDataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
      }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('blockchain_sync', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_stage;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
