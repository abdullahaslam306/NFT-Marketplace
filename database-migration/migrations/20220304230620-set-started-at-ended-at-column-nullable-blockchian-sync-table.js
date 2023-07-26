/*
* Allowing null for following columns in blockchain_sync table:
*  1. started_at
*  2. ended_at
*/
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TABLE blockchain_sync ALTER COLUMN started_at DROP NOT NULL, ALTER COLUMN ended_at DROP NOT NULL;', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE blockchain_sync ALTER COLUMN started_at SET DEFAULT NULL, ALTER COLUMN ended_at SET DEFAULT NULL;', { transaction });

      await transaction.commit();
    } catch (exp) {
      pino.error(exp);
      await transaction.rollback();
      throw exp;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TABLE blockchain_sync ALTER COLUMN started_at DROP DEFAULT, ALTER COLUMN ended_at DROP DEFAULT;', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE blockchain_sync ALTER COLUMN started_at SET NOT NULL, ALTER COLUMN ended_at SET NOT NULL;', { transaction });

      await transaction.commit();
    } catch (exp) {
      pino.error(exp);
      await transaction.rollback();
      throw exp;
    }
  },
};
