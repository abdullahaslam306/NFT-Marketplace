const { Sequelize } = require('sequelize');

module.exports = (sequelize, sequelizeDataTypes) => {
  const customers = sequelize.define('customer', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'sid': {
      type: sequelizeDataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: { isUUID: 4 },
      defaultValue: sequelizeDataTypes.UUIDV4,
    },
    'user_id': {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  }, {
    timestamps: true,
  });

  customers.associate = (models) => {
    customers.belongsTo(models.user);
  };

  return customers;
};
