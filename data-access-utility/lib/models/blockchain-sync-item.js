const { Sequelize } = require('sequelize');
const { configs } = require('backend-utility');

const { BlockchainSyncItemType, NftSyncStatus } = configs.enums;
const {
  COMPLETED, DRAFT, FAILED, INPROGRESS,
} = NftSyncStatus;
const {
  NFT_ASSET_SYNC, NFT_TRANSACTION_SYNC, HISTORICAL_NFT_SYNC, OWNED_NFT_SYNC,
} = BlockchainSyncItemType;

module.exports = (sequelize, sequelizeDataTypes) => {
  const blockchainSyncItem = sequelize.define('blockchain_sync_items', {
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
      values: [OWNED_NFT_SYNC, NFT_TRANSACTION_SYNC, HISTORICAL_NFT_SYNC, NFT_ASSET_SYNC],
      allowNull: false,
      defaultValue: OWNED_NFT_SYNC,
    },
    'status': {
      type: sequelizeDataTypes.ENUM,
      values: [DRAFT, COMPLETED, INPROGRESS, FAILED],
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

  blockchainSyncItem.associate = (models) => {
    blockchainSyncItem.belongsTo(models.blockchain_sync);
  };

  return blockchainSyncItem;
};
