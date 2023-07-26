/* eslint-disable consistent-return */
const { mockData } = require('../models/smart-contracts');

module.exports = dbMock => {
  const mockSmartContractModel = dbMock.define('smart_contracts', mockData, { autoQueryFallback: false });
  mockSmartContractModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      // smart contract already exist
      if (queryOptions[0].where.address === '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b') {
        return mockSmartContractModel.build({
          id: 2,
          uid: '123e3144-3511-4613-9643-28d008710b1d',
          address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
          platform_name: 'Blocommerce',
          name: 'Blocommerce',
          platform_logo: 'logo',
          token_protocol: 'erc1155',
          type: 'platform',
        });
      }
      return null;
    }
    if (query === 'findAndCountAll') {
      if (queryOptions[0].include[0].where.id === 2 && queryOptions[0].where.is_active === true) {
        return {
          count: 2,
          rows: [mockSmartContractModel.build({
            id: 2,
            uid: '123e3144-3511-4613-9643-28d008710b1d',
            address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
            platform_name: 'Blocommerce',
            name: 'Blocommerce',
            platform_logo: 'logo',
            token_protocol: 'erc1155',
            type: 'platform',
            user: {
		          id: 2,
		          uid: 'd2b1ce47-badb-4c1f-bea3-ed718be831d6',
		          phone: '+923136643156',
		          email: 'testuser2@gmail.com',
		          phone_verified: false,
		          },
          }), mockSmartContractModel.build({
            id: 3,
            uid: '123e3144-3511-4613-9643-28d008710b1d',
            address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d1',
            platform_name: 'Blocommerce',
            name: 'Blocommerce',
            platform_logo: 'logo',
            token_protocol: 'erc721',
            type: 'platform',
            user: {
		          id: 2,
		          uid: 'd2b1ce47-badb-4c1f-bea3-ed718be831d6',
		          phone: '+923136643156',
		          email: 'testuser2@gmail.com',
		          phone_verified: false,
		          },
          })],
        };
      }
      if (queryOptions[0].include[0].where.id === 3 && queryOptions[0].where.is_active === true) {
        return {
          count: 0,
          rows: null,
        };
      }
      return null;
    }
  });
  return mockSmartContractModel;
};
