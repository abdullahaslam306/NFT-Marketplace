/**
 * Migration to change props of
 * nft_id and token_id columns
 * in nft_transaction_history table
*/

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('nft_transaction_history', 'token_id', {
      type: sequelizeDataTypes.STRING,
    });
    await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN nft_id DROP NOT NULL;', { transaction });
    await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN nft_id SET DEFAULT NULL;', { transaction });

    await transaction.commit();
  } catch (exp) {
    await transaction.rollback();
    throw exp;
  }
};

const down = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('nft_transaction_history', 'token_id', {
      type: 'INTEGER USING CAST("token_id" as INTEGER)',
    });
    await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN nft_id DROP DEFAULT;', { transaction });
    await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN nft_id SET NOT NULL;', { transaction });

    await transaction.commit();
  } catch (exp) {
    await transaction.rollback();
    throw exp;
  }
};

module.exports = {
  up,
  down,
};
