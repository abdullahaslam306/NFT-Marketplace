/**
 * Migration for adding
 * smart_contract_abi_id(FK),
 * column to smart_contracts table
*/

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('smart_contracts', 'smart_contract_abi_id', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'smart_contract_abis',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('smart_contracts', 'smart_contract_abi_id');
  },
};
