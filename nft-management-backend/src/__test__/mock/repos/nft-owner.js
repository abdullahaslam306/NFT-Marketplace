/* eslint-disable consistent-return */
const { mockData } = require('../models/nft-owner');

module.exports = dbMock => {
  const mockNftOwnerModel = dbMock.define('nft_owner', mockData, { autoQueryFallback: false });
  mockNftOwnerModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      // successful
      if (queryOptions[0].where.platform_name === 'Blocommerce' 
      && queryOptions[0].where.token_protocol === 'erc-1155') {
        return mockNftOwnerModel.build({
        id: 2,
        uid: '123e3144-3511-4613-9643-28d008710b1d',
        address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
        platform_name: 'Blocommerce',
        name: 'Blocommerce',
        platform_logo: 'logo',
        token_protocol: 'erc-1155',
        type: 'platform',
        });
      }
    }
      if (query === 'update') {

          // successful
        return mockNftOwnerModel.build({
        id: 2,
        uid: '123e3144-3511-4613-9643-28d008710b1d',
        address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
        platform_name: 'Blocommerce',
        name: 'Blocommerce',
        platform_logo: 'logo',
        token_protocol: 'erc-1155',
        type: 'platform',
        });    
    }
     if (query === 'findAll') {
          if (queryOptions[0].where.user_id === 2 
      && JSON.stringify(queryOptions[0].where.wallet_id)== JSON.stringify([2,3])) {
       return [mockNftOwnerModel.build({
          nft_id: 2,
          wallet_address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
          user_id: 2,
          editions_owned: 2,
          editions_to_sell: 0,
          wallet_id: 2,
        }), 
        mockNftOwnerModel.build({
          nft_id: 3,
          wallet_address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
          user_id: 2,
          editions_owned: 3,
          editions_to_sell: 0,
          wallet_id: 2,
        })];
    }

       if (queryOptions[0].where.user_id === 4 
      && JSON.stringify(queryOptions[0].where.wallet_id)== JSON.stringify([2,3])) {
       return [mockNftOwnerModel.build({
          nft_id: 2,
          wallet_address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
          user_id: 2,
          editions_owned: 2,
          editions_to_sell: 0,
          wallet_id: 2,
        }), 
        mockNftOwnerModel.build({
          nft_id: 3,
          wallet_address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
          user_id: 2,
          editions_owned: 3,
          editions_to_sell: 0,
          wallet_id: 2,
        })];
    }

       if (queryOptions[0].where.user_id === 5 
      && JSON.stringify(queryOptions[0].where.wallet_id)== JSON.stringify([2,3])) {
       return [mockNftOwnerModel.build({
          nft_id: 2,
          wallet_address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
          user_id: 2,
          editions_owned: 2,
          editions_to_sell: 0,
          wallet_id: 2,
        }), 
        mockNftOwnerModel.build({
          nft_id: 3,
          wallet_address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
          user_id: 2,
          editions_owned: 3,
          editions_to_sell: 0,
          wallet_id: 2,
        })];
    }
    return null
  }
})
return mockNftOwnerModel;
}