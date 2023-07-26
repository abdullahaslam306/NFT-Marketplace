const { configs } = require('backend-utility');

const { enums } = configs;
const {
  INITIATED, OPEN, CLOSED, PENDING, LOCKED, APPROVED,
} = enums.AccountStatus;

module.exports = (sequelize, sequelizeDataTypes) => {
  const users = sequelize.define('user', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'uid': {
      type: sequelizeDataTypes.UUID,
      allowNull: false,
      unique: true,
      validate: { isUUID: 4 },
      defaultValue: sequelizeDataTypes.UUIDV4,
    },
    'username': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null,
    },
    'first_name': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'middle_name': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'last_name': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'email': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    'email_verified': {
      type: sequelizeDataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    'phone': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'phone_verified': {
      type: sequelizeDataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    'mfa_enabled': {
      type: sequelizeDataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    'address': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'city': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'state': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'country': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'zip': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'twitter': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'facebook': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'instagram': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'picture': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'bio': {
      type: sequelizeDataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    'default_language': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'default_currency': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'is_merchant': {
      type: sequelizeDataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    'is_customer': {
      type: sequelizeDataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    'status': {
      type: sequelizeDataTypes.ENUM,
      values: [INITIATED, OPEN, APPROVED, PENDING, LOCKED, CLOSED],
      defaultValue: INITIATED,
    },
  }, {
    timestamps: true,
    paranoid: true,
  });

  users.associate = (models) => {
    users.hasOne(models.merchant, { foreignKey: 'id' });
    users.hasOne(models.customer, { foreignKey: 'id' });
    users.hasOne(models.wallet, { foreignKey: 'user_id' });
    users.hasMany(models.asset, { foreignKey: 'user_id' });
    users.hasMany(models.mfa_transaction, { foreignKey: 'user_id' });
    users.belongsToMany(models.smart_contracts, { foreignKey: 'user_id', through: 'user_smart_contracts' });
  };

  return users;
};
