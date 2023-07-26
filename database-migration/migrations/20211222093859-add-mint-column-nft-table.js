/**
 * Migration for adding lazy_minted_at and minted_At columns to nfts table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('nfts', 'lazy_minted_at', {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      }, { transaction });
      await queryInterface.addColumn('nfts', 'minted_at', {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('nfts', 'minted_at', { transaction });
      await queryInterface.removeColumn('nfts', 'lazy_minted_at', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
