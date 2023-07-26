/**
 * Migration for creating batch meta table
 */
const Sequelize = require('sequelize');
const { configs } = require('backend-utility');

const { NftSyncStatus, NftSyncStage } = configs.enums;
const { NFT_SYNC, TRANSACTION_SYNC } = NftSyncStage;
const { COMPLETED, INPROGRESS, FAILED } = NftSyncStatus;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    await queryInterface.createTable('batch_meta', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'batch_id': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'batch',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
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
      'stage': {
        type: sequelizeDataTypes.ENUM,
        values: [NFT_SYNC, TRANSACTION_SYNC],
        allowNull: false,
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
      await queryInterface.dropTable('batch_meta', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_batch_meta_stage;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_batch_meta_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
