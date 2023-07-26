/**
 * Migration to add token_uri column in nft_blockchain_info table
 */
const up = async (queryInterface, sequelizeDataTypes) =>
  queryInterface.addColumn('nft_blockchain_info', 'token_uri', {
    type: sequelizeDataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  });

const down = async queryInterface =>
  queryInterface.removeColumn('nft_blockchain_info', 'token_uri');

module.exports = {
  up,
  down,
};
