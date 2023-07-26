/**
 * Migration to create nft blockchain info table
 */

const { configs } = require('backend-utility');

const { enums } = configs;

const { ETHEREUM } = enums.BlockChainNetwork;
const { ERC721, ERC1155 } = enums.TokenProtocol;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('nft_blockchain_info', {
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
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'network': {
        type: sequelizeDataTypes.ENUM,
        values: [ETHEREUM],
        defaultValue: ETHEREUM,
      },
      'token_id': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      'token_protocol': {
        type: sequelizeDataTypes.ENUM,
        allowNull: true,
        values: [ERC721, ERC1155],
        defaultValue: null,
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
      'minted_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('nft_blockchain_info', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_nft_blockchain_info_network;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_nft_blockchain_info_token_protocol;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
