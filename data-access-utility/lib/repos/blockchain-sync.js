/**
 * Class to manage sync
 */

const { CommonError, errors, helpers } = require('backend-utility');
const { isValidArray } = require('backend-utility/lib/helpers/function');

const { CreateSyncException, SyncNotFoundException } = errors.codes;

const { isValidErrorCode, isValid } = helpers.functions;

class BlockchainSync {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.blockchainSync = null;
  }

  /**
   * Create new blockchain sync record
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async create(transaction = null, stage = null, syncItemCount = null, batchIdentifier = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateSyncException;

    const syncData = {
      // nft_sync_started_at: new Date().toISOString(),
      ...(isValid(stage) && { stage }),
      ...(isValid(syncItemCount) && { sync_item_count: syncItemCount }),
      ...(isValid(batchIdentifier) && { batch_identifier: batchIdentifier }),
    };

    this.blockchainSync = await this.dbInstance.blockchain_sync.create(syncData, { transaction });

    if (isValid(this.blockchainSync) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }
    return this.blockchainSync;
  }

  /**
   * Get blockchain sync based on criteria
   * @param {String} status
   * @param {String} stage
   * @param {Number} id
   * @param {Number} batchIdentifier
   * @param {Boolean} includeBlockchainSyncItems
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async getByCriteria(status = null, stage = null, id = null, batchIdentifier = null, includeBlockchainSyncItems = false, blockchainSyncItemsType = null,
    blockchainSyncItemsStatus = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : SyncNotFoundException;
    const where = {
      ...(isValid(id) && { id }),
      ...(isValid(stage) && { stage }),
      ...(isValid(status) && { status }),
      ...(isValid(batchIdentifier) && { batch_identifier: batchIdentifier }),
    };
    let include = [];

    if (includeBlockchainSyncItems === true) {
      include = [
        {
          model: this.dbInstance.blockchain_sync_items,
          where: {
            ...((isValidArray(blockchainSyncItemsType) || isValid(blockchainSyncItemsType)) && { type: blockchainSyncItemsType }),
            ...((isValidArray(blockchainSyncItemsStatus) || isValid(blockchainSyncItemsStatus)) && { status: blockchainSyncItemsStatus }),
          },
        },
      ];
    }

    this.blockchainSync = await this.dbInstance.blockchain_sync.findOne({
      where,
      ...(isValidArray(include) && { include }),
    });

    if (isValid(this.blockchainSync) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return this.blockchainSync;
  }

  /**
   * Update sync record
   * @param {Object} sync
   * @param {String} status
   * @param {Object} transaction
   */
  async update(blockchainSync, status = null, stage = null, itemCount = null, transaction = null) {
    const syncData = {
      ...(isValid(stage) && { stage }),
      ...(isValid(status) && { status }),
      ...(isValid(itemCount) && { sync_item_count: itemCount }),
    };

    this.blockchainSync = await blockchainSync.update(syncData, { transaction });
    return this.blockchainSync;
  }

  /**
   * Update blockchain sync by id
   * @param {Number} blockchainSyncId
   * @param {String} status
   * @param {Number} syncItemCount
   * @param {Boolean} setStartedAt
   * @param {Boolean} setEndedAt
   * @param {Object} transaction
   * @returns
   */
  async updateById(blockchainSyncId, status = null, syncItemCount = null, setStartedAt = false, setEndedAt = false, transaction = null) {
    const syncData = {
      ...(isValid(status) && { status }),
      ...(isValid(syncItemCount) && { sync_item_count: syncItemCount }),
      ...(setEndedAt === true && { ended_at: new Date().toISOString() }),
      ...(setStartedAt === true && { started_at: new Date().toISOString() }),
    };

    this.blockchainSync = await this.dbInstance.blockchain_sync.update(syncData, {
      transaction,
      where: {
        id: blockchainSyncId,
      },
    });

    return this.blockchainSync;
  }

  /**
   * Set Start date and end date for given blockchain sync id
   * @param {Number} blockchainSyncId
   * @param {Boolean} setStartedAt
   * @param {Boolean} setEndedAt
   * @param {Object} transaction
   * @returns
   */
  async setStartOrEndDateById(blockchainSyncId, setStartedAt = false, setEndedAt = false, transaction = null) {
    const syncData = {};
    const where = {
      id: blockchainSyncId,
    };

    if (setStartedAt === true) {
      where.started_at = null;
      syncData.started_at = new Date().toISOString();
    }

    if (setEndedAt === true) {
      where.ended_at = null;
      syncData.ended_at = new Date().toISOString();
    }

    this.blockchainSync = await this.dbInstance.blockchain_sync.update(syncData, { where, transaction });

    return this.blockchainSync;
  }

  // /**
  //  * Update record for transaction sync
  //  * @param {string} blockchainSyncId
  //  * @param {string} status
  //  * @param {number} itemCount
  //  * @param {Boolean} setStartedAt
  //  * @param {Boolean} setEndedAt
  //  * @param {Boolean} transaction
  //  */
  // async updateTransactionSyncById(blockchainSyncId, status = null, itemCount = null, setStartedAt = false, setEndedAt = false, transaction = null) {
  //   await this.updateById(blockchainSyncId, null, null, false, transaction, status, itemCount, setStartedAt, setEndedAt);
  // }

  // /**
  //  * Update record by blockchain sync id
  //  * @param {Number} blockchainSyncId
  //  * @param {String} status
  //  * @param {Number} itemCount
  //  * @param {Boolean} setEndedAt
  //  * @param {SequelizeTransaction} transaction
  //  * @returns
  //  */
  // async findAndUpdateStatus(blockchainSyncId, blockchainSyncItemType = null, blockchainSyncItemStatus = null, transaction = null) {
  //   const where = {
  //     id: blockchainSyncId,
  //   };
  //   const blockchainSync = await this.getByCriteria(null, null, blockchainSyncId, true, blockchainSyncItemType, null, transaction);
  //   const blockchainSyncItems = this.getBlockchainSyncItems(blockchainSync);
  //   if (isValidArray(blockchainSyncItems) === true) {
  //     const inprogressCount = blockchainSyncItems.forEach((blockchainSyncItem) => {

  //     });
  //   }
  //   this.blockchainSync = await this.dbInstance.blockchain_sync.update(syncData, {
  //     transaction,
  //     where: {
  //       id: blockchainSyncId,
  //     },
  //   });

  //   return this.blockchainSync;
  // }

  /**
   * Get id for the provided sync value
   * @param {Object} blockchainSync
   * @param {String} defaultValue
   * @returns
   */
  getId(blockchainSync = null, defaultValue = null) {
    let value = null;
    const blockchainSyncInstance = isValid(blockchainSync) ? blockchainSync : this.blockchainSync;
    if (isValid(blockchainSyncInstance) === true) {
      value = blockchainSyncInstance.get('id', defaultValue);
    }
    return value;
  }

  /**
   * Get batch identifier for the provided blockchain sync
   * @param {Object} blockchainSync
   * @param {String} defaultValue
   * @returns
   */
  getBatchIdentifier(blockchainSync = null, defaultValue = null) {
    let value = null;
    const blockchainSyncInstance = isValid(blockchainSync) ? blockchainSync : this.blockchainSync;
    if (isValid(blockchainSyncInstance) === true) {
      value = blockchainSyncInstance.get('batch_identifier', defaultValue);
    }
    return value;
  }

  /**
   * Get blockchain sync item for the provided sync value
   * @param {Object} blockchainSync
   * @param {String} defaultValue
   * @returns
   */
  getBlockchainSyncItems(blockchainSync = null, defaultValue = null) {
    let value = null;
    const blockchainSyncInstance = isValid(blockchainSync) ? blockchainSync : this.blockchainSync;
    if (isValid(blockchainSyncInstance) === true) {
      value = blockchainSyncInstance.get('blockchain_sync_items', defaultValue);
    }
    return value;
  }

  /**
   * Get blockchain sync status for the provided sync value
   * @param {Object} blockchainSync
   * @param {String} defaultValue
   * @returns
   */
  getStatus(blockchainSync = null, defaultValue = null) {
    let value = null;
    const blockchainSyncInstance = isValid(blockchainSync) ? blockchainSync : this.blockchainSync;
    if (isValid(blockchainSyncInstance) === true) {
      value = blockchainSyncInstance.get('status', defaultValue);
    }
    return value;
  }

  /**
   * Get blockchain sync uid for the provided sync value
   * @param {Object} blockchainSync
   * @param {String} defaultValue
   * @returns
   */
  getUid(blockchainSync = null, defaultValue = null) {
    let value = null;
    const blockchainSyncInstance = isValid(blockchainSync) ? blockchainSync : this.blockchainSync;
    if (isValid(blockchainSyncInstance) === true) {
      value = blockchainSyncInstance.get('uid', defaultValue);
    }
    return value;
  }
}

module.exports = BlockchainSync;
