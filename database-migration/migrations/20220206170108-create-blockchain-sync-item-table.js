/**
 * Migration for creating blockchain_sync_item table
 */
const Sequelize = require('sequelize');
const { configs } = require('backend-utility');

const { NftSyncStatus, BlockchainSyncItemType } = configs.enums;
const { NFT_SYNC, TRANSACTION_SYNC } = BlockchainSyncItemType;
const {
  COMPLETED, DRAFT, FAILED, INPROGRESS,
} = NftSyncStatus;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    await queryInterface.createTable('blockchain_sync_items', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'blockchain_sync_id': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'blockchain_sync',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'type': {
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
      'meta': {
        type: sequelizeDataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      },
      'started_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        defaultValue: null,
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
      await queryInterface.dropTable('blockchain_sync_items', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_items_type;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_items_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
