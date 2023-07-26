/**
 * Class to access and manage nft sections
 */

const { CommonError, errors, helpers } = require('backend-utility');

const {
  isValid, isValidErrorCode, isValidArray,
} = helpers.functions;
const { CreateNftSectionException, NftSectionNotFoundException } = errors.codes;

class NftSection {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.nftSection = null;
  }

  /**
   * Create new nft section
   * @param {Number} nftId
   * @param {String} title
   * @param {String} content
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns
   */
  async create(nftId, title = null, content = null, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateNftSectionException;
    const nftSectionData = {
      nft_id: nftId,
    };

    if (isValid(title) === true) {
      nftSectionData.title = title;
    }

    if (isValid(content) === true) {
      nftSectionData.content = content;
    }

    this.nftSection = await this.dbInstance.nft_section.create(nftSectionData, { transaction });

    if (!(this.nftSection instanceof this.dbInstance.nft_section) && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nftSection;
  }

  /**
   * Get total count of sections of nft
   * @param {Number} nftId
   */
  async getCountByNft(nftId) {
    const where = {
      nft_id: nftId,
    };
    const nftSections = await this.dbInstance.nft_section.count({ where });
    return nftSections;
  }

  /**
   * Get sections of an NFT
   * @param {Number} nftId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getAllByNftId(nftId, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftSectionNotFoundException;
    const where = {
      nft_id: nftId,
    };
    const sections = await this.dbInstance.nft_section.findAll({ where });

    if (isValidArray(sections) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return sections;
  }

  /**
   * Delete nft section
   * @param {String} uid
   * @param {Object} transaction
   * @returns {Boolean}
   */
  async delete(uid, transaction = null) {
    const where = { uid };
    if (isValid(uid) === true) {
      await this.dbInstance.nft_section.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
    * Delete nft section
    * @param {Number} nftId
    * @param {Object} transaction
    * @returns {Boolean}
    */
  async deleteSectionByNftId(nftId, transaction = null) {
    if (isValid(nftId) === true) {
      const where = {
        nft_id: nftId,
      };
      await this.dbInstance.nft_section.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
   * Get section of an NFT
   * @param {Number} nftId
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByUid(nftSectionUid, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftSectionNotFoundException;
    const where = {
      uid: nftSectionUid,
    };
    this.nftSection = await this.dbInstance.nft_section.findOne({ where });
    if (isValid(this.nftSection) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.nftSection;
  }

  /**
   * Update nft section
   * @param {Object} nftSection
   * @param {String} title
   * @param {String} content
   * @param {Object} transaction
   * @returns
   */
  async update(nftSection, title = null, content = null, transaction = null) {
    const sectionData = {};

    if (isValid(title) === true) {
      sectionData.title = title;
    }

    if (isValid(content) === true) {
      sectionData.content = content;
    }

    this.nftSection = await nftSection.update(sectionData, { transaction });
    return this.nftSection;
  }
}

module.exports = NftSection;
