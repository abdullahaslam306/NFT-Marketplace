const pg = require('pg');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const { env } = process;

const {
  BLOCOMMERCE_DB_PORT: port,
  BLOCOMMERCE_DB_HOSTNAME: host,
  BLOCOMMERCE_DB_USERNAME: username,
  BLOCOMMERCE_DB_PASSWORD: password,
  BLOCOMMERCE_DB_NAME: databaseName,
  BLOCOMMERCE_DB_MIN_CONNECTIONS_POOL: minConnectionsPool,
  BLOCOMMERCE_DB_MAX_CONNECTIONS_POOL: maxConnectionsPool,
  BLOCOMMERCE_DB_CONNECTION_IDLE_TIME: connectionIdleTime,
  BLOCOMMERCE_DB_CONNECTION_ACQUIRE_TIME: connectionAquireTime,
} = env;

function openConnection() {
  const connection = {};
  const sequelize = new Sequelize(databaseName, username, password, {
    port,
    host,
    dialect: 'postgres',
    dialectModule: pg,
    pool: {
      min: minConnectionsPool || 0,
      max: maxConnectionsPool || 3,
      idle: connectionIdleTime || 1000,
      acquire: connectionAquireTime || 20000,
    },
    define: {
      underscored: true,
      timestamps: false,
      paranoid: false,
    },
  });

  fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach((file) => {
      // eslint-disable-next-line
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes,
      );
      connection[model.name] = model;
    });

  Object.keys(connection).forEach((modelName) => {
    if (connection[modelName].associate) {
      connection[modelName].associate(connection);
    }
  });

  connection.sequelize = sequelize;
  connection.Sequelize = Sequelize;

  return connection;
}

function closeConnection(connection) {
  return connection.sequelize.close();
}

module.exports = { openConnection, closeConnection };
