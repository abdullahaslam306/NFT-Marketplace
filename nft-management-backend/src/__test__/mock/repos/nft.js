/* eslint-disable consistent-return */
const { mockData } = require('../models/nft');

module.exports = dbMock => {
  const mockNftModel = dbMock.define('nft', mockData, { autoQueryFallback: false });

  mockNftModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      // successful
      if (queryOptions[0].where.uid === 'cb484627-f436-48cf-990f-92ca35d86216' 
      && queryOptions[0].where.user_id === '231') {
        return mockNftModel.build({
          id : 12,
          uid : 'cb484627-f436-48cf-990f-92ca35d86216',
          title : 'ashas-nft-new',
          description : null,
          user_id : 231,
          secondary_sale_royalty : 20.0,
          total_editions : 222,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'live',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
        });
      }
      if (queryOptions[0].where.uid === 'cb484627-f436-48cf-990f-92ca35d86217' 
      && queryOptions[0].where.user_id === '231') {
        return mockNftModel.build({
          id : 12,
          uid : 'cb484627-f436-48cf-990f-92ca35d86217',
          title : 'ashas-nft-new-draft',
          description : null,
          user_id : 231,
          secondary_sale_royalty : 20.0,
          total_editions : 222,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'draft',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
        });
      }
      if (queryOptions[0].where.uid === 'cb484627-f436-48cf-990f-92ca35d86217' 
      && queryOptions[0].where.user_id === 2) {
        return mockNftModel.build({
          id : 12,
          uid : 'cb484627-f436-48cf-990f-92ca35d86217',
          title : 'ashas-nft-new-draft',
          description : null,
          user_id : 231,
          secondary_sale_royalty : 20.0,
          total_editions : 10,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'lazy',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
        });
      }
      if (queryOptions[0].where.uid === 'cb484627-f436-48cf-990f-92ca35d86218' 
       && queryOptions[0].where.user_id === 2) {
        return mockNftModel.build({
          id : 12,
          uid : 'cb484627-f436-48cf-990f-92ca35d86218',
          title : 'ashas-nft-new-draft',
          description : null,
          user_id : 231,
          secondary_sale_royalty : 20.0,
          total_editions : 10,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'draft',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
        });
      }
      return null;
    }

 if (query === 'findAndCountAll') {
      // successful
      if (queryOptions[0].where.user_id === 2
      && JSON.stringify(queryOptions[0].where.id) == JSON.stringify([2,3]) && JSON.stringify(queryOptions[0].where.smart_contract_id)== JSON.stringify([2,3])) {
         return { count :2, rows: [mockNftModel.build({
          id : 2,
          uid : 'cb484627-f436-48cf-990f-92ca35d86219',
          title : 'Nft Title',
          description : null,
          user_id : 2,
          secondary_sale_royalty : 20.0,
          total_editions : 3,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'draft',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
          nft_assets : [],
          nft_owners :[],
        }), 
        mockNftModel.build({
          id : 3,
          uid : 'cb484627-f436-48cf-990f-92ca35d86217',
          title : 'Nft Title',
          description : null,
          user_id : 2,
          secondary_sale_royalty : 2.0,
          total_editions : 4,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'lazy',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
          nft_assets : [],
          nft_owners: [],
        })]};
      }

       if (queryOptions[0].where.user_id === 5
      && JSON.stringify(queryOptions[0].where.id) == JSON.stringify([2,3]) && JSON.stringify(queryOptions[0].where.smart_contract_id)== JSON.stringify([2,3])) {
         return { count :2, rows: [mockNftModel.build({
          id : 2,
          uid : 'cb484627-f436-48cf-990f-92ca35d86219',
          title : 'Nft Title',
          description : null,
          user_id : 5,
          secondary_sale_royalty : 20.0,
          total_editions : 3,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'draft',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
          nft_assets : [],
          nft_owners :[],
        }), 
        mockNftModel.build({
          id : 3,
          uid : 'cb484627-f436-48cf-990f-92ca35d86217',
          title : 'Nft Title',
          description : null,
          user_id : 5,
          secondary_sale_royalty : 2.0,
          total_editions : 4,
          has_unlockable_content : false,
          unlockable_content : null,
          signature : null,
          status : 'lazy',
          created_at : new Date(),
          updated_at : new Date(),
          tags : null,
          properties : null,
          lazy_minted_at : null,
          minted_at : null,
          nft_assets : [],
          nft_owners: [],
        })]};
      }
    }
  });
  return mockNftModel;
};