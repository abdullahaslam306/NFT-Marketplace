module.exports = (sequelize, sequelizeDataTypes) => {
  const KmsKeys = sequelize.define('kms_keys', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'key_id': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
      defaultValue: null,
    },
    'data_keys_created': {
      type: sequelizeDataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
  });

  return KmsKeys;
};
