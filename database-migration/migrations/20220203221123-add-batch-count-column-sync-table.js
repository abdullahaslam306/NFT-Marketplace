/**
 * Migration for adding batch_count columns to syncs table
 */

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('syncs', 'batch_count', {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
      }, { transaction });

      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('syncs', 'batch_count', { transaction });
      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
};
