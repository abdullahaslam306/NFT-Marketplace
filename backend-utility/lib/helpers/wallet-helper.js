/**
 *  Wallet helper to perform activity on blockchain using ethers.js
 */

const ethers = require('ethers');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });

const { TokenProtocol } = require('../configs/enum');
const { getRandomString, isValid } = require('./function');
const BlockChainError = require('./errors/blockchain-error');

class WalletHelper {
  /**
   * Initialize wallet
   * @param {String} providerName
   * @param {String} privateKey
   * @param {String} walletAddress
   */
  constructor(providerName, privateKey) {
    this.provider = ethers.getDefaultProvider(providerName);
    this.privateKey = privateKey;
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    this.walletAddress = this.wallet.address;
  }

  /**
   * Generate a wallet
   * @returns Return a randomly generated Ethereum wallet
   */
  async generate() {
    const randomWallet = ethers.Wallet.createRandom(getRandomString());
    return {
      address: randomWallet.address,
      privateKey: randomWallet._signingKey().privateKey, // eslint-disable-line no-underscore-dangle
      publicKey: randomWallet._signingKey().publicKey, // eslint-disable-line no-underscore-dangle
      mnemonics: randomWallet._mnemonic().phrase, // eslint-disable-line no-underscore-dangle
    };
  }

  /**
   * Get eth crypto balance
   * @returns
   */
  async getCryptoBalance(walletAddress = null) {
    let balance = 0;
    try {
      const address = isValid(this.walletAddress) === true ? this.walletAddress : walletAddress;
      balance = await this.provider.getBalance(address);
      balance = ethers.utils.formatEther(balance);
    } catch (exp) {
      pino.error(exp);
    }
    return balance;
  }

  /**
   * Get nft balance for given smart contract and wallet address
   * @param {String} contractArress
   * @param {Object} smartContractAbi
   * @returns formated nft balance
   */
  async getNftBalance(contractArress, smartContractAbi) {
    let nftBalance;
    try {
      const smartContract = new ethers.Contract(contractArress, smartContractAbi, this.provider);
      const balance = await smartContract.balanceOf(this.walletAddress);
      nftBalance = ethers.BigNumber.from(balance).toNumber();
    } catch (exp) {
      pino.error(exp);
    }
    return nftBalance;
  }

  /**
   * Transfer ethers
   * @param {String} destinationAddress
   * @param {Float} amount
   * @returns
   */
  async transferEth(destinationAddress, amount) {
    let transaction;
    try {
      const wallet = new ethers.Wallet(this.privateKey, this.provider);
      const tx = {
        to: destinationAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amount),
      };
      transaction = await wallet.sendTransaction(tx);
    } catch (exp) {
      throw new BlockChainError(exp);
    }
    return transaction;
  }

  /**
   * Get gas price
   * @returns
   */
  async getGasPrice() {
    let providerGasPrice;
    let gasPrice;
    try {
      providerGasPrice = await this.provider.getGasPrice();
      gasPrice = ethers.BigNumber.from(providerGasPrice).toNumber();
    } catch (exp) {
      pino.error(exp);
    }
    return gasPrice;
  }

  /**
   * Transfer nft to given address
   * @param {String} destinationAddress
   * @param {Number} tokenId
   * @param {String} tokenProtocol
   * @param {Number} editions
   * @returns
   */
  async transferNft(contractAddress, contractAbi, destinationAddress, tokenId, tokenProtocol, editions = 1) {
    let transaction;
    try {
      const wallet = new ethers.Wallet(this.privateKey, this.provider);
      const contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);
      // eslint-disable-next-line default-case
      switch (tokenProtocol) {
        case TokenProtocol.ERC721:
          transaction = await contract['safeTransferFrom(address,address,uint256)'](wallet.address, destinationAddress, tokenId);
          break;
        case TokenProtocol.ERC1155:
          transaction = await contract['safeTransferFrom(address,address,uint256,uint256,bytes)'](wallet.address, destinationAddress, tokenId, editions, '0x00');
          break;
      }
    } catch (exp) {
      throw new BlockChainError(exp);
    }
    return transaction;
  }
}

module.exports = {
  WalletHelper,
};
