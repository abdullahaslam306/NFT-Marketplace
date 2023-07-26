/**
 * Migration to perform following
 * Removing stage column
 * Renaming status, sync_item_count, started_at and ended_at column
 * Adding tx_sync_status, tx_sync_item_count, tx_started_at, tx_ended_at column
 * in blockchain_sync table
 */

const { configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { NftSyncStatus, NftSyncStage } = configs.enums;
const { OWNED_NFT_SYNC, NFT_TRANSACTION_SYNC } = NftSyncStage;
const {
  COMPLETED, DRAFT, INPROGRESS, FAILED,
} = NftSyncStatus;

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.removeColumn('blockchain_sync', 'stage', { transaction });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_stage;', { transaction });

    await queryInterface.addColumn('blockchain_sync', 'tx_sync_status', {
      type: sequelizeDataTypes.ENUM,
      values: [COMPLETED, DRAFT, FAILED, INPROGRESS],
      allowNull: false,
      defaultValue: DRAFT,
    }, { transaction });

    await queryInterface.addColumn('blockchain_sync', 'tx_sync_started_at', {
      type: sequelizeDataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }, { transaction });

    await queryInterface.addColumn('blockchain_sync', 'tx_sync_ended_at', {
      type: sequelizeDataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }, { transaction });

    await queryInterface.addColumn('blockchain_sync', 'tx_sync_item_count', {
      type: sequelizeDataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }, { transaction });

    await queryInterface.renameColumn('blockchain_sync', 'ended_at', 'nft_sync_ended_at', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'status', 'nft_sync_status', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'started_at', 'nft_sync_started_at', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'sync_item_count', 'nft_sync_item_count', { transaction });

    await transaction.commit();
  } catch (exp) {
    pino.error(exp);
    await transaction.rollback();
    throw exp;
  }
};

const down = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.addColumn('blockchain_sync', 'stage', {
      type: sequelizeDataTypes.ENUM,
      values: [OWNED_NFT_SYNC, NFT_TRANSACTION_SYNC],
      allowNull: false,
    }, { transaction });

    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_status', { transaction });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_tx_sync_status;', { transaction });
    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_ended_at', { transaction });
    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_started_at', { transaction });
    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_item_count', { transaction });

    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_ended_at', 'ended_at', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_status', 'status', { transaction });
    await queryInterface.sequelize.query('ALTER TYPE enum_blockchain_sync_status TO enum_blockchain_sync_nft_sync_status;', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_started_at', 'started_at', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_item_count', 'sync_item_count', { transaction });

    await transaction.commit();
  } catch (exp) {
    pino.error(exp);
    await transaction.rollback();
    throw exp;
  }
};

module.exports = {
  up,
  down,
};
