const { Sequelize } = require('sequelize');

module.exports = (sequelize, sequelizeDataTypes) => {
  const nftOwners = sequelize.define('nft_owner', {
    'nft_id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'nfts',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'wallet_address': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    'user_id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'editions_owned': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    'editions_to_sell': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    'wallet_id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'wallets',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  }, {
    timestamps: true,
  });

  nftOwners.associate = (models) => {
    nftOwners.hasOne(models.nft, { foreignKey: 'id' });
    nftOwners.hasOne(models.user, { foreignKey: 'id' });
    nftOwners.belongsTo(models.wallet, { foreignKey: 'wallet_id' });
  };

  return nftOwners;
};
