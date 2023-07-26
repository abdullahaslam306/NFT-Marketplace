/**
 * Migration for adding wallet_id, smart_contract_id columns to nfts table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
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

      await queryInterface.addColumn('nfts', 'smart_contract_id', {
        type: sequelizeDataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'smart_contracts',
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
      await queryInterface.removeColumn('nfts', 'wallet_id', { transaction });
      await queryInterface.removeColumn('nfts', 'smart_contract_id', { transaction });
      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
};
