/**
 * Migration to make user_id column nullable  and add bucket_name column in assets
 */

const up = async (queryInterface, sequelizeDataTypes) => {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    await queryInterface.changeColumn('assets', 'user_id', {
      type: sequelizeDataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
        deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
      },
    }, { transaction });

    await queryInterface.addColumn('assets', 'bucket_name', {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
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
    await queryInterface.changeColumn('assets', 'user_id', {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        deferrable: sequelizeDataTypes.Deferrable.INITIALLY_IMMEDIATE,
      },
    }, { transaction });

    await queryInterface.removeColumn('assets', 'bucket_name', { transaction });

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
