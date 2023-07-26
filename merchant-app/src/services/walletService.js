import { apiRequest } from "../utils/helper";

let WALLET_DOMAIN = process.env.NEXT_PUBLIC_WALLET_DOMAIN;

const getETHBalance = (walletaddress, currency) => {
  return apiRequest(`${WALLET_DOMAIN}/api/v1/wallet/eth/balance`, "post", {
    walletAddress: walletaddress,
    fiat: currency,
  });
};
const gasEstimate = (currency, action, editions, destAddress, nftId) => {
  let requestURL = `${WALLET_DOMAIN}/api/v1/wallet/eth/gasestimate?fiat=${currency}`;
  if (action) {
    requestURL = requestURL + "&action=" + action;
  }
  if (editions) {
    requestURL = requestURL + "&editions=" + editions;
  }
  if (destAddress) {
    requestURL = requestURL + "&destinationWalletAddress=" + destAddress;
  }
  if (nftId) {
    requestURL = requestURL + "&nftUid=" + nftId;
  }
  return apiRequest(requestURL, "get");
};

const getRates = () => {
  return apiRequest(`${WALLET_DOMAIN}/api/v1/exchange/rates?crypto=eth`, "get");
};

const transferETH = (payload) => {
  return apiRequest(
    `${WALLET_DOMAIN}/api/v1/wallet/eth/transfer`,
    "post",
    payload
  );
};

const updateWalletName = (payload) => {
  const { name, id } = payload;
  return apiRequest(`${WALLET_DOMAIN}/api/v1/wallet/${id}/update`, "patch", {
    name,
  });
};

const getUserWalletList = (showBalance = false) => {
  return apiRequest(
    `${WALLET_DOMAIN}/api/v1/wallet/list?balance=${showBalance}`,
    "get"
  );
};

const connectExternalWallet = (payload) => {
  return apiRequest(`${WALLET_DOMAIN}/api/v1/wallet/add`, "post", payload);
};

const disconnectExternalWallet = (walletUID, payload) => {
  return apiRequest(
    `${WALLET_DOMAIN}/api/v1/wallet/${walletUID}/update`,
    "patch",
    payload
  );
};

export const walletService = {
  getETHBalance,
  gasEstimate,
  getRates,
  transferETH,
  updateWalletName,
  getUserWalletList,
  connectExternalWallet,
  disconnectExternalWallet,
};
