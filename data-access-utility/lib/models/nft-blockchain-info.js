const { Sequelize } = require('sequelize');
const { configs } = require('backend-utility');

const { enums } = configs;

const { ETHEREUM } = enums.BlockChainNetwork;
const { ERC721, ERC1155 } = enums.TokenProtocol;

module.exports = (sequelize, sequelizeDataTypes) => {
  const nftBlockchainInfo = sequelize.define('nft_blockchain_info', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'nft_id': {
      type: sequelizeDataTypes.INTEGER,
      unique: true,
      references: {
        model: 'nfts',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'network': {
      type: sequelizeDataTypes.ENUM,
      values: [ETHEREUM],
      defaultValue: ETHEREUM,
    },
    'token_id': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'token_protocol': {
      type: sequelizeDataTypes.ENUM,
      values: [ERC721, ERC1155],
      defaultValue: ERC721,
    },
    'contract_address': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    'ipfs_address': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'token_uri': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'minted_at': {
      type: sequelizeDataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    'block_number_minted': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
  });

  nftBlockchainInfo.associate = (models) => {
    nftBlockchainInfo.belongsTo(models.nft, { foreignKey: 'id' });
  };

  return nftBlockchainInfo;
};
