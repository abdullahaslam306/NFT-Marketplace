/**
 * Migration for updating total editions column to make it nullable to nfts table
 */

const up = async (queryInterface, sequelizeDataTypes) =>
  queryInterface.changeColumn('nfts', 'total_editions', {
    type: sequelizeDataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  });

const down = async (queryInterface, sequelizeDataTypes) =>
  queryInterface.changeColumn('nfts', 'total_editions', {
    type: sequelizeDataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  });

module.exports = {
  up,
  down,
};
