/**
 * Migration to add network column in wallets table
 */

const { configs } = require('backend-utility');

const { enums } = configs;
const { BlockChainNetwork } = enums;
const { ETHEREUM } = BlockChainNetwork;

module.exports = {
  up: async (queryInterface, sequelizeDataTypes) => queryInterface.addColumn('wallets', 'network', {
    type: sequelizeDataTypes.ENUM,
    allowNull: false,
    values: [ETHEREUM],
    defaultValue: ETHEREUM,
  }),

  down: async (queryInterface, sequelizeDataTypes) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('wallets', 'network', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_wallets_network;', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
