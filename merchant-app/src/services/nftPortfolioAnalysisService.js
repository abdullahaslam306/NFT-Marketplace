import { apiRequest } from "../utils/helper";

let NFT_MANAGEMENT_DOMAIN = process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN;

const getPortfolioStats = async (params) => {
  let url = `${NFT_MANAGEMENT_DOMAIN}/api/v1/nft/portfolio/stats?`;
  if (params.smartContractUids.length > 0) {
    url = url + `&smartContractUids=${params.smartContractUids}`;
  }
  if (params.walletUids.length > 0) {
    url = url + `&walletUids=${params.walletUids}`;
  }
  const response = await apiRequest(url, "get");

  return { response };
};

const getTransactionStats = async (params) => {
  let url = `${NFT_MANAGEMENT_DOMAIN}/api/v1/nft/portfolio/transactions?startDate=${params.startDate}&endDate=${params.endDate}`;
  if (params?.smartContractUids?.length > 0) {
    url = url + `&smartContractUids=${params.smartContractUids}`;
  }
  if (params?.walletUids?.length > 0) {
    url = url + `&walletUids=${params.walletUids}`;
  }

  const response = await apiRequest(url, "get");

  return { response };
};

const getSpendingsStats = async (params) => {
  let url = `${NFT_MANAGEMENT_DOMAIN}/api/v1/nft/portfolio/spendings?startDate=${params.startDate}&endDate=${params.endDate}`;
  if (params?.smartContractUids?.length > 0) {
    url = url + `&smartContractUids=${params.smartContractUids}`;
  }
  if (params?.walletUids?.length > 0) {
    url = url + `&walletUids=${params.walletUids}`;
  }
  const response = await apiRequest(url, "get");

  return { response };
};

const getEarningsStats = async (params) => {
  let url = `${NFT_MANAGEMENT_DOMAIN}/api/v1/nft/portfolio/earnings?startDate=${params.startDate}&endDate=${params.endDate}`;
  if (params?.smartContractUids?.length > 0) {
    url = url + `&smartContractUids=${params.smartContractUids}`;
  }
  if (params?.walletUids?.length > 0) {
    url = url + `&walletUids=${params.walletUids}`;
  }
  const response = await apiRequest(url, "get");

  return { response };
};

const getNFTTrasaction = async (params) => {
  let url = `${NFT_MANAGEMENT_DOMAIN}/api/v1/nft/nft-transaction?startDate=${
    params.startDate
  }&endDate=${params.endDate}&orderBy=${"DESC"}&limit=${
    params.limit || 10
  }&offset=${params.offset || 0}`;

  if (params?.smartContractUids?.length > 0) {
    url = url + `&smartContractUids=${params.smartContractUids}`;
  }
  if (params?.walletUids?.length > 0) {
    url = url + `&walletUids=${params.walletUids}`;
  }

  const response = await apiRequest(url, "get");

  return { response };
};

export const nftPortfolioAnalysisService = {
  getPortfolioStats,
  getTransactionStats,
  getEarningsStats,
  getSpendingsStats,
  getNFTTrasaction,
};
