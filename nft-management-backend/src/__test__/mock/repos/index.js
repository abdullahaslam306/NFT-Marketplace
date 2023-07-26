const fs = require('fs');
const path = require('path');
const SequelizeMock = require('sequelize-mock');

const basename = path.basename(__filename);
const mockSequelize = new SequelizeMock();

const openConnection = () => {
  const connection = {};

  fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach(file => {
      // eslint-disable-next-line
      const model = require(path.join(__dirname, file))(mockSequelize);
      connection[model.name] = model;
    });

  Object.keys(connection).forEach(modelName => {
    if (connection[modelName].associate) {
      connection[modelName].associate(connection);
    }
  });

  connection.sequelize = mockSequelize;
  return connection;
};

module.exports = {
  openConnection,
};