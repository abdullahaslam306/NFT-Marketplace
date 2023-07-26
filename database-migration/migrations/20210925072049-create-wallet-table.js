/**
 * Migration to create wallets table
 */
module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('wallets', {
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
      'address': {
        type: sequelizeDataTypes.STRING,
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
  down: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.dropTable('wallets');
  },
};
