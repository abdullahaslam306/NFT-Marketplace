/**
 *  Handler to create nft signature for lazy minted nft
 */

import { ethers } from 'ethers';
import { CommonError, errors, helpers } from 'backend-utility';
import { UserWalletRepo } from 'dynamo-access-utility';

import { logger } from '../../common/utils/logger';
import { abiERC721, abiERC1155 } from '../../common/utils/abi';
import { ParsedLazyMintLambdaResponse, TokenInformation } from 'src/common/types';


const { isValid } = helpers.functions;
const { decryptDataKeys, decryptData } = helpers.kms;
const { PROVIDER, BLOCOMMERCE_ERC721_SMART_CONTRACT_ADDRESS, BLOCOMMERCE_ERC1155_SMART_CONTRACT_ADDRESS } = process.env;
const { WalletNotFoundException } = errors.codes

/**
 * Handler for lazy minting
 * @param {AWSLambda.APIGatewayEvent} event
 * @param {AWSLambda.Context} context
 * @returns signature for lazy minting.
 */
export const handler = async (event, context: AWSLambda.Context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let response;
  try {

    const userWallet = new UserWalletRepo();
    const provider = ethers.getDefaultProvider(PROVIDER);

    const { payload } = event;

    const { tokenId, userId, editions } = payload

    const abi = editions > 1 ? abiERC1155 : abiERC721;
    const contractAddress = editions > 1 ? BLOCOMMERCE_ERC1155_SMART_CONTRACT_ADDRESS : BLOCOMMERCE_ERC721_SMART_CONTRACT_ADDRESS;

    // Get keys from dynamo and decrypt them
    const userEncryptedData = await userWallet.getUserWallet(userId);

    logger.info(userEncryptedData);
    if (isValid(userEncryptedData) === false) {
      throw new CommonError(WalletNotFoundException);
    }

    const encryptedDataKey = userEncryptedData.data_key;
    const kmsRootKeyId = userEncryptedData.root_key;

    const decryptedDataKey = await decryptDataKeys(encryptedDataKey, kmsRootKeyId);
    const userDecryptedWallet = await decryptData(decryptedDataKey.Plaintext, userEncryptedData.private_data);

    const walletFromDynamo = JSON.parse(userDecryptedWallet.toString());
    const { privateKey } = walletFromDynamo;

    const wallet = new ethers.Wallet(privateKey, provider);
    const creator = wallet.address;
    const { chainId } = await provider.getNetwork();

    logger.info(contractAddress);

    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const { nftInformation, tokenInformation, contractInformation } = getSmartContractBluprint(chainId, contract.address, creator, tokenId, editions);

    logger.info(tokenInformation);
    const signature = await wallet._signTypedData(contractInformation, nftInformation, tokenInformation);
    response = generateResponse(userId, tokenId, signature);
  } catch (exp) {
    logger.error(exp);
    throw exp;
  }
  return response;
};

/**
 * Generate lazy mint lambda response
 * @param userId 
 * @param tokenId 
 * @param signature 
 * @returns Json stringified response
 */
function generateResponse(userId: number, tokenId: number, signature: string) {
  const response: ParsedLazyMintLambdaResponse = {
    userId,
    tokenId,
    signature
  };
  logger.info(response);
  return response;
}

/**
 * Function is used to return generate a blueprint for smart contract based on Editions.
 * @param chainId 
 * @param contract 
 * @param creator 
 * @param tokenId 
 * @param editions 
 * @returns return the blueprint for ERC721 or ERC1155
 */
function getSmartContractBluprint(chainId: number, contractAddress: string, creator: string, tokenId: number, editions: number) {

  const contractInformation = {
    name: 'Blocommerce',
    version: '1.0.0',
    chainId,
    verifyingContract: contractAddress,
  };

  const nftInformation = {
    NFT: [
      { name: 'creator', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
  };

  const tokenInformation: TokenInformation = {
    creator, 
    tokenId,
  };

  if (editions > 1) {
    nftInformation.NFT.push({ name: 'editions', type: 'uint256' });
    tokenInformation.editions = editions;
  }

  return {
    nftInformation,
    tokenInformation,
    contractInformation,
  };
}
