/**
 * Migration to update composite key of nft_owners table
 */

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint('nft_owners', 'nft_owners_pkey', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE nft_owners ADD PRIMARY KEY (nft_id, user_id, wallet_id)', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint('nft_owners', 'nft_owners_pkey', { transaction });
      await queryInterface.sequelize.query('ALTER TABLE nft_owners ADD PRIMARY KEY (nft_id, wallet_address)', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
