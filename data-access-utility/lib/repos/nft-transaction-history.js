/**
 * Class to access and manage nft transaction history
 */
const { Sequelize, Op } = require('sequelize');

const {
  CommonError, helpers, errors, configs,
} = require('backend-utility');

const { getCaseInsensitiveObject } = require('../../helpers');

const { pagination, ORDERBY } = configs.defaults;
const {
  isValid, isValidArray, isValidErrorCode, isValidObject,
} = helpers.functions;

const { NftTransactionHistoryNotFoundException } = errors.codes;

class NftTransactionHistory {
  constructor(dbConnection) {
    this.dbInstance = dbConnection;
    this.nft_transaction_history = null;
  }

  /**
   * Add blockchain transaction history in bulk
   * @param {Array} nftTransactions
   * @param {Object} transaction
   */
  async bulkCreate(nftTransactions, transaction = null) {
    await this.dbInstance.nft_transaction_history.bulkCreate(nftTransactions, { transaction });
  }

  /**
   * Add blockchain transaction history
   * @param {Number} blockNumber
   * @param {String} tokenProtocol
   * @param {Number} nftId
   * @param {String} eventName
   * @param {String} tokenId
   * @param {String} contractAddress
   * @param {String} fromWalletAddress
   * @param {String} toWalletAddress
   * @param {Number} editions
   * @param {String} transactionHash
   * @param {Number} price
   * @param {Number} gasFee
   * @param {String} etherscanLink
   * @param {String} ipfsLink
   * @param {Object} transaction
   */
  async create(nftId, eventName, tokenId, contractAddress, fromWalletAddress, toWalletAddress, editions,
    transactionHash, price = 0, gasFee = 0, etherscanLink = null, ipfsLink = null, transaction = null,
    blockNumber = null, tokenProtocol = null, eventTime = null) {
    const transactionData = {
      ...(isValid(blockNumber) && { block_number: blockNumber }),
      ...(isValid(tokenProtocol) && { token_protocol: tokenProtocol }),
      token_id: tokenId,
      contract_address: contractAddress,
      event_time: isValid(eventTime) ? eventTime : new Date().toISOString(),
      ...(isValid(nftId) && { nft_id: nftId }),
      ...(isValid(editions) && { editions }),
      ...(isValid(price) && { price }),
      ...(isValid(gasFee) && { gasFee }),
      ...(isValid(ipfsLink) && { ipfs_link: ipfsLink }),
      ...(isValid(etherscanLink) && { etherscan_link: etherscanLink }),
      ...(isValid(eventName) && { event_name: eventName }),
      ...(isValid(transactionHash) && { transaction_hash: transactionHash }),
      ...(isValid(toWalletAddress) && { to_wallet_address: toWalletAddress }),
      ...(isValid(fromWalletAddress) && { from_wallet_address: fromWalletAddress }),
    };

    await this.dbInstance.nft_transaction_history.create(transactionData, { transaction });
  }

  /**
   * Get nft transactions history for given nft
   * @param {String} nftId
   * @param {Number} offset
   * @param {Number} limit
   * @param {String} orderBy
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Object} errorCode
   * @returns {Array<NftTransactionHistory>}
  */
  async getByNftId(nftId, offset = pagination.offset, limit = pagination.limit, orderBy = ORDERBY.DESC, transaction = null, throwError = true, errorCode = null) {
    const errorCodeValue = isValidErrorCode(errorCode) ? errorCode : NftTransactionHistoryNotFoundException;
    const where = {
      nft_id: nftId,
    };
    const order = [['event_time', orderBy]];

    const nftTransactionHistory = await this.dbInstance.nft_transaction_history.findAndCountAll({
      where,
      order,
      offset,
      limit,
    }, { transaction, benchmark: true });

    if (isValidObject(nftTransactionHistory) === false && throwError === true) {
      throw new CommonError(errorCodeValue);
    }

    return nftTransactionHistory;
  }

  /**
   * Get all nft transaction history events based on criteria
   * @param {Number} nftId
   * @param {String} contractAddress
   * @param {String} walletAddress
   * @param {String} event
   */
  async getAllByCriteria(nftId = null, contractAddress = null, walletAddress = null, event = null) {
    let where = {};

    if (isValid(walletAddress) === true) {
      where = {
        [Op.or]: [
          {
            to_wallet_address: getCaseInsensitiveObject(walletAddress),
          },
          {
            from_wallet_address: getCaseInsensitiveObject(walletAddress),
          },
        ],
      };
    }

    if (isValidArray(nftId) === true || (Array.isArray(nftId) === false && isValid(nftId) === true)) {
      where.nft_id = nftId;
    }

    if (isValidArray(contractAddress) === true || (Array.isArray(contractAddress) === false && isValid(contractAddress) === true)) {
      where.contract_address = getCaseInsensitiveObject(contractAddress);
    }

    if (isValid(event) === true) {
      where.event_name = event;
    }

    if (Object.keys(where).length < 1) {
      where = null;
    }

    const nftTransactionHistory = await this.dbInstance.nft_transaction_history.findAll({ where });
    return nftTransactionHistory;
  }

  /**
   * List all nft transactions in paginated manner
   * @param {Array | number} nftId
   * @param {Array | string} contractAddress
   * @param {Array | string} walletAddress
   * @param {string} event
   * @param {string} startDate
   * @param {string} endDate
   * @param {number} offset
   * @param {number} limit
   * @param {string} orderBy
   * @returns
   */
  async listAllByCriteria(nftId = null, contractAddress = null, walletAddress = null, includeNfts = false, startDate = null, endDate = null,
    offset = pagination.offset, limit = pagination.limit, orderBy = ORDERBY.DESC) {
    const where = {};
    const include = [];
    const order = [
      [
        'event_time',
        isValid(orderBy) ? orderBy : ORDERBY.DESC,
      ],
    ];

    if (includeNfts === true) {
      const nftInclude = {
        model: this.dbInstance.nft,
        required: false,
      };
      include.push(nftInclude);
    }

    if (isValid(walletAddress) === true) {
      where[Op.or] = [
        {
          to_wallet_address: getCaseInsensitiveObject(walletAddress),
        },
        {
          from_wallet_address: getCaseInsensitiveObject(walletAddress),
        },
      ];
    }

    if (isValid(startDate) === true && isValid(endDate) === true) {
      where.event_time = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    if (isValidArray(nftId) === true || (Array.isArray(nftId) === false && isValid(nftId) === true)) {
      where.nft_id = nftId;
    }
    if (isValidArray(contractAddress) === true || (Array.isArray(contractAddress) === false && isValid(contractAddress) === true)) {
      where.contract_address = getCaseInsensitiveObject(contractAddress);
    }
    const nftQueryOptions = {
      order,
      ...(isValid(limit) && { limit }),
      ...(isValid(offset) && { offset }),
      ...(isValidArray(include) && { include }),
      ...(Object.keys(where).length > 0 && { where }),
    };

    const nftTransactionHistory = await this.dbInstance.nft_transaction_history.findAndCountAll(nftQueryOptions, { benchmark: true });
    return nftTransactionHistory;
  }

  /**
    * Delete nft transaction history
    * @param {Number} transactionId
    * @param {Object} transaction
    * @returns {Boolean}
  */
  async delete(transactionId, transaction = null) {
    const where = {};
    if (isValid(transactionId) === true) {
      where.id = transactionId;
      await this.dbInstance.nft_transaction_history.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
   * Delete nft transaction history of nftId provided
   * @param {Number} nftId
   * @param {Object} transaction
   */
  async deleteByNftId(nftId, transaction = null) {
    const where = {};
    if (isValid(nftId) === true) {
      where.nft_id = nftId;
      await this.dbInstance.nft_transaction_history.destroy({ where }, { transaction });
    }
    return true;
  }

  /**
   * Update nft transaction history on basis of given criteria
   * @param {Number} nftId
   * @param {String} eventName
   * @param {Number} editions
   * @param {String} contractAddress
   * @param {Object} transaction
   * @param {Number} id
   * @returns
   */
  async update(nftId = null, eventName = null, editions = null, contractAddress = null, transaction = null, id = null) {
    const where = {
      ...(isValid(id) && { id }),
      ...(isValid(eventName) && { event_name: eventName }),
      ...((isValid(nftId) && isValid(id) === false) && { nft_id: nftId }),
    };
    const nftTransactionData = {
      ...(isValid(editions) && { editions }),
      ...((isValid(nftId) && isValid(id) === true) && { nft_id: nftId }),
      ...(isValid(contractAddress) && { contract_address: contractAddress }),
    };
    this.nft_transaction_history = await this.dbInstance.nft_transaction_history.update(nftTransactionData, { where, transaction });
    return this.nft_transaction_history;
  }

  /**
   * Get nft id from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getNftId(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('nft_id', defaultValue);
    }
    return value;
  }

  /**
   * Get event from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getEvent(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('event_name', defaultValue);
    }
    return value;
  }

  /**
   * Get price from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getPrice(nftTransaction, defaultValue = 0.0) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('price', defaultValue);
    }
    return value;
  }

  /**
   * Get price from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getFromWalletAddress(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('from_wallet_address', defaultValue);
    }
    return value;
  }

  /**
   * Get price from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getToWalletAddress(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('to_wallet_address', defaultValue);
    }
    return value;
  }

  /**
   * Get nft transactions data by criteria
   * @param {Object} query
   * @param {String} aggregate
   * @param {Object} transaction
   * @returns {Array<NftTransactionHistory>}
  */
  async getTransactionsData(query, aggregate, transaction = null) {
    const where = query;

    const order = [Sequelize.fn('date_trunc', aggregate, Sequelize.col('event_time'))];

    const nftTransactionStats = await this.dbInstance.nft_transaction_history.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', aggregate, Sequelize.col('event_time')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('event_time')), 'count'],
      ],
      where,
      group: [Sequelize.fn('date_trunc', aggregate, Sequelize.col('event_time'))],
      order,
    }, { transaction, benchmark: true });

    return nftTransactionStats;
  }

  /**
   * Get nft transactions query by criteria
   * @param {Array} walletAddresses
   * @param {Array} smartContractAddress
   * @param {String} startDate
   * @param {String} endDate
   * @param {String} aggregate
   * @param {Object} transaction
   * @returns {Object}
  */
  async getTransactionsAnalytics(walletAddresses = null, smartContractAddress = null, startDate = null, endDate = null, aggregate, transaction = null) {
    let where = {};

    if (isValidArray(walletAddresses) === true) {
      where = Sequelize.or(
        {
          from_wallet_address: getCaseInsensitiveObject(walletAddresses),
        },
        {
          to_wallet_address: getCaseInsensitiveObject(walletAddresses),
        },
      );
    }

    where = {
      ...where,
      ...(isValidArray(smartContractAddress) && { contract_address: getCaseInsensitiveObject(smartContractAddress) }),
    };

    if (isValid(startDate) === true && isValid(endDate) === true) {
      where.event_time = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }

    const transactionsData = await this.getTransactionsData(where, aggregate, transaction);

    return transactionsData;
  }

  /**
   * Get nft financial data by criteria
   * @param {Object} query
   * @param {String} aggregate
   * @param {Object} transaction
   * @returns {Array<NftTransactionHistory>}
  */
  async getFinancialAnalytics(query, aggregate, transaction = null) {
    const where = query;

    const order = [Sequelize.fn('date_trunc', aggregate, Sequelize.col('event_time'))];

    const nftTransactionStats = await this.dbInstance.nft_transaction_history.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', aggregate, Sequelize.col('event_time')), 'date'],
        [Sequelize.fn('SUM', Sequelize.col('price')), 'value'],
      ],
      where,
      group: [Sequelize.fn('date_trunc', aggregate, Sequelize.col('event_time'))],
      order,
    }, { transaction, benchmark: true });

    return nftTransactionStats;
  }

  /**
   * Get nft spendings analytics query stats by criteria
   * @param {Array} walletAddresses
   * @param {Array} smartContractAddress
   * @param {String} startDate
   * @param {String} endDate
   * @param {String} aggregate
   * @param {Object} transaction
   * @returns {Object}
  */
  async getSpendingsAnalytics(walletAddresses = null, smartContractAddress = null, startDate = null, endDate = null, aggregate, transaction = null) {
    const where = {
      to_wallet_address: getCaseInsensitiveObject(walletAddresses),
      ...(isValidArray(smartContractAddress) && { contract_address: getCaseInsensitiveObject(smartContractAddress) }),
    };

    if (isValid(startDate) === true && isValid(endDate) === true) {
      where.event_time = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }
    const financialAnalytics = await this.getFinancialAnalytics(where, aggregate, transaction);

    return financialAnalytics;
  }

  /**
   * Get nft earnings analytics query stats by criteria
   * @param {Array} walletAddresses
   * @param {Array} smartContractAddress
   * @param {String} startDate
   * @param {String} endDate
   * @param {String} aggregate
   * @param {Object} transaction
   * @returns {Object}
  */
  async getEarningsAnalytics(walletAddresses = null, smartContractAddress = null, startDate = null, endDate = null, aggregate, transaction = null) {
    const where = {
      from_wallet_address: getCaseInsensitiveObject(walletAddresses),
      ...(isValidArray(smartContractAddress) && { contract_address: getCaseInsensitiveObject(smartContractAddress) }),
    };

    if (isValid(startDate) === true && isValid(endDate) === true) {
      where.event_time = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
    }
    const financialAnalytics = await this.getFinancialAnalytics(where, aggregate, transaction);

    return financialAnalytics;
  }

  /**
   * [BLOCKCHAIN SYNC] Get transactions by given query parameters
   * Query parameters is array of objects containing smart_contract_type, to_address and transactions_hash
   * Query will be executed using OR between items
   * @param {Array<Records<string, string>>} queryParameters
   * @param {Object} transaction
   * @param {Boolean} throwError
   * @param {Boolean} errorCode
   */
  async getByQueryParameters(queryParameters, transaction = null, throwError = true, errorCode = null) {
    let transactions = [];
    const andQuery = [];

    queryParameters.forEach((queryParam) => {
      andQuery.push({
        [Op.and]: [
          { to_wallet_address: queryParam.toWalletAddress },
          { token_protocol: queryParam.tokenProtocol },
          { transaction_hash: queryParam.transactionHash },
          { token_id: queryParam.tokenId },
        ],
      });
    });

    const where = {
      [Op.or]: andQuery,
    };

    transactions = await this.dbInstance.nft_transaction_history.findAll({
      where,
      attributes: ['to_wallet_address', 'token_protocol', 'transaction_hash', 'token_id'],
      ...(isValid(transaction) && { transaction }),
    }, {
      benchmark: true,
    });
    return transactions;
  }

  /**
   * Get count from given transaction data
   * @param {Object} transactionData
   * @param {String} defaultValue
   * @returns
   */
  getCount(transactionData = null, defaultValue = null) {
    let value = defaultValue;
    if (isValid(transactionData) === true) {
      value = transactionData.get('count', defaultValue);
    }
    return value;
  }

  /**
   * Get value from given transaction data
   * @param {Object} transactionData
   * @param {String} defaultValue
   * @returns
   */
  getValue(transactionData = null, defaultValue = null) {
    let value = defaultValue;
    if (isValid(transactionData) === true) {
      value = transactionData.get('value', defaultValue);
    }
    return value;
  }

  /**
   * Get nft ids from given nft transaction history
   * @param {Array} nfts
   * @returns array of nft ids
   */
  getIds(nfts) {
    let value = [];
    if (isValidArray(nfts) === true) {
      value = nfts.map((nft) => nft.get('nft_id'));
    }
    return value;
  }

  /**
   * Get id from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @param {Boolean} splitted
   * @returns
   */
  getId(nftTransaction, defaultValue = null, splitted = false) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('id', defaultValue);
    }
    if (splitted === true) {
      value = value.split(',');
    }
    return value;
  }

  /**
   * Get contract address from given nft transaction history
   * @param {Array} transaction
   * @param {String} defaultValue
   * @param {Boolean} toLowerCase
   * @returns array of nft ids
   */
  getContractAddress(transaction, defaultValue = null, toLowerCase = false) {
    let value = defaultValue;
    if (isValid(transaction) === true) {
      value = transaction.get('contract_address', defaultValue);
    }
    if (toLowerCase === true) {
      value = value.toLowerCase();
    }
    return value;
  }

  /**
   * Get editions from given nft transaction history
   * @param {Array} transaction
   * @returns array of nft ids
   */
  getEditions(transaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(transaction) === true) {
      value = transaction.get('editions', defaultValue);
    }
    return value;
  }

  /**
   * Get price from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getTransactionHash(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('transaction_hash', defaultValue);
    }
    return value;
  }

  /**
   * Get price from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getTokenProtocol(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('token_protocol', defaultValue);
    }
    return value;
  }

  /**
   * Get price from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getTokenId(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('token_id', defaultValue);
    }
    return value;
  }

  /**
   * Get nft from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getNft(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('nft', defaultValue);
    }
    return value;
  }

  /**
   * Get event time from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getEventTime(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('event_time', defaultValue);
    }
    return value;
  }

  /**
   * Get etherscan link from given nft transaction
   * @param {Object} nftTransaction
   * @param {String} defaultValue
   * @returns
   */
  getEtherscanLink(nftTransaction, defaultValue = null) {
    let value = defaultValue;
    if (isValid(nftTransaction) === true) {
      value = nftTransaction.get('etherscan_link', defaultValue);
    }
    return value;
  }

  /**
   * Get all owned nft's purchase transactions
   * @param {number} nftId
   * @param {Array} contractAddress
   * @param {Array} walletAddress
   * @param {String} event
   * @param {String} orderBy
   * @returns
   */
  async getPurchaseTxsByCriteria(nftId = null, contractAddress = null, walletAddress = null, event = null, orderBy = ORDERBY.DESC) {
    let where = {};

    const order = [['nft_id', orderBy], ['event_time', orderBy]];

    if (isValid(walletAddress) === true) {
      where = {
        to_wallet_address: getCaseInsensitiveObject(walletAddress),
      };
    }

    if (isValidArray(nftId) === true || (Array.isArray(nftId) === false && isValid(nftId) === true)) {
      where.nft_id = nftId;
    }

    if (isValidArray(contractAddress) === true || (Array.isArray(contractAddress) === false && isValid(contractAddress) === true)) {
      where.contract_address = getCaseInsensitiveObject(contractAddress);
    }

    if (isValid(event) === true) {
      where.event_name = event;
    }

    const attributes = [
      Sequelize.literal('DISTINCT ON("nft_id") "nft_transaction_history"."nft_id"'),
      'id',
      'price',
    ];

    const nftTransactionHistory = await this.dbInstance.nft_transaction_history.findAll({ where, order, attributes });
    return nftTransactionHistory;
  }

  /**
   * Get historical transactions from nft transaction history table
   * @param {Array} smartContractAddress
   */
  async getHistoricalNftTransactions(smartContractAddress = null) {
    const attributes = [
      [Sequelize.literal('string_agg(id::text, \',\')'), 'id'],
      'token_id', 'token_protocol', 'contract_address',
    ];
    const where = {
      nft_id: null,
      ...(isValidArray(smartContractAddress) && { contract_address: getCaseInsensitiveObject(smartContractAddress) }),
    };
    const group = ['token_id', 'token_protocol', 'contract_address'];
    const NftHistoricalTransactions = await this.dbInstance.nft_transaction_history.findAll({ where, group, attributes });
    return NftHistoricalTransactions;
  }
}

module.exports = NftTransactionHistory;
