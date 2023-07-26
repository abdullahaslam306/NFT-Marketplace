import { ethers } from 'ethers';
import { configs } from 'backend-utility';
import { repositories, database } from 'data-access-utility';

import { logger } from '../../common/utils/logger';
import { TokenInformation } from '../../common/types';
import { getUserWalletInfo, getProviderGasPrice, getTokenProtocol } from '../../common/utils/function';

const { enums } = configs;
const { NftStatus, TokenProtocol } = enums;

/**
 * Handler for minting
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @returns
 */
export const handler = async (event, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  let connection;
  let transaction;
  let contract: ethers.Contract;

  try {
    const { payload } = event;
    const { nftId, userId, editions, tokenUri, signature, to, smartContractAddress, smartContractAbi } = payload;
    logger.info(payload);

    const tokenProtocol = getTokenProtocol(editions);
    const { wallet, walletAddress, Nonce, walletBalanceinWei } = await getUserWalletInfo(userId.toString());
    const parsedWalletWeiBalance: number = parseFloat(walletBalanceinWei);
    logger.info(`Wallet Balance in WEI : ${parsedWalletWeiBalance}`);
    const { maxPriorityFee, maxFee, gasPrice } = await getProviderGasPrice();
    logger.info(`gasPrice : ${gasPrice} | maxPriorityFeePerGas : ${maxPriorityFee} | maxFeePerGas : ${maxFee}`);
    contract = new ethers.Contract(smartContractAddress, smartContractAbi, wallet);

    let receipt;
    let mintedBlockNumber = null;

    if (signature == null) {
      receipt = await mint(tokenProtocol, contract, maxPriorityFee, parsedWalletWeiBalance, Nonce, nftId, editions, tokenUri);
    } else {
      receipt = await mintAndTransfer(tokenProtocol, contract, maxPriorityFee, parsedWalletWeiBalance, Nonce, nftId, editions, tokenUri, walletAddress, to, signature);
    }

    // logger.info(receipt);
    console.log('RECIPT', receipt);
    console.log(` HAS BLOCK # ${Object.prototype.hasOwnProperty.call(receipt, 'blockNumber')}`);
    if (Object.prototype.hasOwnProperty.call(receipt, 'blockNumber') === true) {
      mintedBlockNumber = receipt?.blockNumber;
      console.log(` BLOCK NUMBER MINTED : ${mintedBlockNumber}`);
    }

    connection = database.openConnection();
    const nftRepo = new repositories.Nft(connection);
    const nftBlockchainInfoRepo = new repositories.NftBlockchainInfo(connection);

    transaction = await connection.sequelize.transaction();

    await nftRepo.updateById(nftId, NftStatus.LIVE_LOCKED, true, transaction, true, null, null, null, null, nftId, mintedBlockNumber);
    await nftBlockchainInfoRepo.updateByNftId(nftId, null, null, tokenProtocol, null, null, transaction, true, null, null, new Date().toISOString(), mintedBlockNumber)
    
    await transaction.commit();
  } catch (exp) {
    logger.error(exp);
    if (transaction) {
      await transaction.rollback();
    }
  } finally {
    if (connection) {
      database.closeConnection(connection);
    }
  }
}

/**
 * Mint the given nft on blockchain
 * @param tokenProtocol 
 * @param contract 
 * @param maxPriorityFee 
 * @param parsedWalletWeiBalance 
 * @param Nonce 
 * @param nftId 
 * @param editions 
 * @param tokenUri 
 * @returns 
 */
async function mint(tokenProtocol: string, contract: ethers.Contract, maxPriorityFee: number, parsedWalletWeiBalance: number, Nonce: number, nftId: number, editions: number, tokenUri: string) {
  let blockchainTransaction;

  const estimatedGas: number = await getEstimatedGasFee(contract, nftId, editions, tokenUri);
  logger.info(`Estimated Gas fee: ${estimatedGas}`);
  if (estimatedGas > parsedWalletWeiBalance) {
    throw new Error(`Estimated Gas fee ${estimatedGas} exceeds your current balance`);
  }

  const additionalParams = {
    nonce: Nonce,
    maxPriorityFeePerGas: maxPriorityFee,
    gasLimit: estimatedGas,
  };

  logger.info(additionalParams);
  switch (tokenProtocol) {
    case TokenProtocol.ERC721:
      blockchainTransaction = await contract.mint(nftId, tokenUri, additionalParams);
      break;
    case TokenProtocol.ERC1155:
      blockchainTransaction = await contract.mint(nftId, editions, tokenUri, additionalParams);
      break;
  }
  logger.info(blockchainTransaction);
  const receipt: Record<string, unknown> = await blockchainTransaction.wait();
  logger.info(receipt);
  return receipt;
}

/**
 * Function for min.
 * @param tokenProtocol
 * @param contract
 * @param maxPriorityFee
 * @param walletBalanceinWei
 * @param Nonce
 * @param walletAddress
 * @param to
 * @param nftId
 * @param editions
 * @param tokenUri
 * @param signature
 * @returns
 */
async function mintAndTransfer(tokenProtocol: string, contract: ethers.Contract, maxPriorityFee: number, parsedWalletWeiBalance: number,
  Nonce: number, nftId: number, editions: number, tokenUri: string, walletAddress: string, to: string, signature: string) {
  let blockchainTranscation;

  const estimatedGas: number = await getEstimatedGasFeeMintAndTransfer(contract, nftId, editions, tokenUri, walletAddress, to, signature);
  logger.info(`Estimated Gas fee: ${estimatedGas}`);
  if (estimatedGas > parsedWalletWeiBalance) {
    throw new Error(`Estimated Gas fee ${estimatedGas} exceeds your current balance`);
  }

  const additionalParams = {
    nonce: Nonce,
    maxPriorityFeePerGas: maxPriorityFee,
    gasLimit: estimatedGas,
  };

  switch (tokenProtocol) {
    case TokenProtocol.ERC721:
      blockchainTranscation = await contract.mintAndTransfer(to, { creator: walletAddress, tokenId: nftId }, tokenUri, walletAddress, signature, additionalParams);
      break;
    case TokenProtocol.ERC1155:
      blockchainTranscation = await contract.mintAndTransfer(to, { creator: walletAddress, tokenId: nftId, editions }, tokenUri, walletAddress, signature, additionalParams);
      break;
  }
  const receipt: Record<string, unknown> = await blockchainTranscation.wait();

  return receipt;
}

/**
 * Get estimated gas fee for given contract , nftid and token uri
 * @param contract 
 * @param nftId 
 * @param editions
 * @param tokenUri 
 * @returns estimated gas fee
 */
async function getEstimatedGasFee(contract, nftId: number, editions = 1, tokenUri: string) {
  let estimatedGas: number;
  const tokenProtocol = getTokenProtocol(editions);

  switch (tokenProtocol) {
    case TokenProtocol.ERC721:
      estimatedGas = await contract.estimateGas.mint(nftId, tokenUri);
      break;
    case TokenProtocol.ERC1155:
      estimatedGas = await contract.estimateGas.mint(nftId, editions, tokenUri);
      break;
  }
  estimatedGas = ethers.BigNumber.from(estimatedGas).toNumber();

  return estimatedGas;
}

/**
 * Get estimated gas fee for given contract , nftid and token uri
 * @param contract 
 * @param nftId 
 * @param nftEditions 
 * @param tokenUri 
 * @param from
 * @param to
 * @param signature
 * @returns estimated gas fee
 */
async function getEstimatedGasFeeMintAndTransfer(contract, nftId: number, editions = 1, tokenUri: string, from: string, to: string, signature: string) {
  let estimatedGas: number;
  const tokenProtocol = getTokenProtocol(editions);

  const nftInfo: TokenInformation = {
    creator: from,
    tokenId: nftId
  };

  switch (tokenProtocol) {
    case TokenProtocol.ERC721:
      estimatedGas = await contract.estimateGas.mintAndTransfer(to, nftInfo, tokenUri, from, signature);
      break;
    case TokenProtocol.ERC1155:
      nftInfo.editions = editions;
      estimatedGas = await contract.estimateGas.mintAndTransfer(to, nftInfo, tokenUri, from, signature);
      break;
  }
  estimatedGas = ethers.BigNumber.from(estimatedGas).toNumber();

  return estimatedGas;
}