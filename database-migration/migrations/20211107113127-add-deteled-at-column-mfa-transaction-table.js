/**
 * Migration for adding deleted_at column to mfa_transactions table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) =>
    queryInterface.addColumn('mfa_transactions', 'deleted_at', {
      type: sequelizeDataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    }),

  down: async (queryInterface, sequelizeDataTypes) => queryInterface.removeColumn('mfa_transactions', 'deleted_at'),
};
