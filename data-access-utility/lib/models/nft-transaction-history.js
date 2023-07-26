const { Sequelize } = require('sequelize');
const { configs } = require('backend-utility');

const { enums } = configs;
const {
  LIVE_LOCKED, LAZY_MINTED, SEND, RECEIVE, SELL, BUY, TRANSFER,
} = enums.NftTransactionEvents;

const { ERC721, ERC1155 } = enums.TokenProtocol;

module.exports = (sequelize, sequelizeDataTypes) => {
  const nftTransactionHistory = sequelize.define(
    'nft_transaction_history',
    {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'nft_id': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'nfts',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'event_name': {
        type: sequelizeDataTypes.ENUM,
        values: [LIVE_LOCKED, LAZY_MINTED, SEND, RECEIVE, SELL, BUY, TRANSFER],
        defaultValue: null,
      },
      'price': {
        type: sequelizeDataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0.0,
      },
      'from_wallet_address': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'to_wallet_address': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'etherscan_link': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'ipfs_link': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      // 9 decimal places
      'gas_fees': {
        type: sequelizeDataTypes.FLOAT(),
        allowNull: false,
        defaultValue: 0,
      },
      'editions': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      'transaction_hash': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'event_time': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'token_id': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'contract_address': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'block_number': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      'token_protocol': {
        type: sequelizeDataTypes.ENUM,
        values: [ERC721, ERC1155],
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    },
  );

  nftTransactionHistory.associate = (models) => {
    nftTransactionHistory.belongsTo(models.nft, { foreignKey: 'nft_id' });
  };

  return nftTransactionHistory;
};
