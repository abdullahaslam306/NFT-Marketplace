/**
 * Migration to change column type of email_code and phone_code to string
 */

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('mfa_transactions', 'email_code', {
      type: sequelizeDataTypes.STRING(6),
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

const down = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.sequelize
      .query('ALTER TABLE mfa_transactions ALTER COLUMN email_code TYPE integer USING (trim(email_code)::integer);', { transaction });

    await queryInterface.sequelize
      .query('ALTER TABLE mfa_transactions ALTER COLUMN phone_code TYPE integer USING (trim(phone_code)::integer);', { transaction });

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
