const { Sequelize } = require('sequelize');
const { configs } = require('backend-utility');

const { enums } = configs;

const { MAIN, AUXILIARY } = enums.NftAssetType;

module.exports = (sequelize, sequelizeDataTypes) => {
  const nftAssets = sequelize.define('nft_asset', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'nft_id': {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'nfts',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'asset_id': {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'assets',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'asset_type': {
      type: sequelizeDataTypes.ENUM,
      values: [MAIN, AUXILIARY],
      defaultValue: MAIN,
    },
  });

  nftAssets.associate = (models) => {
    nftAssets.belongsTo(models.nft);
    nftAssets.belongsTo(models.asset);
  };

  return nftAssets;
};
