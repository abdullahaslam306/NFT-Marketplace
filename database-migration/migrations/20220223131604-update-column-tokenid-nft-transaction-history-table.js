/**
 * migration to update token_id column to be of type STRING
 */

const up = async (queryInterface, sequelizeDataTypes) => {
  await queryInterface.changeColumn('nft_transaction_history', 'token_id', {
    type: sequelizeDataTypes.STRING,
  });
};

const down = async (queryInterface, sequelizeDataTypes) => {
  await queryInterface.changeColumn('nft_transaction_history', 'token_id', {
    type: 'INTEGER USING CAST("token_id" as INTEGER)',
  });
};
module.exports = {
  up,
  down,
};
