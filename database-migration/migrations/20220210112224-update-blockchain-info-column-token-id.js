/**
 * Migration to change column type of token_id to string.
 */

const up = async (queryInterface, sequelizeDataTypes) =>
  queryInterface.changeColumn('nft_blockchain_info', 'token_id', {
    type: sequelizeDataTypes.STRING,
  });

const down = async (queryInterface, sequelizeDataTypes) =>
  // Doing exolicit casting as work around for this migration to work correctly
  queryInterface.changeColumn('nft_blockchain_info', 'token_id', {
    type: 'INTEGER USING CAST("token_id" as INTEGER)',
  });

module.exports = {
  up,
  down,
};
