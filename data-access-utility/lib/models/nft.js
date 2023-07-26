const { Sequelize } = require('sequelize');
const { configs } = require('backend-utility');

const { enums } = configs;
const {
  DRAFT,
  PENDING,
  LAZY_MINTED,
  LIVE_LOCKED,
} = enums.NftStatus;

module.exports = (sequelize, sequelizeDataTypes) => {
  const nfts = sequelize.define('nft', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'uid': {
      type: sequelizeDataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: { isUUID: 4 },
      defaultValue: sequelizeDataTypes.UUIDV4,
    },
    'title': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    'description': {
      type: sequelizeDataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    'user_id': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'secondary_sale_royalty': {
      type: sequelizeDataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    'total_editions': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    'has_unlockable_content': {
      type: sequelizeDataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    'unlockable_content': {
      type: sequelizeDataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    'signature': {
      type: sequelizeDataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    'status': {
      type: sequelizeDataTypes.ENUM,
      values: [DRAFT, LAZY_MINTED, LIVE_LOCKED, PENDING],
      defaultValue: DRAFT,
    },
    'tags': {
      type: sequelizeDataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    'properties': {
      type: sequelizeDataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    'minted_at': {
      type: sequelizeDataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    'lazy_minted_at': {
      type: sequelizeDataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    'smart_contract_id': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'smart_contracts',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'token_id': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'block_number_minted': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: true,
  });

  nfts.associate = (models) => {
    nfts.belongsTo(models.user);
    nfts.hasMany(models.nft_asset);
    nfts.hasMany(models.nft_owner);
    nfts.hasMany(models.nft_section);
    nfts.hasMany(models.nft_collaborator);
    nfts.belongsTo(models.smart_contracts);
    nfts.hasOne(models.nft_blockchain_info);
  };

  return nfts;
};
