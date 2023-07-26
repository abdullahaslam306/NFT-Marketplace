/**
 * Migration to perform following
 * Adding stage and batch identifier column
 * Renaming nft_sync_status, nft_sync_item_count, nft_sync_started_at and nft_sync_ended_at column
 * Removing tx_sync_status, tx_sync_item_count, tx_started_at, tx_ended_at column
 * in blockchain_sync table
 */

const { configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { NftSyncStatus, NftSyncStage } = configs.enums;
const {
  HISTORICAL_NFT_SYNC, NFT_ASSET_SYNC, NFT_TRANSACTION_SYNC, OWNED_NFT_SYNC,
} = NftSyncStage;
const {
  COMPLETED, DRAFT, INPROGRESS, FAILED,
} = NftSyncStatus;

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_stage;', { transaction });

    await queryInterface.addColumn('blockchain_sync', 'stage', {
      type: sequelizeDataTypes.ENUM,
      values: [HISTORICAL_NFT_SYNC, NFT_ASSET_SYNC, NFT_TRANSACTION_SYNC, OWNED_NFT_SYNC],
      allowNull: false,
      defaultValue: OWNED_NFT_SYNC,
    }, { transaction });

    await queryInterface.addColumn('blockchain_sync', 'batch_identifier', {
      type: sequelizeDataTypes.UUID,
      allowNull: true,
      validate: { isUUID: 4 },
      defaultValue: sequelizeDataTypes.UUIDV4,
    }, { transaction });

    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_status', { transaction });
    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_ended_at', { transaction });
    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_started_at', { transaction });
    await queryInterface.removeColumn('blockchain_sync', 'tx_sync_item_count', { transaction });

    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_status', 'status', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_ended_at', 'ended_at', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_started_at', 'started_at', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'nft_sync_item_count', 'sync_item_count', { transaction });

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
    await queryInterface.removeColumn('blockchain_sync', 'stage', { transaction });
    await queryInterface.removeColumn('blockchain_sync', 'batch_identifier', { transaction });

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
    await queryInterface.renameColumn('blockchain_sync', 'sync_status', 'nft_sync_status', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'started_at', 'nft_sync_started_at', { transaction });
    await queryInterface.renameColumn('blockchain_sync', 'sync_item_count', 'nft_sync_item_count', { transaction });

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
