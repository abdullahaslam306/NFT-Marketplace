
const { Op } = require('sequelize');

/**
 * Return object for querying case insensitive values
 * @param {*} searchValue 
 * @returns Object
 */
function getCaseInsensitiveObject(searchValue) {
  return {
    [Op.iLike]: {
      [Op.any]: searchValue,
    },
  };
};

module.exports = {
  getCaseInsensitiveObject,
};
