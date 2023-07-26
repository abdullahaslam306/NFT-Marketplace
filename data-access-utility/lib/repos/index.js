const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

const repositories = {};
let repository = {};
fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    repository = require(path.join(__dirname, file)); //eslint-disable-line
    repositories[repository.name] = repository;
  });

module.exports = repositories;
