/**
 * Migration for adding wallet_id columns to nft_owners table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('nft_owners', 'wallet_id', {
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
  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('nft_owners', 'wallet_id', { transaction });
      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
};
