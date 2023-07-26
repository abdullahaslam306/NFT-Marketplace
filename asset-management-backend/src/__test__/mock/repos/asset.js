/* eslint-disable consistent-return */
const { tableSchema } = require('../models/asset');

module.exports = (mockSequelize) => {
  const assets = mockSequelize.define('asset', tableSchema, { autoQueryFallback: false });
  assets.associate = (models) => {
    assets.belongsTo(models.user, { foreignKey: 'user_id' });
  };

  assets.$queryInterface.$useHandler((query, queryOptions, done) => {
    if (query === 'findAll') {
      if (queryOptions[0].where.user_id === 5 && queryOptions[0].where.name === 'My Assets') {
        return [assets.build({
          id: 1,
          user_id: 5,
          name: 'My Assets'
        })];
      }

      if (queryOptions[0].where.user_id === '1c2b6716-ebad-45bd-920e-9055c5091795'
          && queryOptions[0].where.uid === '3e674622-5dcb-4c07-9d44-fb42add44c88') {
        return assets.build({
          uid: '1c2b6716-ebad-45bd-920e-9055c5091795',
          user_id: '2a0b727e-3503-4aea-ac62-bd68ceeb9785',
          sid: '6b325edd-62d3-4b4c-a2e0-6e1e5d00699e',
        });
      }

      if (queryOptions[0].where.user_id === '2a0b727e-3503-4aea-ac62-bd68ceeb9785'
          && queryOptions[0].where.uid === '3e674622-5dcb-4c07-9d44-fb42add44c88') {
        return assets.build({
          uid: '2a0b727e-3503-4aea-ac62-bd68ceeb9785',
          user_id: '2a0b727e-3503-4aea-ac62-bd68ceeb9785',
          sid: '6b325edd-62d3-4b4c-a2e0-6e1e5d00699e',
        });
      }
      return null;
    }
    
  });
  return assets;
};
