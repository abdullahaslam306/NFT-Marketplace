/* eslint-disable consistent-return */
const { tableSchema } = require('../models/user');

module.exports = mockSequelize => {
  const mockUserModel = mockSequelize.define('user', tableSchema, { autoQueryFallback: false });
  mockUserModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      if (queryOptions[0].where.id === 2) {
        return mockUserModel.build({
          id: 2,
          uid: 'd2b1ce47-badb-4c1f-bea3-ed718be831d6',
          phone: '+923136643156',
          email: 'testuser2@gmail.com',
          phone_verified: false,
          smart_contracts: [{
            id: 2,
            uid: '123e3144-3511-4613-9643-28d008710b1d',
            address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
            platform_name: 'Blocommerce',
            name: 'Blocommerce',
            platform_logo: 'logo',
            token_protocol: 'erc1155',
            type: 'platform',
          }, {
            id: 3,
            uid: '123e3144-3511-4613-9643-28d008710b1f',
            address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d2',
            platform_name: 'Blocommerce',
            name: 'Blocommerce',
            platform_logo: 'logo',
            token_protocol: 'erc721',
            type: 'platform',
          }],
        });
      }

      if (queryOptions[0].where.id === 3) {
        return mockUserModel.build({
          id: 2,
          uid: 'd2b1ce47-badb-4c1f-bea3-ed718be831d6',
          phone: '+923136643156',
          email: 'testuser2@gmail.com',
          phone_verified: false,
          smart_contracts: null,
        });
      }
    }
  });
  return mockUserModel;
};
