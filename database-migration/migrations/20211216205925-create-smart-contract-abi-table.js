/**
 * Migration to create contract ABI table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('smart_contract_abis', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'contract_address': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
        defaultValue: null,
        unique: true,
      },
      'abi': {
        type: sequelizeDataTypes.JSONB,
        allowNull: false,
      },
      'created_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'updated_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('smart_contract_abis');
  },
};
