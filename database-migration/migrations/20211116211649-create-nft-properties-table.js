/**
 * Migration to create nft properties table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('nft_properties', {
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
      'name': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'value': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('nft_properties'),
};
