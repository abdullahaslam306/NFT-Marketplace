/**
 * Migration for adding token_id, contract_address columns to nfts table
 */
module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('nft_transaction_history', 'token_id', {
        type: sequelizeDataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await queryInterface.addColumn('nft_transaction_history', 'contract_address', {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('nft_transaction_history', 'token_id', { transaction });
      await queryInterface.removeColumn('nft_transaction_history', 'contract_address', { transaction });

      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
};
