/**
 * Migration to create user_smart_contracts table
 */
const Sequelize = require('sequelize');

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('user_smart_contracts', {
      'user_id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'smart_contract_id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'smart_contracts',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
    });
  },

  down: async (queryInterface, sequelize) => {
    await queryInterface.dropTable('user_smart_contracts');
  },
};
