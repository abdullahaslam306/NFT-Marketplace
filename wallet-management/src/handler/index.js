/**
 *  vandium handler
 */

const { helpers } = require('backend-utility');
const { database } = require('data-access-utility');

const { action: listHandler } = require('./wallet/list');
const { action: ratesHandler } = require('./exchange/get-crypto-rates');
const { action: createWalletHandler } = require('./wallet/create-wallet');
const { action: addHandler, validationSchema: addWalletValidationSchema } = require('./wallet/add');
const { action: updateHandler, validationSchema: updateWalletValidationSchema } = require('./wallet/update');
const { action: refillEthHandler, validationSchema: refillEtherValidationSchema } = require('./wallet/refill-eth');
const { action: transferEthersHandler, validationSchema: transferEtherValidationSchema } = require('./wallet/transfer-eth');
const { action: getGasEstimateHandler, validationSchema: getGasEstimateValidationSchema } = require('./wallet/get-gas-estimate');
const { action: getCryptoRateHandler, validationSchema: getCryptoRateValidationSchema } = require('./exchange/get-crypto-rates');
const { action: getWalletEthBalanceHandler, validationSchema: getEthBalanceValidationSchema } = require('./wallet/get-eth-balance');
const { action: listSmartContractsHandler, validationSchema: listSmartContractsValidationSchema } = require('./smart-contract/list');
const { action: getWalletNFTBalanceHandler, validationSchema: getNftBalanceValidationSchema } = require('./wallet/get-nft-balance');
const { action: disconnectSmartContractHandler, validationSchema: disconnectSmartContractValidationSchema } = require('./smart-contract/disconnect');
const { action: importCustomSmartContractsHandler, validationSchema: importCustomSmartContractValidationSchema } = require('./smart-contract/import-custom');

let dbConnection = {};

const createWalletHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET((event, context) => createWalletHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

const getGasEstimateHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(getGasEstimateValidationSchema(), async (event, context) => getGasEstimateHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

const getWalletEthBalanceHandle = helpers.vandium.init()
  .POST(getEthBalanceValidationSchema(), event => getWalletEthBalanceHandler(event));

const getWalletNFTBalanceHandle = helpers.vandium.init()
  .POST(getNftBalanceValidationSchema(), event => getWalletNFTBalanceHandler(event));

const refillEthHandle = helpers.vandium.init()
  .POST(refillEtherValidationSchema(), event => refillEthHandler(event));

const transferEthersHandle = helpers.vandium
  .init()
  .before(() => { dbConnection = database.openConnection(); })
  .POST(transferEtherValidationSchema(), async (event, context) => transferEthersHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

const getRatesHandle = helpers.vandium.init()
  .GET(event => ratesHandler(event));

const getCryptoRateHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(getCryptoRateValidationSchema(), async (event, context) => getCryptoRateHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

const walletHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .POST(addWalletValidationSchema(), (event, context) => addHandler(event, context, dbConnection))
  .PATCH(updateWalletValidationSchema(), (event, context) => updateHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

const walletsHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(async (event, context) => listHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

const smartContractsHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .POST(importCustomSmartContractValidationSchema(), (event, context) => importCustomSmartContractsHandler(event, context, dbConnection))
  .GET(listSmartContractsValidationSchema(), (event, context) => listSmartContractsHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

const smartContractHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .DELETE(disconnectSmartContractValidationSchema(), (event, context) => disconnectSmartContractHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

module.exports = {
  walletHandle,
  walletsHandle,
  getRatesHandle,
  refillEthHandle,
  createWalletHandle,
  smartContractHandle,
  getCryptoRateHandle,
  smartContractsHandle,
  getGasEstimateHandle,
  transferEthersHandle,
  getWalletNFTBalanceHandle,
  getWalletEthBalanceHandle,
};
