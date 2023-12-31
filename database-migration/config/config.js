const {
  BLOCOMMERCE_DB_PORT: port,
  BLOCOMMERCE_DB_HOSTNAME: host,
  BLOCOMMERCE_DB_USERNAME: username,
  BLOCOMMERCE_DB_PASSWORD: password,
  BLOCOMMERCE_DB_NAME: databaseName,
} = process.env;

module.exports = {
  'local': {
    'host': host,
    'port': port,
    'username': username,
    'password': password,
    'database': databaseName,
    'dialect': 'postgres',
    'migrationStorageTableName': 'sequelize_migrations',
    'define': {
      'underscored': true,
      'timestamps': true,
      'paranoid': true,
    },
    'LOG_LEVEL': 'trace',
  },
  'Development': {
    'username': username,
    'password': password,
    'database': databaseName,
    'host': host,
    'port': port,
    'dialect': 'postgres',
    'migrationStorageTableName': 'sequelize_migrations',
    'define': {
      'underscored': true,
      'timestamps': true,
      'paranoid': true,
    },
    'LOG_LEVEL': 'trace',
  },
  'Staging': {
    'username': username,
    'password': password,
    'database': databaseName,
    'host': host,
    'port': port,
    'dialect': 'postgres',
    'migrationStorageTableName': 'sequelize_migrations',
    'define': {
      'underscored': true,
      'timestamps': true,
      'paranoid': true,
    },
    'LOG_LEVEL': 'trace',
  },
  'Production': {
    'username': username,
    'password': password,
    'database': databaseName,
    'host': host,
    'port': port,
    'dialect': 'postgres',
    'migrationStorageTableName': 'sequelize_migrations',
    'define': {
      'underscored': true,
      'timestamps': true,
      'paranoid': true,
    },
    'LOG_LEVEL': 'trace',
  },
};
