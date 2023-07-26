/**
 * Migration for droping syncs table and creating blockchain_sync table
 */
const Sequelize = require('sequelize');
const { configs } = require('backend-utility');

const { NftSyncStatus, NftSyncStage } = configs.enums;
const { NFT_SYNC, TRANSACTION_SYNC } = NftSyncStage;
const { COMPLETED, INPROGRESS, FAILED } = NftSyncStatus;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('batch_meta', { transaction });
      await queryInterface.dropTable('batch', { transaction });
      await queryInterface.dropTable('syncs', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_batch_meta_stage;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_batch_meta_status;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_batch_status;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_syncs_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('syncs', {
        'id': {
          type: sequelizeDataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
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
        'batch_count': {
          type: sequelizeDataTypes.INTEGER,
          allowNull: false,
        },
      }, { transaction });

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
      }, { transaction });

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
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
