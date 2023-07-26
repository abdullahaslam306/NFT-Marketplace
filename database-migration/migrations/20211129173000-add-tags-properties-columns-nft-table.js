/**
 * Migration for adding tags and properties columns to nfts table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('nfts', 'tags', {
        type: sequelizeDataTypes.JSONB,
        allowNull: true,
        defaultValue: null,
      }, { transaction });
      await queryInterface.addColumn('nfts', 'properties', {
        type: sequelizeDataTypes.JSONB,
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
      await queryInterface.removeColumn('nfts', 'tags', { transaction });
      await queryInterface.removeColumn('nfts', 'properties', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
