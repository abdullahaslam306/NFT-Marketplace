/* eslint-disable consistent-return */
const { mockData } = require('../models/nft-blockchain-info');

module.exports = dbMock => {
  const mockBlockchainInfoModel = dbMock.define('nft_blockchain_info', mockData, { autoQueryFallback: false });
  mockBlockchainInfoModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
     return null
    }
    return null
})
    return mockBlockchainInfoModel
}