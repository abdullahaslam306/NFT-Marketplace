/**
 * Migration to change column type of name to Nullable.
 */

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  await queryInterface.changeColumn('wallets', 'name', {
    type: sequelizeDataTypes.STRING,
    allowNull: true,
  }, { transaction });
};

const down = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  await queryInterface.changeColumn('wallets', 'name', {
    type: sequelizeDataTypes.STRING,
    allowNull: false,
  }, { transaction });
};

module.exports = {
  up,
  down,
};
