/**
 * Migration for making type column nullable in assets table
 */
// const Sequelize = require('sequelize');
// const { configs } = require('backend-utility');

const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

// const { NftSyncStatus, NftSyncStage } = configs.enums;
// const { NFT_SYNC, TRANSACTION_SYNC } = NftSyncStage;
// const { COMPLETED, INPROGRESS, FAILED } = NftSyncStatus;

module.exports = {
  async up(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TABLE assets ALTER COLUMN type DROP NOT NULL;', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE assets ALTER COLUMN type SET DEFAULT NULL;', { transaction });
      await transaction.commit();
    } catch (err) {
      pino.error(err);
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, sequelizeDataTypes) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TABLE assets ALTER COLUMN type DROP DEFAULT;', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE assets ALTER COLUMN type SET NOT NULL;', { transaction });
      await transaction.commit();
    } catch (err) {
      pino.error(err);
      await transaction.rollback();
      throw err;
    }
  },
};
