/*
* Allowing null for following columns in nft-transaction-history table:
*  1. block_number
*  2. token_protocol
*/
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN block_number DROP NOT NULL, ALTER COLUMN token_protocol DROP NOT NULL;', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN block_number SET DEFAULT NULL, ALTER COLUMN token_protocol SET DEFAULT NULL;', { transaction });

      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN block_number DROP DEFAULT, ALTER COLUMN token_protocol DROP DEFAULT;', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE nft_transaction_history ALTER COLUMN block_number SET NOT NULL, ALTER COLUMN token_protocol SET NOT NULL;', { transaction });

      await transaction.commit();
    } catch (exp) {
      await transaction.rollback();
      throw exp;
    }
  },
};
