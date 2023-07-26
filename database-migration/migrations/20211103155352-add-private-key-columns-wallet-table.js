/**
 * Migration for temporarily adding columns to wallet table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('wallets', 'private_key', {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await queryInterface.addColumn('wallets', 'public_key', {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await queryInterface.addColumn('wallets', 'mnemonics', {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('wallets', 'private_key', { transaction });
      await queryInterface.removeColumn('wallets', 'public_key', { transaction });
      await queryInterface.removeColumn('wallets', 'mnemonics', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
