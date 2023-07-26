/**
 * Migration to create smart_contracts table
 */
const { configs } = require('backend-utility');

const { enums } = configs;
const { SmartContractTypes, TokenProtocol } = enums;

const { CUSTOM, PLATFORM } = SmartContractTypes;
const { ERC721, ERC1155 } = TokenProtocol;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('smart_contracts', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'uid': {
        type: sequelizeDataTypes.UUID,
        allowNull: false,
        uinque: true,
      },
      'address': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'platform_name': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'name': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'platform_logo': {
        type: sequelizeDataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      'token_protocol': {
        type: sequelizeDataTypes.ENUM,
        values: [ERC721, ERC1155],
        allowNull: false,
      },
      'type': {
        type: sequelizeDataTypes.ENUM,
        values: [CUSTOM, PLATFORM],
        allowNull: false,
        defaultValue: PLATFORM,
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

  down: async (queryInterface, sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('smart_contracts', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_smart_contracts_type;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_smart_contracts_token_protocol;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
