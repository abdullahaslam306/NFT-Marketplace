const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { smartContracts } = require('./data/smart-contracts.seed');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let query = '';
    let createdAt = null;
    let updatedAt = null;

    smartContracts.forEach(smartContract => {
      createdAt = moment().format();
      updatedAt = moment().format();

      query += `INSERT INTO "smart_contracts" ("uid", "address", "platform_name", "token_protocol", "type", "identity", "created_at", "updated_at")
         VALUES ('${uuidv4()}', '${smartContract.address}', '${smartContract.platform_name}', '${smartContract.token_protocol}', '${smartContract.type}','${smartContract.identity}', '${createdAt}', '${updatedAt}')
         ON CONFLICT (address)
         DO UPDATE SET "platform_name" = '${smartContract.platform_name}',  "token_protocol" = '${smartContract.token_protocol}', 
         "type" = '${smartContract.type}', "identity" = '${smartContract.identity}',"updated_at" = '${updatedAt}';`;
    });
    await queryInterface.sequelize.query(query);
  },

  down: async (queryInterface, Sequelize) => queryInterface.bulkDelete('smart_contracts', []),
};
