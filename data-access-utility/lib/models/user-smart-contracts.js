const { Sequelize } = require('sequelize');

module.exports = (sequelize, sequelizeDataTypes) => {
  const userSmartContracts = sequelize.define('user_smart_contracts', {
    'user_id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    'smart_contract_id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: 'smart_contracts',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  });

  userSmartContracts.associate = (models) => {
    userSmartContracts.hasOne(models.user, { foreignKey: 'id' });
    userSmartContracts.hasMany(models.smart_contracts, { foreignKey: 'id' });
  };

  return userSmartContracts;
};
