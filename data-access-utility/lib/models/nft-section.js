const { Sequelize } = require('sequelize');

module.exports = (sequelize, sequelizeDataTypes) => {
  const nftSection = sequelize.define('nft_section', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'uid': {
      type: sequelizeDataTypes.UUID,
      allowNull: false,
      validate: { isUUID: 4 },
      defaultValue: sequelizeDataTypes.UUIDV4,
    },
    'nft_id': {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'nfts',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'title': {
      type: sequelizeDataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    'content': {
      type: sequelizeDataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: true,
  });

  nftSection.associate = (models) => {
    nftSection.belongsTo(models.nft);
  };

  return nftSection;
};
