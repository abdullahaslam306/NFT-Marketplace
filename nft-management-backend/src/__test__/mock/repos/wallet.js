/* eslint-disable consistent-return */
const { mockData } = require('../models/wallet');

module.exports = dbMock => {
  const mockWalletModel = dbMock.define('wallet', mockData, { autoQueryFallback: false });

  mockWalletModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    console.log(query,queryOptions[0].where)
     if (query === 'findOne') {
        if (queryOptions[0].where.user_id === 2 
      && queryOptions[0].where.status === 'connected') {
        return mockWalletModel.build({
            'id': 2,
            'uid': 'fa75bf1d-8f61-4734-98cb-191bb7db6849',
            'user_id': 1,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d8',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        })
     }
    }
    if (query === 'findAll') {
      // successful
      if (queryOptions[0].where.user_id === 2 
      && queryOptions[0].where.status === 'connected') {
        return [mockWalletModel.build({
            'id': 2,
            'uid': 'fa75bf1d-8f61-4734-98cb-191bb7db6849',
            'user_id': 1,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d8',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        }), 
        mockWalletModel.build({
            'id': 3,
            'uid': 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            'user_id': 1,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        })];
      }

         if (queryOptions[0].where.user_id === 4 
      && queryOptions[0].where.status === 'connected') {
        return [mockWalletModel.build({
            'id': 2,
            'uid': 'fa75bf1d-8f61-4734-98cb-191bb7db6849',
            'user_id': 1,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d8',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        }), 
        mockWalletModel.build({
            'id': 3,
            'uid': 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            'user_id': 1,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        })];
      }

       if (queryOptions[0].where.user_id === 5 
      && queryOptions[0].where.status === 'connected'
      &&  queryOptions[0].where.uid === 'fa75bf1d-8f61-4734-98cb-191bb7db6849\',\'fa75bf1d-8f62-4734-98cb-191bb7db6849') {
        return [mockWalletModel.build({
            'id': 2,
            'uid': 'fa75bf1d-8f61-4734-98cb-191bb7db6849',
            'user_id': 1,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d8',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        }), 
        mockWalletModel.build({
            'id': 3,
            'uid': 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            'user_id': 1,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        })];
      }

          if (queryOptions[0].where.user_id === 5 
      && queryOptions[0].where.status === 'connected') {
        return [mockWalletModel.build({
            'id': 2,
            'uid': 'fa75bf1d-8f61-4734-98cb-191bb7db6849',
            'user_id': 5,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d8',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        }), 
        mockWalletModel.build({
            'id': 3,
            'uid': 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            'user_id': 5,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        })];
      }

       if (queryOptions[0].where.user_id === 6 
      && queryOptions[0].where.status === 'connected') {
        return [mockWalletModel.build({
            'id': 2,
            'uid': 'fa75bf1d-8f61-4734-98cb-191bb7db6849',
            'user_id': 5,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d8',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        }), 
        mockWalletModel.build({
            'id': 3,
            'uid': 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            'user_id': 5,
            'address': '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d9',
            'network':'eth',
            'public_key': null,
            'wallet_type': 'blocommerce',
            'status': 'connected',
            'name': 'walletName',
        })];
      }

      return null
    }
  }) 
 return mockWalletModel;
}