const { Sequelize } = require('sequelize');
const { configs } = require('backend-utility');

const { enums } = configs;
const { BlockChainNetwork } = enums;
const { ETHEREUM } = BlockChainNetwork;
const {
  BLOCOMMERCE, EXTERNAL,
} = enums.WalletTypes;

const {
  CONNECTED, DISCONNECTED,
} = enums.WalletStatus;

module.exports = (sequelize, sequelizeDataTypes) => {
  const wallets = sequelize.define('wallet', {
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
    'user_id': {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'address': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    'network': {
      type: sequelizeDataTypes.ENUM,
      allowNull: false,
      values: [ETHEREUM],
      defaultValue: ETHEREUM,
    },
    'public_key': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'wallet_type': {
      type: sequelizeDataTypes.ENUM,
      values: [BLOCOMMERCE, EXTERNAL],
      allowNull: false,
      defaultValue: BLOCOMMERCE,
    },
    'status': {
      type: sequelizeDataTypes.ENUM,
      values: [CONNECTED, DISCONNECTED],
      allowNull: false,
      defaultValue: CONNECTED,
    },
    'name': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  wallets.associate = (models) => {
    wallets.belongsTo(models.user);
    wallets.hasOne(models.nft_owner, { foreignKey: 'wallet_id' });
  };

  return wallets;
};
