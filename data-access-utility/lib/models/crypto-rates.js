const { configs } = require('backend-utility');

const { enums } = configs;
const { ETH, XRP, BTC } = enums.CryptoSymbols;

module.exports = (sequelize, sequelizeDataTypes) => {
  const cryptoRates = sequelize.define('crypto_rates', {
    'id': {
      type: sequelizeDataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    'crypto': {
      type: sequelizeDataTypes.ENUM,
      values: [ETH, BTC, XRP],
      defaultValue: ETH,
    },
    'crypto_rate_json': {
      type: sequelizeDataTypes.JSONB,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  return cryptoRates;
};
