import * as ld from 'lodash';
import { ethers } from 'ethers';
import * as moment from 'moment';
import { repositories } from 'data-access-utility';
import { UserWalletRepo } from 'dynamo-access-utility';
import { CommonError, configs, errors, helpers } from 'backend-utility';

import { logger } from './logger';

const { DateFormat } = configs.defaults;
const { isValid, isValidArray } = helpers.functions;
const { decryptDataKeys, decryptData } = helpers.kms;
const { TokenProtocol, WalletStatus, AggregateFilters } = configs.enums;
const { PROVIDER, BLOCOMMERCE_ERC721_SMART_CONTRACT_ADDRESS, BLOCOMMERCE_ERC1155_SMART_CONTRACT_ADDRESS, PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY } = process.env;
const { NftNotFoundException, NoAssociatedWalletException, WalletNotFoundException, WalletUnavailableException } = errors.codes;

const provider = ethers.getDefaultProvider(PROVIDER);

const { PubNub } = helpers;

/**
 * Get token protocol on the basis of given editions
 * @param nftEditions total nft editions
 * @returns token protocol
 */
export function getTokenProtocol(nftEditions: number) {
  const tokenProtocol: string = nftEditions > 1 ? TokenProtocol.ERC1155 : TokenProtocol.ERC721;
  return tokenProtocol;
}

/**
 * Get smart contract address based on token protocol
 * @param tokenProtocol
 */
export function getSmartContract(tokenProtocol: string) {
  let contract: string;
  switch (tokenProtocol) {
    case TokenProtocol.ERC721:
      contract = BLOCOMMERCE_ERC721_SMART_CONTRACT_ADDRESS;
      break;
    case TokenProtocol.ERC1155:
      contract = BLOCOMMERCE_ERC1155_SMART_CONTRACT_ADDRESS;
      break;
  }
  return contract;
}

/**
 * Get smart contract info
 * @param connection Sequelize connection
 * @param nftEditions Total nft editions
 * @returns 
 */
export async function getSmartContractInfo(connection, nftEditions: number) {
  const tokenProtocol: string = getTokenProtocol(nftEditions);
  const smartContractAddress: string = getSmartContract(tokenProtocol);

  const smartContractRepo = new repositories.SmartContractAbi(connection);
  const smartContract = await smartContractRepo.getBySmartContractAddress(smartContractAddress);
  const contractAbi = smartContractRepo.getSmartContractAbi(smartContract);

  return {
    tokenProtocol,
    smartContractAddress,
    smartContractAbi: contractAbi,
  }
}


/**
 * Get smart contract info
 * @param connection Sequelize connection
 * @param smartContractId id of smart contract
 * @returns 
 */
export async function getSmartContractInfoByContractId(connection, smartContractId: number) {

  const smartContractRepo = new repositories.SmartContract(connection);
  const smartContractAbiRepo = new repositories.SmartContractAbi(connection);

  const smartContract: string = await smartContractRepo.getByCriteria(undefined, undefined, null, null, true,
    true, null, null, false, smartContractId, true);

  const smartContractAbi = await smartContractRepo.getSmartContractAbi(smartContract);

  const abi = smartContractAbiRepo.getSmartContractAbi(smartContractAbi);
  const tokenProtocol: string = smartContractRepo.getTokenProtocol(smartContract);
  const smartContractAddress = smartContractRepo.getAddress(smartContract);



  return {
    tokenProtocol,
    smartContractAddress,
    smartContractAbi: abi,
  }
}



/**
 * Get user wallet
 * @param userId
 * @returns 
 */
export async function getUserWalletInfo(userId) {
  let wallet;
  let walletAddress;
  let Nonce;
  let walletBalanceinWei;

  try {
    const walletFromDynamo = await getUserWallet(userId);
    const { privateKey } = walletFromDynamo;
    wallet = new ethers.Wallet(privateKey, provider);
    walletAddress = wallet.address;
    Nonce = await provider.getTransactionCount(walletAddress, 'latest');
    walletBalanceinWei = await getUserBalanceInWei(privateKey);

  } catch (exp) {
    logger.error(exp);
    throw new CommonError(NoAssociatedWalletException);
  }
  return {
    wallet,
    walletAddress,
    Nonce,
    walletBalanceinWei
  }
}

/**
 * Get user wallet
 * @param userId 
 * @returns 
 */
export async function getUserWallet(userId) {
  let wallet;
  try {
    const userWallet = new UserWalletRepo();
    // Getting Keys from Dynamo and Decrypting them
    const userEncryptedData = await userWallet.getUserWallet(userId);
    if (isValid(userEncryptedData) === false) {
      throw new CommonError(WalletNotFoundException);
    }
    const { root_key: userEncryptedKmsRootKey, data_key: userEncryptedDataKey, private_data: userEncryptedPrivateData } = userEncryptedData;
    const { Plaintext: decryptedPaintText } = await decryptDataKeys(userEncryptedDataKey, userEncryptedKmsRootKey);
    const userDecryptedWallet = await decryptData(decryptedPaintText, userEncryptedPrivateData);

    wallet = JSON.parse(userDecryptedWallet.toString());
  } catch (exp) {
    logger.error(exp);
    throw new CommonError(NoAssociatedWalletException);
  }
  return wallet;
}

/**
 * Function for getting user's wallet current balance.
 * @returns walletBalanceinWei.
 */
export async function getUserBalanceInWei(privateKey: string) {
  let wallet: ethers.Wallet;
  let getBalance: ethers.BigNumber;
  let walletBalance: string;
  let walletBalanceInWei: string;

  try {
    wallet = new ethers.Wallet(privateKey, provider);
    getBalance = await provider.getBalance(wallet.address);
    walletBalance = ethers.utils.formatEther(getBalance);
    walletBalanceInWei = ethers.utils.parseEther(walletBalance).toString();

  } catch (exp) {
    logger.error(exp);
  }

  return walletBalanceInWei;
}

/**
 * Function to get maxPriorityFeePerGas & maxFeePerGas
 * @returns maxPriorityFee, maxFee and gasPrice
 */
export async function getProviderGasPrice() {
  let feeData;
  let maxPriorityFee: number;
  let maxFee: number;
  let gasPrice: number;
  try {
    feeData = await provider.getFeeData();
    maxPriorityFee = ethers.BigNumber.from(feeData.maxPriorityFeePerGas).toNumber();
    maxFee = ethers.BigNumber.from(feeData.maxFeePerGas).toNumber();
    gasPrice = ethers.BigNumber.from(feeData.gasPrice).toNumber();
  } catch (exp) {
    logger.error(exp);
  }

  return { maxPriorityFee, maxFee, gasPrice };
}

export function getDatesAndAggregate(startDate, endDate) {
  let aggregate = AggregateFilters.MONTH;
  let startDateFormated = null;
  let endDateFormated = null;
  if (isValid(startDate) === true && isValid(endDate) === true) {
    startDateFormated = moment(startDate, DateFormat);
    endDateFormated = moment(endDate, DateFormat);
    const days = endDateFormated.diff(startDateFormated, AggregateFilters.DAY);
    if (days < 360 === true) {
      aggregate = AggregateFilters.DAY
    }
  }
  return { startDateFormated, endDateFormated, aggregate }
}

/**
 * Get nft ids for given wallet uids
 * @param userId
 * @param walletUids 
 * @param connection
 * @returns 
 */
export async function filterNftsByWallet(userId: number, walletUids: any, connection, throwError = true) {
  let nftIds = [];

  const nftRepo = new repositories.Nft(connection);
  const walletRepo = new repositories.Wallet(connection);
  const nftOwnerRepo = new repositories.NftOwner(connection);

  const walletError = isValidArray(walletUids) === true ? WalletUnavailableException : null;
  const wallets = await walletRepo.getAllByCriteria(userId, walletUids, WalletStatus.CONNECTED, throwError, walletError);
  const walletIds: Array<number> = walletRepo.getIds(wallets);

  const nftOwners = await nftOwnerRepo.getAllByCriteria(userId, walletIds, true, throwError, NftNotFoundException);
  if (isValidArray(nftOwners) === true) {
    nftIds = nftOwnerRepo.getNftIds(nftOwners);
    nftIds = ld.uniq(nftIds);
    const activeNfts = await nftRepo.listAllByCriteria(null, false, false, true, false, null, null, null, nftIds);

    nftIds = nftRepo.getIds(activeNfts)
  }
  return { wallets, nftIds }
}

/**
 * Sending pubnub notification
 * @param userUid 
 * @param notification
 *
*/
export async function sendPubNubNotification(userUid, notificaiton) {
  const pubnub = new PubNub(PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY);
  await pubnub.publishMessage(userUid, notificaiton);
}