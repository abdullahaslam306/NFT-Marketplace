/**
 * Class to access and manage nft collaborator info
 */

const {
  CommonError, helpers, errors,
} = require('backend-utility');

const { isValid, isValidErrorCode, isValidArray } = helpers.functions;
const { CreateNftCollaboratorException } = errors.codes;

class NftCollaborator {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.nft_collaborator = null; // TODO: Remove this
  }

  /**
    * Delete nft collaborator
    * @param {Number} nftId
    * @param {Object} transaction
    * @returns {Boolean}
    */
  async delete(nftId, transaction = null) {
    const where = {};
    if (isValid(nftId) === true) {
      where.nft_id = nftId;
      await this.dbInstance.nft_collaborator.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
    * Associate collaborators in bulk with nft
    * @param {Number} nftId
    * @param {Array of nftCollaborator} nftCollaborators
    * @param {Boolean} throwError
    * @param {Object} errorCode
    * @returns {nftAsset}
    */
  async associateCollaborators(nftId, nftCollaborators, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftCollaboratorException;
    const Collaborators = nftCollaborators.map((collaborator) => ({
      nft_id: nftId,
      user_id: collaborator.dataValues.id,
    }));
    const nftCollaboratorBulk = await this.dbInstance.nft_collaborator.bulkCreate(Collaborators, { transaction });
    if (isValidArray(nftCollaboratorBulk) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return nftCollaboratorBulk;
  }

  /**
   * Get nft collaborator user id
   * @param {Object} nft collaborator
   * @param {Number} defaultValue
   * @returns {Number} Returns nft colloborator user id
   */
  getUserId(nftCollaborator = null, defaultValue = null) {
    let value = defaultValue;
    const nftCollaboratorInstance = isValid(nftCollaborator) === true ? nftCollaborator : this.nftCollaborator;
    if (isValid(nftCollaboratorInstance) === true) {
      value = nftCollaboratorInstance.get('user_id', defaultValue);
    }
    return value;
  }
}

module.exports = NftCollaborator;
