const { Sequelize } = require('sequelize');

module.exports = (sequelize, sequelizeDataTypes) => {
  const nftCollaborators = sequelize.define('nft_collaborator', {
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
    'user_id': {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  });

  nftCollaborators.associate = (models) => {
    nftCollaborators.belongsTo(models.nft);
  };

  return nftCollaborators;
};
