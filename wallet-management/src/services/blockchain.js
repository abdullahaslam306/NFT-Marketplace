/**
 *  blockchain service to connect with ethers.js
 */

const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const ethers = require('ethers');
const { helpers, CommonError, errors } = require('backend-utility');
const { abiERC721, abiERC1155 } = require('../utilities/abi');

const { getRandomString } = helpers.functions;
const { PROVIDER, ERC721_CONTRACT_ADDRESS, ERC1155_CONTRACT_ADDRESS } = process.env;

const provider = ethers.getDefaultProvider(PROVIDER);

/**
 *
 * @returns Return a randomly generated Ethereum wallet
 */
const createWallet = async () => {
  const randomWallet = ethers.Wallet.createRandom(getRandomString());
  return {
    address: randomWallet.address,
    privateKey: randomWallet._signingKey().privateKey, // eslint-disable-line no-underscore-dangle
    publicKey: randomWallet._signingKey().publicKey, // eslint-disable-line no-underscore-dangle
    mnemonics: randomWallet._mnemonic().phrase, // eslint-disable-line no-underscore-dangle
  };
};

/**
 * Get ether balance
 * @param {String} walletAddress
 * @returns
 */
const getBalanceInEth = async walletAddress => {
  let balance = 0;
  try {
    balance = await provider.getBalance(walletAddress);
    balance = ethers.utils.formatEther(balance);
  } catch (exp) {
    pino.error(exp);
  }
  return balance;
};

/**
 * Function returns the NFT balance for the provided address.
 * @param {String} walletAddress
 * @returns
 */
const getNFTBalance = async walletAddress => {
  const ERC721Contract = new ethers.Contract(
    ERC721_CONTRACT_ADDRESS,
    abiERC721,
    provider,
  );
  const ERC721Balance = ethers.BigNumber.from(
    await ERC721Contract.balanceOf(walletAddress),
  ).toNumber();

  const ERC1155Contract = new ethers.Contract(
    ERC1155_CONTRACT_ADDRESS,
    abiERC1155,
    provider,
  );
  const ERC1155Balance = ethers.BigNumber.from(
    await ERC1155Contract.balanceOf(walletAddress, 1),
  ).toNumber();

  return {
    ERC721: ERC721Balance,
    ERC1155: ERC1155Balance,
  };
};

/**
 * Transfer ethers
 * @param {String} privateKey
 * @param {String} destinationAddress
 * @param {Float} amount
 * @returns
 */
const transferEther = async (privateKey, destinationAddress, amount) => {
  let transaction;
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    if (wallet.address === destinationAddress) {
      throw new CommonError(errors.codes.SameEthDestinationAddressException);
    }
    const tx = {
      to: destinationAddress,
      // Convert currency unit from ether to wei
      value: ethers.utils.parseEther(amount),
    };
    transaction = await wallet.sendTransaction(tx);
  } catch (exp) {
    if (exp.code === errors.codes.SameEthDestinationAddressException.code) {
      throw new CommonError(exp);
    } else {
      throw new CommonError(processBlockChainError(exp));
    }
  }
  return transaction;
};

function processBlockChainError(exp) {
  return {
    code: exp?.code,
    message: exp?.message,
    status: 400,
  };
}

/**
 * Function transfer an ERC721 from the sender to receiver.
 *
 * @param {String} to
 * @param {Number} tokenId
 * @param {String} privateKey
 * @returns
 */
const transferERC721NFT = async (to, tokenId, privateKey) => {
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    ERC721_CONTRACT_ADDRESS,
    abiERC721,
    wallet,
  );
  try {
    const transaction = await contract.transferOfNFT(
      wallet.address,
      to,
      tokenId,
    );
    return transaction;
  } catch (exp) {
    throw new CommonError(processBlockChainError(exp));
  }
};

/**
 * Function transfer an ERC1155 from the sender to receiver.
 *
 * @param {String} to
 * @param {Number} tokenId
 * @param {Number} editions
 * @param {String} privateKey
 * @returns
 */
const transferERC1155NFT = async (to, tokenId, editions, privateKey) => {
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    ERC1155_CONTRACT_ADDRESS,
    abiERC1155,
    wallet,
  );
  try {
    const transaction = await contract.transferERC1155(
      wallet.address,
      to,
      tokenId,
      editions,
    );
    return transaction;
  } catch (exp) {
    throw new CommonError(processBlockChainError(exp));
  }
};

module.exports = {
  ethers,
  provider,
  createWallet,
  transferEther,
  getNFTBalance,
  getBalanceInEth,
  transferERC721NFT,
  transferERC1155NFT,
};
