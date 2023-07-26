/**
 * Migration to create nft owners table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('nft_owners', {
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
      'user_id': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'users',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
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
      'wallet_address': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
        defaultValue: null,
      },
      'created_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'updated_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'deleted_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },

    });
  },

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('nft_owners'),
};
