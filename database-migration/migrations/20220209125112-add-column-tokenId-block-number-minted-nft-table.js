/**
 * Migration for adding token_id, and block_number_minted columns to nfts table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('nfts', 'token_id', {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await queryInterface.addColumn('nfts', 'block_number_minted', {
        type: sequelizeDataTypes.INTEGER,
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
      await queryInterface.removeColumn('nfts', 'token_id', { transaction });
      await queryInterface.removeColumn('nfts', 'block_number_minted', { transaction });
      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
};
