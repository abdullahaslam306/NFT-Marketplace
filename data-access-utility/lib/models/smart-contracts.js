const { configs } = require('backend-utility');

const { enums } = configs;
const { SmartContractIdentity, SmartContractTypes, TokenProtocol } = enums;

const { ERC721, ERC1155 } = TokenProtocol;
const { CUSTOM, PLATFORM } = SmartContractTypes;
const { INTERNAL, EXTERNAL } = SmartContractIdentity;

module.exports = (sequelize, sequelizeDataTypes) => {
  const smartContracts = sequelize.define('smart_contracts', {
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
    'address': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    'platform_name': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'name': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'platform_logo': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'token_protocol': {
      type: sequelizeDataTypes.ENUM,
      values: [ERC721, ERC1155],
      allowNull: false,
    },
    'type': {
      type: sequelizeDataTypes.ENUM,
      values: [CUSTOM, PLATFORM],
      allowNull: false,
      defaultValue: CUSTOM,
    },
    'identity': {
      type: sequelizeDataTypes.ENUM,
      values: [INTERNAL, EXTERNAL],
      allowNull: false,
      defaultValue: EXTERNAL,
    },
    'is_active': {
      type: sequelizeDataTypes.BOOLEAN,
      defaultValue: true,
    },
    'smart_contract_abi_id': {
      type: sequelizeDataTypes.INTEGER,
      references: {
        model: 'smart_contract_abis',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    paranoid: true,
  });
  smartContracts.associate = (models) => {
    smartContracts.belongsToMany(models.user, { foreignKey: 'smart_contract_id', through: 'user_smart_contracts' });
    smartContracts.belongsTo(models.smart_contract_abis, { as: 'smart_contract_abi', foreignKey: 'smart_contract_abi_id' });
  };

  return smartContracts;
};
