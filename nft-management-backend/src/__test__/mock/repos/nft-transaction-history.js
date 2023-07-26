/* eslint-disable consistent-return */
const { mockData } = require('../models/nft-transaction-history');

module.exports = dbMock => {
  const mockBlockchainInfoModel = dbMock.define('nft_transaction_history', mockData, { autoQueryFallback: false });
  mockBlockchainInfoModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
     
    }
    return null
})
    return mockBlockchainInfoModel
}