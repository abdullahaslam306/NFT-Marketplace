/**
 * Migration to change column type of secondary_sale_royalty to floating point
 */

const up = async (queryInterface, sequelizeDataTypes) => {
  await queryInterface.changeColumn('nfts', 'secondary_sale_royalty', {
    type: sequelizeDataTypes.FLOAT(),
    allowNull: false,
  });
};

const down = async (queryInterface, sequelizeDataTypes) => {
  await queryInterface.changeColumn('nfts', 'secondary_sale_royalty', {
    type: sequelizeDataTypes.INTEGER(),
    allowNull: false,
  });
};

module.exports = {
  up,
  down,
};
