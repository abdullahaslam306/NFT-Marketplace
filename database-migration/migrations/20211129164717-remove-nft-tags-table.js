/**
 * Migration for dropping nft_tags table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.dropTable('nft_tags');
  },

  down: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('nft_tags', {
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
      'tag': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
    });
  },
};
