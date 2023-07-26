/**
 * Migration to make column nullable - phone and phone_code in mfa_transaction
 */

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('mfa_transactions', 'phone', {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    }, { transaction });

    await queryInterface.changeColumn('mfa_transactions', 'phone_code', {
      type: sequelizeDataTypes.STRING(6),
      allowNull: true,
      defaultValue: null,
    }, { transaction });

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const down = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('mfa_transactions', 'phone', {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    }, { transaction });

    await queryInterface.changeColumn('mfa_transactions', 'phone_code', {
      type: sequelizeDataTypes.STRING(6),
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
