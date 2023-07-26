/**
 * Migration to create users table
 */

const { configs } = require('backend-utility');

const { enums } = configs;

const {
  INITIATED, OPEN, CLOSED, PENDING, LOCKED, APPROVED,
} = enums.AccountStatus;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('users', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'uid': {
        type: sequelizeDataTypes.UUID,
        allowNull: false,
      },
      'first_name': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'middle_name': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'last_name': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'email': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      'email_verified': {
        type: sequelizeDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      'phone': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'phone_verified': {
        type: sequelizeDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      'mfa_enabled': {
        type: sequelizeDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      'address': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'city': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'state': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'country': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'zip': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'twitter': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'facebook': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'instagram': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'picture': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'bio': {
        type: sequelizeDataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      'default_language': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'default_currency': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'is_merchant': {
        type: sequelizeDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      'is_customer': {
        type: sequelizeDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      'status': {
        type: sequelizeDataTypes.ENUM,
        values: [INITIATED, OPEN, APPROVED, PENDING, LOCKED, CLOSED],
        defaultValue: INITIATED,
      },
      'created_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'updated_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
      },
      'deleted_at': {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('users');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_user_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
