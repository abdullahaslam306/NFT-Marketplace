/**
 * Class to manage batch meta
 */

const Sequelize = require('sequelize');
const { CommonError, errors, helpers } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { CreateBatchException } = errors.codes;
const { isValidArray, isValidErrorCode, isValid } = helpers.functions;

class BlockchainSyncItem {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.blockchainSyncItem = null;
  }

  /**
   * Create new blockchain sync item
   * @param {Number} blockchainSyncId
   * @param {String} type
   * @param {SequelizeTransaction} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   */
  async create(blockchainSyncId, type, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : CreateBatchException;
    const data = {
      ...(isValid(type) && { type }),
      blockchain_sync_id: blockchainSyncId,
      started_at: new Date().toISOString(),
    };

    this.blockchainSyncItem = await this.dbInstance.blockchain_sync_items.create(data, { transaction });

    if (isValid(this.blockchainSyncItem) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return this.blockchainSyncItem;
  }

  /**
   * Update blockchainSyncItem record
   * @param {Object} blockchainSyncItem
   * @param {Object} meta
   * @param {Object} transaction
   */
  async update(blockchainSyncItem, meta = null, transaction = null) {
    const blockchainSyncItemData = {
      ...(isValid(meta) && { meta }),
    };

    this.blockchainSyncItem = await blockchainSyncItem.update(blockchainSyncItemData, { transaction });
    return this.blockchainSyncItem;
  }

  /**
   * Update blockchainSyncItem record
   * @param {number} blockchainSyncItemId
   * @param {Object} meta
   * @param {Object} transaction
   */
  async updateById(blockchainSyncItemId, meta = null, status = null, setStartedAt = false, setEndedAt = false, transaction = null) {
    const blockchainSyncItemData = {
      ...(isValid(meta) && { meta }),
      ...(isValid(status) && { status }),
      ...(setEndedAt === true && { ended_at: new Date().toISOString() }),
      ...(setStartedAt === true && { started_at: new Date().toISOString() }),
    };

    const where = {
      id: blockchainSyncItemId,
    };

    this.blockchainSyncItem = await this.dbInstance.blockchain_sync_items.update(blockchainSyncItemData, {
      ...(isValid(where) && { where }),
      transaction,
    });
    return this.blockchainSyncItem;
  }

  /**
   * Get count by status
   * @param {Number} blockchainSyncId
   * @param {SequelizeTransaction} transaction
   */
  async getStatusCountBySyncId(blockchainSyncId, returnOnlyCount = true, transaction = null) {
    let response = null;
    const itemCountByStatus = {
      draft: 0,
      failed: 0,
      completed: 0,
      inprogress: 0,
    };
    const syncItemsCount = await this.dbInstance.blockchain_sync_items.findAll({
      where: {
        blockchain_sync_id: blockchainSyncId,
      },
      attributes: [
        'status',
        [Sequelize.fn('count', Sequelize.col('status')), 'item_count'],
      ],
      group: ['status'],
      ...(isValid(transaction) && { transaction }),
    });

    if (returnOnlyCount === true) {
      if (isValidArray(syncItemsCount) === true) {
        syncItemsCount.forEach((syncCountItem) => {
          const status = this.getStatus(syncCountItem);
          const itemCount = this.getItemCount(syncCountItem);
          const exists = Object.prototype.hasOwnProperty.call(itemCountByStatus, status);
          pino.info(`STATUS: ${status} | ITEM COUNT: ${itemCount} | EXISTS: ${exists}`);

          if (Object.prototype.hasOwnProperty.call(itemCountByStatus, status) === true) {
            itemCountByStatus[status] = itemCount;
          }
        });
        response = itemCountByStatus;
      }
    } else {
      response = syncItemsCount;
    }

    return response;
  }

  /**
   * Get id for the provided batch meta value
   * @param {Object} blockchainSyncItem
   * @param {Number} defaultValue
   * @returns
   */
  getId(blockchainSyncItem = null, defaultValue = null) {
    let value = null;
    const blockchainSyncItemInstance = isValid(blockchainSyncItem) ? blockchainSyncItem : this.blockchainSyncItem;
    if (isValid(blockchainSyncItemInstance) === true) {
      value = blockchainSyncItemInstance.get('id', defaultValue);
    }
    return value;
  }

  /**
   * Get status for the provided batch meta value
   * @param {Object} blockchainSyncItem
   * @param {String} defaultValue
   * @returns
   */
  getStatus(blockchainSyncItem, defaultValue = null) {
    let value = null;
    const blockchainSyncItemInstance = isValid(blockchainSyncItem) ? blockchainSyncItem : this.blockchainSyncItem;
    if (isValid(blockchainSyncItemInstance) === true) {
      value = blockchainSyncItemInstance.get('status', defaultValue);
    }
    return value;
  }

  /**
   * [PRIVATE] Get item count from
   * Only to be used with getStatusCountBySyncId
   * @param {Object} blockchainSyncItem
   * @param {Number} defaultValue
   * @returns
   */
  getItemCount(blockchainSyncItem, defaultValue = 0) {
    let value = null;
    const blockchainSyncItemInstance = isValid(blockchainSyncItem) ? blockchainSyncItem : this.blockchainSyncItem;
    if (isValid(blockchainSyncItemInstance) === true) {
      value = blockchainSyncItemInstance.get('item_count', defaultValue);
    }
    return value;
  }
}

module.exports = BlockchainSyncItem;
