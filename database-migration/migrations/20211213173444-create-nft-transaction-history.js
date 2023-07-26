/**
 * Migration to create nft transaction history table
 */

const { configs } = require('backend-utility');

const { enums } = configs;

const {
  LIVE_LOCKED, LAZY_MINTED, SEND, RECEIVE, SELL, BUY,
} = enums.NftTransactionEvents;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('nft_transaction_history', {
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
      'event_name': {
        type: sequelizeDataTypes.ENUM,
        values: [LIVE_LOCKED, LAZY_MINTED, SEND, RECEIVE, SELL, BUY],
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('nft_transaction_history', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_nft_transaction_history_event_name;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
