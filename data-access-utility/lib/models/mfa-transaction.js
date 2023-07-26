const { configs } = require('backend-utility');
const { Sequelize } = require('sequelize');

const { enums } = configs;
const {
  UPDATE_PASSWORD, UPDATE_PHONE, SEND_CRYPTO, FORGOT_PASSWORD, SEND_NFT,
} = enums.MfaTransactionAction;

module.exports = (sequelize, sequelizeDataTypes) => {
  const mfaTransaction = sequelize.define('mfa_transaction', {
    'uid': {
      type: sequelizeDataTypes.UUID,
      primaryKey: true,
      allowNull: false,
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
    'email': {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    'email_code': {
      type: sequelizeDataTypes.STRING(6),
      allowNull: false,
    },
    'phone': {
      type: sequelizeDataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    'phone_code': {
      type: sequelizeDataTypes.STRING(6),
      allowNull: true,
      defaultValue: null,
    },
    'action': {
      type: sequelizeDataTypes.ENUM,
      values: [FORGOT_PASSWORD, UPDATE_PASSWORD, UPDATE_PHONE, SEND_CRYPTO, SEND_NFT],
      allowNull: false,
    },
    'verified_at': {
      type: sequelizeDataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    timestamps: true,
    paranoid: true,
  });

  mfaTransaction.associate = (models) => {
    mfaTransaction.belongsTo(models.user, { foreignKey: 'user_id' });
  };

  return mfaTransaction;
};
