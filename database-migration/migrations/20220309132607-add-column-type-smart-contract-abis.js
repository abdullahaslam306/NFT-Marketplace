/**
 * Migration for adding
 * token_protocol,
 * column to smart_contract_abis table
*/

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('smart_contract_abis', 'token_protocol', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('smart_contract_abis', 'token_protocol');
  },
};
