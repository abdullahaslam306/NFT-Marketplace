/**
 *  helper methods for wallet handlers
 */

const ethers = require('ethers');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { UserWalletRepo } = require('dynamo-access-utility');
const {
  BlockChainError, CommonError, configs, helpers, errors,
} = require('backend-utility');

const { functions, kms } = helpers;
const { isValid } = functions;
const { NoAssociatedWalletException, WalletNotFoundException } = errors.codes;

const { PROVIDER } = process.env;
const provider = ethers.getDefaultProvider(PROVIDER);

const { blockchain, keyManagement, paymentGateway } = require('../services');

const { TokenProtocol } = configs.enums;
const {
  createWallet,
  getNFTBalance,
  getBalanceInEth,
  transferERC721NFT,
  transferERC1155NFT,
} = blockchain;

const {
  encryptData,
  decryptData,
} = keyManagement;

/**
 * Function decides if the request is for ERC721 or for ERC1155 based on the editions of tokens
 *
 * @param {String} to
 * @param {Number} tokenId
 * @param {Number} editions
 * @param {String} privateKey
 * @returns
 */
const transferNFT = async (to, tokenId, editions, privateKey) => {
  let response = null;
  if (editions > 1) {
    response = await transferERC1155NFT(to, tokenId, editions, privateKey);
  } else {
    response = await transferERC721NFT(to, tokenId, privateKey);
  }
  return response;
};

/**
 * Function returns the current gas fee on the Ethereum network
 */
const gasEstimation = async () => {
  const gasPrice = await blockchain.provider.getGasPrice();
  return {
    ETH: blockchain.ethers.utils.formatEther(gasPrice),
    WEI: blockchain.ethers.utils
      .parseEther(blockchain.ethers.utils.formatEther(gasPrice))
      .toString(),
  };
};

/**
 * Function converts Ethers to fiat
 * @param {Float} ETH
 * @param {Float} Fiat
 * @returns
 */
const ETH_FIAT = async (ETH, Fiat) => {
  const converter = await paymentGateway.CryptoToFiat();
  const fiat = `ETH${Fiat}`;
  return parseFloat(ETH) / parseFloat(converter[fiat]);
};

/**
 * Function converts Fiat to ETH
 *
 * @param {Float} ETH
 * @param {Float} Fiat
 * @returns
 */
const USD_ETH = async (ETH, Fiat) => {
  const converter = await paymentGateway.CryptoToFiat();
  const fiat = `${Fiat}ETH`;
  return converter[fiat];
};

/**
 * Function sends a request to WYRE to generate a refill URL
 * @param {object} body
 * @returns
 */
const refillWalletEth = body => paymentGateway.refillETH(body);

/**
 * Get estimated gas fee to mint nft for given contract, tokenId and protocol
 * @param contract
 * @param tokenId
 * @param protocol
 * @param editions
 * @param tokenUri
 * @returns estimated gas fee
 */
const getGasLimitMintNft = async (contract, tokenId, protocol, editions, tokenUri) => {
  try {
    let gasLimit;

    switch (protocol) {
      case TokenProtocol.ERC721:
        gasLimit = await contract.estimateGas.mint(tokenId, tokenUri);
        break;
      case TokenProtocol.ERC1155:
        gasLimit = await contract.estimateGas.mint(tokenId, editions, tokenUri);
        break;
      default:
    }

    gasLimit = ethers.BigNumber.from(gasLimit).toNumber();
    return gasLimit;
  } catch (error) {
    pino.error(error);
    throw new BlockChainError(error);
  }
};

/**
 * Get estimated gas fee to transfer nft for given contract and protocol
 * @param contract
 * @param tokenId
 * @param protocol
 * @param editions
 * @param fromWalletAddress
 * @param toWalletAddress
 * @returns estimated gas fee
 */
const getGasLimitTransferNft = async (contract, tokenId, protocol, editions, fromWalletAddress, toWalletAddress) => {
  try {
    let gasLimit;

    switch (protocol) {
      case TokenProtocol.ERC721:
        gasLimit = await contract.estimateGas.transferFrom(fromWalletAddress, toWalletAddress, tokenId);
        break;
      case TokenProtocol.ERC1155:
        gasLimit = await contract.estimateGas.safeTransferFrom(fromWalletAddress, toWalletAddress, tokenId, editions, '0x00');
        break;
      default:
    }

    gasLimit = ethers.BigNumber.from(gasLimit).toNumber();
    return gasLimit;
  } catch (exp) {
    pino.error(exp);
    throw new BlockChainError(exp);
  }
};

/**
 * Get user wallet
 * @param userId
 * @returns
 */
const getUserWallet = async userId => {
  let wallet;
  try {
    const userWallet = new UserWalletRepo();
    // Getting Keys from Dynamo and Decrypting them
    const userEncryptedData = await userWallet.getUserWallet(userId);
    if (isValid(userEncryptedData) === false) {
      throw new CommonError(WalletNotFoundException);
    }
    const { root_key: userEncryptedKmsRootKey, data_key: userEncryptedDataKey, private_data: userEncryptedPrivateData } = userEncryptedData;
    const { Plaintext: decryptedPaintText } = await kms.decryptDataKeys(userEncryptedDataKey, userEncryptedKmsRootKey);
    const userDecryptedWallet = await kms.decryptData(decryptedPaintText, userEncryptedPrivateData);

    wallet = JSON.parse(userDecryptedWallet.toString());
  } catch (exp) {
    pino.error(exp);
    throw new CommonError(NoAssociatedWalletException);
  }
  return wallet;
};

/**
 * Get user wallet
 * @param userId
 * @returns
 */
const getUserWalletInfo = async userId => {
  let wallet;
  let walletAddress;

  try {
    const walletFromDynamo = await getUserWallet(userId);
    const { privateKey } = walletFromDynamo;
    wallet = new ethers.Wallet(privateKey, provider);
    walletAddress = wallet.address;
  } catch (exp) {
    pino.error(exp);
    throw new CommonError(NoAssociatedWalletException);
  }
  return {
    wallet,
    walletAddress,
  };
};

module.exports = {
  USD_ETH,
  ETH_FIAT,
  encryptData,
  decryptData,
  transferNFT,
  createWallet,
  getNFTBalance,
  gasEstimation,
  getBalanceInEth,
  refillWalletEth,
  getUserWalletInfo,
  getGasLimitMintNft,
  getGasLimitTransferNft,
};
