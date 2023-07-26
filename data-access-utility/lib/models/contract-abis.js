module.exports = (sequelize, sequelizeDataTypes) => {
  const SmartContractAbis = sequelize.define('smart_contract_abis', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'contract_address': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
      defaultValue: null,
      unique: true,
    },
    'abi': {
      type: sequelizeDataTypes.JSONB,
      allowNull: false,
    },
    'token_protocol': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: true,
  });

  return SmartContractAbis;
};
