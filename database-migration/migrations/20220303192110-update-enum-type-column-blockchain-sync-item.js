/**
 * Migration for updating enum of type column in blockchain_sync_item table
 */
const { configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { NftSyncStage } = configs.enums;
const {
  HISTORICAL_NFT_SYNC, NFT_ASSET_SYNC, NFT_TRANSACTION_SYNC, OWNED_NFT_SYNC,
} = NftSyncStage;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('blockchain_sync_items', 'type', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_items_type;', { transaction });

      await queryInterface.addColumn('blockchain_sync_items', 'type', {
        type: sequelizeDataTypes.ENUM,
        values: [HISTORICAL_NFT_SYNC, NFT_ASSET_SYNC, NFT_TRANSACTION_SYNC, OWNED_NFT_SYNC],
        allowNull: false,
        defaultValue: OWNED_NFT_SYNC,
      }, { transaction });
      await transaction.commit();
    } catch (error) {
      pino.error(error);
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('blockchain_sync_items', 'type', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_blockchain_sync_items_type;', { transaction });

      await queryInterface.addColumn('blockchain_sync_items', 'type', {
        type: sequelizeDataTypes.ENUM,
        // BREAKING CHANGE
        // These enums were updated
        values: ['nft', 'transaction_sync'],
        allowNull: false,
      }, { transaction });
      await transaction.commit();
    } catch (error) {
      pino.error(error);
      await transaction.rollback();
      throw error;
    }
  },
};
