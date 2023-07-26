/**
 * Migration for removing wallet_id column from nfts table
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('nfts', 'wallet_id', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('nfts', 'wallet_id', {
        type: sequelizeDataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'wallets',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      }, { transaction });
      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
};
