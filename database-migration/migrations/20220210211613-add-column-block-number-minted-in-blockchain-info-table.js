/**
 * Migration for adding block_number_minted columns to nft_blockchain_info table
 */

const up = async (queryInterface, sequelizeDataTypes) =>
  queryInterface.addColumn('nft_blockchain_info', 'block_number_minted', {
    type: sequelizeDataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  });

const down = async (queryInterface, sequelizeDataTypes) =>
  queryInterface.removeColumn('nft_blockchain_info', 'block_number_minted');

module.exports = {
  up,
  down,
};
