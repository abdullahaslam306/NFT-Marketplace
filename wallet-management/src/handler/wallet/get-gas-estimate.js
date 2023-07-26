/**
 *  handler for getting the current gas estimation from blockchain
 */

const ethers = require('ethers');
const Vandium = require('vandium');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { repositories } = require('data-access-utility');
const {
  helpers, meta, configs, errors, CommonError,
} = require('backend-utility');

const { walletHelper } = require('../../helpers');
const { TOKEN_URI: defaultTokenUri } = require('../../common/default');
const { validationMessages } = require('../../common/validation-code/en');

const { PROVIDER } = process.env;
const { functions, responses } = helpers;
const { getTokenProtocolByEditions, getUserId } = functions;

const { BASE_GAS_PRICE } = configs.defaults;
const { InvalidActionSpecified, NftAlreadyMintedException, TransferNftNotLiveException } = errors.codes;
const {
  GasFeeEstimationActions, NftStatus, SmartContractTypes, SmartContractIdentity,
} = configs.enums;
const { SEND_CRYPTO, SEND_NFT, MINT_NFT } = GasFeeEstimationActions;
const { success: successResponse, error: errorResponse } = responses;

/**
 * Get nft info by uid
 * @param connection
 * @param nftUid
 * @param includeSmartContract
 * @returns
 */
const getNftInfo = async (connection, nftUid, includeSmartContract) => {
  const nftRepo = new repositories.Nft(connection);
  const smartContractRepo = new repositories.SmartContract(connection);
  const smartContractAbiRepo = new repositories.SmartContractAbi(connection);

  const nftInfo = await nftRepo.getByUid(nftUid, null, false, false, includeSmartContract, true, null, false);
  const nftId = nftRepo.getId(nftInfo);
  const status = nftRepo.getStatus(nftInfo);
  const tokenId = nftRepo.getTokenId(nftInfo);
  const editions = nftRepo.getTotalEditions(nftInfo);
  const nftSmartContract = nftRepo.getNftSmartContracts(nftInfo);
  const contractAddress = smartContractRepo.getAddress(nftSmartContract);
  const smartContractAbiInfo = smartContractRepo.getSmartContractAbi(nftSmartContract);
  const contractAbi = smartContractAbiRepo.getSmartContractAbi(smartContractAbiInfo);

  return {
    status,
    nftId,
    tokenId,
    editions,
    contractAbi,
    contractAddress,
  };
};

/**
 * Get contract instance of ethers lib
 * @param contractAddress
 * @param contractAbi
 * @param userId
 */
const getEthersContractAndWalletAddress = async (contractAddress, contractAbi, userId) => {
  const { wallet, walletAddress } = await walletHelper.getUserWalletInfo(userId.toString());
  const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
  return {
    contract,
    walletAddress,
  };
};

const action = async (event, context, connection) => {
  let response = {};
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    let nftInfo;
    let gasLimit;
    let tokenProtocol;
    const smartContractRepo = new repositories.SmartContract(connection);
    const smartContractAbiRepo = new repositories.SmartContractAbi(connection);

    const userId = getUserId(context);
    const {
      action: estimateAction, editions, fiat, nftUid, destinationWalletAddress,
    } = event.queryStringParameters;

    const defaultProvider = ethers.getDefaultProvider(PROVIDER);
    const feeData = await defaultProvider.getFeeData();
    const maxPriorityFeePerGas = ethers.BigNumber.from(feeData.maxPriorityFeePerGas).toNumber();
    const gasPrice = ethers.BigNumber.from(feeData.gasPrice).toNumber();
    const gasPriceInEth = ethers.utils.formatEther(gasPrice);
    const maxPriorityFeePerGasInEth = ethers.utils.formatEther(maxPriorityFeePerGas);
    const avgPrice = Number(maxPriorityFeePerGasInEth) + Number(gasPriceInEth);

    pino.info({ maxPriorityFeePerGas });
    pino.info({ maxPriorityFeePerGasInEth });
    pino.info({ gasPrice });
    pino.info({ gasPriceInEth });
    pino.info({ avgPrice });

    switch (estimateAction) {
      case SEND_CRYPTO:
        pino.info('Estimating crypto gas fee');
        gasLimit = BASE_GAS_PRICE;
        break;
      case MINT_NFT:
        pino.info('Estimating mint nft gas fee');
        tokenProtocol = getTokenProtocolByEditions(editions);
        nftInfo = await getNftInfo(connection, nftUid, false);
        pino.info({ userId });
        pino.info({ ...nftInfo });
        if (nftInfo.status === NftStatus.LIVE_LOCKED) {
          throw new CommonError(NftAlreadyMintedException);
        }
        const smartContract = await smartContractRepo.getByCriteria(null, tokenProtocol, SmartContractTypes.PLATFORM, SmartContractIdentity.INTERNAL, true, true, null, null, false, null, true);
        const contractAddress = smartContractRepo.getAddress(smartContract);
        const smartContractAbi = smartContractRepo.getSmartContractAbi(smartContract);
        const contractAbi = smartContractAbiRepo.getSmartContractAbi(smartContractAbi);
        const { contract: mintContract } = await getEthersContractAndWalletAddress(contractAddress, contractAbi, userId);
        gasLimit = await walletHelper.getGasLimitMintNft(mintContract, nftInfo.nftId, tokenProtocol, editions, defaultTokenUri);
        break;
      case SEND_NFT:
        pino.info('Estimating send nft gas fee');
        nftInfo = await getNftInfo(connection, nftUid, true);
        pino.info({ userId });
        pino.info({ ...nftInfo });
        if (nftInfo.status !== NftStatus.LIVE_LOCKED) {
          throw new CommonError(TransferNftNotLiveException);
        }
        tokenProtocol = getTokenProtocolByEditions(nftInfo.editions);
        const { contract: transferContract, walletAddress } = await getEthersContractAndWalletAddress(nftInfo.contractAddress, nftInfo.contractAbi, userId);
        gasLimit = await walletHelper.getGasLimitTransferNft(transferContract, nftInfo.tokenId, tokenProtocol, editions, walletAddress, destinationWalletAddress);
        break;
      default:
        throw new CommonError(InvalidActionSpecified);
    }

    const gasEstimateEth = gasLimit * avgPrice;
    pino.info({ gasEstimateEth });
    const roundedGasEstimateEth = gasEstimateEth.toPrecision(6);
    pino.info({ roundedGasEstimateEth });
    const gasEstimateGWei = ethers.utils.parseUnits(roundedGasEstimateEth, 9).toString();
    pino.info({ gasEstimateGWei });
    const gasEstimateFiat = await walletHelper.ETH_FIAT(Number(roundedGasEstimateEth), fiat);
    pino.info({ gasEstimateFiat });

    const responseData = {
      EstimateInETH: gasEstimateEth,
      EstimateInGWEI: gasEstimateGWei,
      Fiat: gasEstimateFiat,
    };
    response = successResponse('GasEstimate', responseData);
  } catch (exp) {
    pino.error(exp);
    response = errorResponse(exp);
  }
  return response;
};

/**
 * Request validation schema
 */
const validationSchema = () => {
  const currenciesList = meta.currencies.getAll();
  return {
    queryStringParameters: {
      fiat: Vandium.types.string()
        .allow(...currenciesList.map(currency => currency.code))
        .only()
        .required()
        .error(validationError => helpers.joi.makeValidationMessage(validationMessages, validationError, 'currency')),
      action: Vandium.types.string().trim().required()
        .valid(...Object.values(GasFeeEstimationActions))
        .error(validationError => helpers.joi.makeValidationMessage(validationMessages, validationError, 'gas_estimate')),
      editions: Vandium.types.any()
        .when('action', {
          is: Vandium.types.string().valid(SEND_NFT, MINT_NFT),
          then: Vandium.types.number().required().min(1),
        })
        .error(validationError => helpers.joi.makeValidationMessage(validationMessages, validationError, 'gas_estimate')),
      nftUid: Vandium.types.any()
        .when('action', {
          is: Vandium.types.string().valid(SEND_NFT, MINT_NFT),
          then: Vandium.types.string().required().guid({ version: 'uuidv4' }),
        })
        .error(validationError => helpers.joi.makeValidationMessage(validationMessages, validationError, 'gas_estimate')),
      destinationWalletAddress: Vandium.types.string().trim()
        .when('action', {
          is: Vandium.types.string().valid(SEND_NFT),
          then: Vandium.types.string().trim().required().custom(helpers.joi.customValidationEthAddress),
        })
        .error(validationErrors => helpers.joi.makeValidationMessage(validationMessages, validationErrors, 'gas_estimate')),
    },
  };
};

module.exports = {
  action,
  validationSchema,
};
