/* eslint-disable consistent-return */
const { mockData } = require('../models/nft_section');

module.exports = dbMock => {
  const mockNftSectionModel = dbMock.define('nft_section', mockData, { autoQueryFallback: false });

  mockNftSectionModel.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findOne') {
      // successful
      if (queryOptions[0].where.uid === '01e22cc1-a319-4861-a4e4-6bac73ae485') {
        return mockNftSectionModel.build({
          id: 1,
          uid: '01e22cc1-a319-4861-a4e4-6bac73ae485',
          nft_id: 12,
          title: 'NFT Section 1.0',
          content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      return null;
    }
    else if (query === 'findAll') {
      // successful
      if (queryOptions[0].where.nft_id === 12) {
        return [mockNftSectionModel.build({
          id: 1,
          uid: '01e22cc1-a319-4861-a4e4-6bac73ae485',
          nft_id: 12,
          title: 'NFT Section 1.0',
          content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
          created_at: new Date(),
          updated_at: new Date(),
        }), 
        mockNftSectionModel.build({
          id: 2,
          uid: '01e22cc1-a319-4861-a4e4-6bac73ae486',
          nft_id: 12,
          title: 'NFT Section 2.0',
          content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
          created_at: new Date(),
          updated_at: new Date(),
        })];
      }
      return null;
    }
    else if (query === 'destroy') {
      // successful
      if (queryOptions[0].where.uid === '01e22cc1-a319-4861-a4e4-6bac73ae485') {
        return true;
      }
      return null;
    }
    else if (query === 'count') {
      // successful
      if (queryOptions[0].where.nft_id === 12) {
        return 1;
      }
      return null;
    }
    else if (query === 'create') {
      if (queryOptions[0].where.nft_id === 12) {
        return 1;
      }
      return null;
    }
    
    
  });

  return mockNftSectionModel;
};