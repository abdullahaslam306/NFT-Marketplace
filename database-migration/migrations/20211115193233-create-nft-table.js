/**
 * Migration to create nfts table
 */

const { configs } = require('backend-utility');

const { enums } = configs;

const {
  DRAFT, LAZY_MINTED, LIVE_LOCKED, PENDING,
} = enums.NftStatus;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('nfts', {
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
      'title': {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
      },
      'description': {
        type: sequelizeDataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      'user_id': {
        type: sequelizeDataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'secondary_sale_royalty': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      'total_editions': {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      'has_lockable_content': {
        type: sequelizeDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      'lockable_content': {
        type: sequelizeDataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      'signature': {
        type: sequelizeDataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      'status': {
        type: sequelizeDataTypes.ENUM,
        values: [DRAFT, LAZY_MINTED, LIVE_LOCKED, PENDING],
        defaultValue: DRAFT,
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
      await queryInterface.dropTable('nfts', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_nfts_status;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
