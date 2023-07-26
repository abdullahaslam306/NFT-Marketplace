const { configs } = require('backend-utility');

const { NftSyncStage, NftSyncStatus } = configs.enums;
const {
  COMPLETED, DRAFT, INPROGRESS, FAILED,
} = NftSyncStatus;
const {
  NFT_ASSET_SYNC, NFT_TRANSACTION_SYNC, HISTORICAL_NFT_SYNC, OWNED_NFT_SYNC,
} = NftSyncStage;

module.exports = (sequelize, sequelizeDataTypes) => {
  const blockchainSync = sequelize.define('blockchain_sync', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'batch_identifier': {
      type: sequelizeDataTypes.UUID,
      allowNull: false,
      validate: { isUUID: 4 },
      defaultValue: sequelizeDataTypes.UUIDV4,
    },
    'status': {
      type: sequelizeDataTypes.ENUM,
      values: [COMPLETED, DRAFT, FAILED, INPROGRESS],
      allowNull: false,
      defaultValue: DRAFT,
    },
    'stage': {
      type: sequelizeDataTypes.ENUM,
      values: [OWNED_NFT_SYNC, NFT_TRANSACTION_SYNC, HISTORICAL_NFT_SYNC, NFT_ASSET_SYNC],
      allowNull: false,
      defaultValue: OWNED_NFT_SYNC,
    },
    'sync_item_count': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
  }, {
    timestamps: false,
    freezeTableName: true,
  });

  blockchainSync.associate = (models) => {
    blockchainSync.hasMany(models.blockchain_sync_items, { foreignKey: 'blockchain_sync_id' });
  };

  return blockchainSync;
};
