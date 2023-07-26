/**
 * Migration to create stores table
 */
module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('stores', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'uid': {
        type: sequelizeDataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      'user_id': {
        type: sequelizeDataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'name': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      'domain': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'logo': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'description': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
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
  down: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.dropTable('stores');
  },
};
