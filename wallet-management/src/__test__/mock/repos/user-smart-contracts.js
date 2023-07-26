/* eslint-disable consistent-return */
const { mockData } = require('../models/user-smart-contracts');

module.exports = dbMock => {
  const mockUserSmartContractModel = dbMock.define('user_smart_contracts', mockData, { autoQueryFallback: false });
  mockUserSmartContractModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      // successful
      if (queryOptions[0].where.user_id === 2
      && queryOptions[0].where.smart_contract_id === 2) {
        return mockUserSmartContractModel.build({
          user_id: 2,
          smart_contract_id: 2,
        });
      }
    }
  });
  return mockUserSmartContractModel;
};
