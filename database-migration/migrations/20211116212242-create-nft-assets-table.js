/**
 * Migration to create nft assets table
 */

const { configs } = require('backend-utility');

const { enums } = configs;

const { MAIN, AUXILIARY } = enums.NftAssetType;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    await queryInterface.createTable('nft_assets', {
      'id': {
        type: sequelizeDataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      'nft_id': {
        type: sequelizeDataTypes.INTEGER,
        references: {
          model: 'nfts',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'asset_id': {
        type: sequelizeDataTypes.INTEGER,
        references: {
          model: 'assets',
          key: 'id',
          deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      'asset_type': {
        type: sequelizeDataTypes.ENUM,
        values: [MAIN, AUXILIARY],
        defaultValue: MAIN,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('nft_assets', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_nft_assets_asset_type;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
