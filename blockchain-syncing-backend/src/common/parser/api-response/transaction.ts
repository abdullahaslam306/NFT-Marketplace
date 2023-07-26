
import { repositories } from 'data-access-utility';
import { configs, helpers } from 'backend-utility';

import { logger } from '../../utils/logger';
import {
  TransactionTransformedDataType,
  SqsMessageSmartContractInfoType,
  MoralisNftsTranfersApiResponseResult,
} from '../../types';

const { NftTransactionEvents } = configs.enums;
const { EthereumNullAddress } = configs.defaults;
const { isValid, isValidArray, weiToEther } = helpers.functions;

/**
 * Class to transform Transaction data
 */
export default class TransactionApiDataParser {
  connection: any;
  transaction;
  constructor(connection, transaction) {
    this.connection = connection;
    this.transaction = transaction;
  }

  /**
   * Transform transaction object from moralis to a format that can be used by database.
   * @param contractAddressList
   * @param moralisTransactions
   * @returns 
   */
  async transform(contractAddressList: Array<SqsMessageSmartContractInfoType>, moralisTransactions: Array<MoralisNftsTranfersApiResponseResult>): Promise<Array<TransactionTransformedDataType>> {
    let transactions: Array<TransactionTransformedDataType> = [];
    try {

      const transformedTransactions: Array<TransactionTransformedDataType> = [];
      const transactionsQueryParameters = [];
      const { ETHERSCAN_BASE_URL } = process.env;

      moralisTransactions.forEach(transaction => {

        const nftId = null;
        const gasFee = null;
        const ipfsLink = null;
        const price = weiToEther(transaction.value);
        const editions = transaction.amount;
        const tokenId = transaction.token_id;
        const blockNumber = transaction.block_number;
        const eventTime = transaction.block_timestamp;
        let eventName = NftTransactionEvents.TRANSFER;
        const toWalletAddress = transaction.to_address;
        const contractAddress = transaction.token_address;
        const fromWalletAddress = transaction.from_address;
        const transactionHash = transaction.transaction_hash;
        const tokenProtocol = transaction.contract_type.toLowerCase();
        const etherscanLink = `${ETHERSCAN_BASE_URL}tx/${transaction.transaction_hash}`;

        if (isValid(fromWalletAddress) === false || fromWalletAddress === EthereumNullAddress) {
          eventName = NftTransactionEvents.LIVE_LOCKED;
        }

        const transformedTransaction: TransactionTransformedDataType = {
          nftId,
          price,
          gasFee,
          tokenId,
          ipfsLink,
          editions,
          eventName,
          eventTime,
          blockNumber,
          tokenProtocol,
          etherscanLink,
          toWalletAddress,
          contractAddress,
          transactionHash,
          fromWalletAddress,
        }

        //TODO: create and index in database using these three ids

        transformedTransactions.push(transformedTransaction);
        transactionsQueryParameters.push({
          tokenProtocol: tokenProtocol,
          transactionHash: transactionHash,
          toWalletAddress: toWalletAddress,
          tokenId: tokenId,
        });
      });
      const transformedContracts = this.transformedContracts(contractAddressList);
      const filteredTransactions = await this.getfilteredTxs(transformedTransactions, transactionsQueryParameters);

      const nftQueryParameters = [];
      filteredTransactions.forEach(tx => {
        nftQueryParameters.push({
          token_id: tx.tokenId,
          smart_contract_id: transformedContracts[tx.contractAddress.toLowerCase()]
        });
      })

      transactions = await this.getTxsWithNftIds(filteredTransactions, nftQueryParameters, transformedContracts);

    } catch (exp) {
      logger.error(exp);
    }
    return transactions;
  }

  /**
  * Used to get existing transactions from database and filters them with moralis transactions
  * @param moralisTxs 
  * @param queryParameters 
  * @returns return filtered transactions
  */
  private async getfilteredTxs(moralisTxs, queryParameters) {
    let existingTxs = [];
    const transactionRepo = await new repositories.NftTransactionHistory(this.connection);
    existingTxs = await transactionRepo.getByQueryParameters(queryParameters, this.transaction);
    const filteredTxs = await this.filterTxs(moralisTxs, existingTxs);
    console.log("FILTERED TXS", filteredTxs);
    return filteredTxs;
  }

  /**
  * Used to remove existing transactions from moralis transactions
  * @param moralisTxs 
  * @param existingTxs 
  * @returns return filtered transactions
  */
  private async filterTxs(moralisTxs, existingTxs) {
    let txs = [];
    const transactionRepo = await new repositories.NftTransactionHistory(this.connection);
    txs = moralisTxs.filter(moralisTx => {
      return !existingTxs.find(existingTx => {
        const tokenId = transactionRepo.getTokenId(existingTx);
        const transactionHash = transactionRepo.getTransactionHash(existingTx);
        const tokenProtocol = transactionRepo.getTokenProtocol(existingTx);
        const toWalletAddress = transactionRepo.getToWalletAddress(existingTx);
        return (tokenId === moralisTx.tokenId
          && tokenProtocol.toLowerCase() === moralisTx.tokenProtocol.toLowerCase()
          && toWalletAddress.toLowerCase() === moralisTx.toWalletAddress.toLowerCase()
          && transactionHash.toLowerCase() === moralisTx.transactionHash.toLowerCase()
        )
      });
    });
    return txs;
  }

  /**
  * Used to convert data contract address list to a reduced for better searching
  * @param contractAddressList 
  * @returns return object of address's as keys and ID's as Values
  */
  private transformedContracts(contractAddressList: Array<SqsMessageSmartContractInfoType>): Record<string, string> {
    return contractAddressList.reduce((result, ele) => {
      const address = ele.address.toLowerCase();
      result[address] = ele.id;
      return result;
    }, {});
  }

  /**
  * Used to convert data contract address list to a reduced for better searching
  * @param nfts 
  * @returns return object of address's as keys and ID's as Values
  */
  private transformNft(nfts): Record<string, string> {
    const nftRepo = new repositories.Nft(this.connection);

    return nfts.reduce((result, nft) => {
      const nftId = nftRepo.getId(nft);
      const tokenId = nftRepo.getTokenId(nft);
      const smartContractId = nftRepo.getSmartContractId(nft);
      const key = `${tokenId}_${smartContractId}`
      result[key] = nftId;
      return result;
    }, {});
  }

  /**
  * Inject nft_id in the transformed transaction data
  * @param nfts
  * @param transformedNftData
  * @returns
  */
  private injectNftId(transformedNfts, txs: Array<TransactionTransformedDataType>, transformedContracts: Record<string, string>): Array<TransactionTransformedDataType> {
    const result = [...txs];
    txs.forEach((transaction, idx) => {
      let nftId = null;
      let smartContractId = null;
      const { tokenId, contractAddress } = transaction;
      const contractExists = Object.prototype.hasOwnProperty.call(transformedContracts, contractAddress);
      if (contractExists === true) {
        smartContractId = transformedContracts[contractAddress];

        const searchKey = `${tokenId}_${smartContractId}`;
        nftId = transformedNfts[searchKey];
        if (isValid(nftId)) {
          result[idx].nftId = nftId;
        }
      }
    });
    return result;
  }

  /**
  * Used to get transactions with relavent nftIds
  * @param txs 
  * @param queryParameters 
  * @returns return filtered transactions
  */
  private async getTxsWithNftIds(txs: Array<TransactionTransformedDataType>, nftQueryParameters, transformedContracts) {
    let txsWithNftIds = [];
    if (isValidArray(nftQueryParameters) === true) {
      const nftRepo = new repositories.Nft(this.connection);
      const nfts = await nftRepo.getByTokenIdAndContractId(nftQueryParameters, null, null, this.transaction, false, null);
      const transformedNfts = this.transformNft(nfts);
      txsWithNftIds = this.injectNftId(transformedNfts, txs, transformedContracts);
    }
    return txsWithNftIds;
  }

}