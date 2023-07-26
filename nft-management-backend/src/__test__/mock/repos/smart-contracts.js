/* eslint-disable consistent-return */
const { mockData } = require('../models/smart-contracts');

module.exports = dbMock => {
  const mockSmartContractModel = dbMock.define('smart_contracts', mockData, { autoQueryFallback: false });
  mockSmartContractModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      // successful
      if (queryOptions[0].where.platform_name === 'Blocommerce' 
      && queryOptions[0].where.token_protocol === 'erc1155') {
        return mockSmartContractModel.build({
        id: 2,
        uid: '123e3144-3511-4613-9643-28d008710b1d',
        address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
        platform_name: 'Blocommerce',
        name: 'Blocommerce',
        platform_logo: 'logo',
        token_protocol: 'erc1155',
        type: 'platform'
        });
      }
    }

    if (query === 'findAll') {
      // successful
      if (queryOptions[0].where.is_active === true && queryOptions[0].include[0].where.id === 2) {
        return [mockSmartContractModel.build({

          id: 2,
          uid: '123e3144-3511-4613-9643-28d008710b1d',
          address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
          platform_name: 'Blocommerce',
          name: 'Blocommerce',
          platform_logo: 'logo',
          token_protocol: 'erc1155',
          type: 'platform',
        }),
        mockSmartContractModel.build({
            id: 3,
            uid: 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d1',
            platform_name: 'Blocommerce',
            name: 'Blocommerce',
            platform_logo: 'logo',
            token_protocol: 'erc721',
            type: 'platform',
        })];
      }

       if (queryOptions[0].where.is_active === true && queryOptions[0].include[0].where.id === 5 &&  queryOptions[0].where.uid === 'fa75bf1d-8f61-4734-98cb-191bb7db6849\',\'fa75bf1d-8f62-4734-98cb-191bb7db6849') {
        return [mockSmartContractModel.build({

          id: 2,
          uid: '123e3144-3511-4613-9643-28d008710b1d',
          address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
          platform_name: 'Blocommerce',
          name: 'Blocommerce',
          platform_logo: 'logo',
          token_protocol: 'erc1155',
          type: 'platform',
        }),
        mockSmartContractModel.build({
            id: 3,
            uid: 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d1',
            platform_name: 'Blocommerce',
            name: 'Blocommerce',
            platform_logo: 'logo',
            token_protocol: 'erc721',
            type: 'platform',
        })];
      }

       if (queryOptions[0].where.is_active === true && queryOptions[0].include[0].where.id === 5) {
        return [mockSmartContractModel.build({

          id: 2,
          uid: '123e3144-3511-4613-9643-28d008710b1d',
          address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d0',
          platform_name: 'Blocommerce',
          name: 'Blocommerce',
          platform_logo: 'logo',
          token_protocol: 'erc1155',
          type: 'platform',
        }),
        mockSmartContractModel.build({
            id: 3,
            uid: 'fa75bf1d-8f62-4734-98cb-191bb7db6849',
            address: '0x758d895286c8D1CE088a3BCb84924C5DF0aAD5d1',
            platform_name: 'Blocommerce',
            name: 'Blocommerce',
            platform_logo: 'logo',
            token_protocol: 'erc721',
            type: 'platform',
        })];
      }
      return null;
    }
  })
  return mockSmartContractModel;
}