/**
 * Migration to create mfa transaction table
 */

const { configs } = require('backend-utility');

const { enums } = configs;
const {
  UPDATE_PASSWORD, UPDATE_PHONE, SEND_CRYPTO,
} = enums.MfaTransactionAction;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('mfa_transactions', {
      'uid': {
        type: sequelizeDataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      'user_id': {
        type: sequelizeDataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'email': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'email_code': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
      },
      'phone': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'phone_code': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
      },
      'action': {
        type: sequelizeDataTypes.ENUM,
        values: [UPDATE_PASSWORD, UPDATE_PHONE, SEND_CRYPTO],
        allowNull: false,
      },
      'verified_at': {
        type: sequelizeDataTypes.DATE,
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

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('mfa_transactions');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_mfa_transactions_action;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
