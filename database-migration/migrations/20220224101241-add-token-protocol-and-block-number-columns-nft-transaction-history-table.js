/**
 * Migration for adding
 * block_number,
 * contract_type
 * columns to nft_transaction_history table
*/
const { configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { enums } = configs;
const { ERC721, ERC1155 } = enums.TokenProtocol;

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.addColumn('nft_transaction_history', 'token_protocol', {
      type: sequelizeDataTypes.ENUM,
      values: [ERC721, ERC1155],
      allowNull: false,
      defaultValue: ERC721,
    }, { transaction });

    await queryInterface.addColumn('nft_transaction_history', 'block_number', {
      type: sequelizeDataTypes.INTEGER,
    }, { transaction });

    await transaction.commit();
  } catch (exp) {
    pino.error(exp);
    await transaction.rollback();
    throw exp;
  }
};

const down = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.removeColumn('nft_transaction_history', 'token_protocol', { transaction });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_nft_transaction_history_token_protocol;', { transaction });
    await queryInterface.removeColumn('nft_transaction_history', 'block_number', { transaction });

    await transaction.commit();
  } catch (exp) {
    pino.error(exp);
    await transaction.rollback();
    throw exp;
  }
};

module.exports = {
  up,
  down,
};
