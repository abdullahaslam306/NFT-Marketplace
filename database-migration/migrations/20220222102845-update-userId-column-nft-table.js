/**
 * Migration to change column type of email_code and phone_code to string
 */

const up = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('nfts', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const down = async (queryInterface, Sequelize) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('nfts', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }, { transaction });
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  up,
  down,
};
