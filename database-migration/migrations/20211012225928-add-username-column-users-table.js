module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => queryInterface.addColumn('users', 'username', {
    type: sequelizeDataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    unique: true,
  }),

  down: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.removeColumn('users', 'username');
  },
};
