import { apiRequest } from "../utils/helper";
import { deSerializedNftList } from "../deserializers/getAllNftDeserializer";

export const createNFT = async (payload) => {
  return apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/create`,
    "post",
    payload
  );
};

export const getBlockchainInfoByNftUid = async (nft_uid) => {
  try {
    const response = await apiRequest(
      `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${nft_uid}/blockchain-info`,
      "get"
    );
    return response?.data?.response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

//{{nft-management-backend}}/api/v1/nft/{{nft_uid}}
export const getNftInfoByUid = async (nft_uid) => {
  try {
    const response = await apiRequest(
      `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${nft_uid}`,
      "get"
    );
    return response?.data?.response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getTransactionHistoryByNftUid = async (
  nft_uid,
  offset = 0,
  limit = 10
) => {
  try {
    const response = await apiRequest(
      `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${nft_uid}/transaction-history?offset=${offset}&limit=${limit}&orderBy=ASC`,
      "get"
    );
    return response?.data?.response;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getAllNFT = async (payload) => {
  const offset = payload && payload.pageNumber ? payload.pageNumber * 9 : 0;
  let url = `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/list?offset=${offset}&limit=9`;

  if (payload?.smartContractUids?.length) {
    url = url + `&smartContractUids=${payload.smartContractUids}`;
  }

  if (payload?.walletUids?.length) {
    url = url + `&walletUids=${payload.walletUids}`;
  }

  if (payload?.title) {
    url = url + `&title=${payload.title}`;
  }

  const response = await apiRequest(url, "get");
  const total = response.data.response.meta.totalRecords;
  const nftList = await deSerializedNftList(response.data.response);
  return { nftList, total };
};

export const updateNFT = async (payload, id) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${id}/update`,
    "patch",
    payload
  );
  if (response.data) {
    response.data.id = id;
  }
  return response.data;
};

export const getTempCredentialsForNft = async () => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/merchant/auth/temp-credentials?action=getAllNfts`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};

export const getTempCredentialsForNftPublic = async (uid) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/merchant/auth/temp-credentials-public?action=getNftAssets&uid=${uid}`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};

export const getTempCredentialsForProfilePublic = async (uid) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/public/merchant/auth/temp-credentials-public?action=getProfileImage&uid=${uid}`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};

export const getNFTInfoByIDService = async (id) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${id}`,
    "get"
  );
  const nftList = await deSerializedNftList(response.data.response);
  return nftList;
};

export const getSectionListService = async (id) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${id}/sections/list`,
    "get"
  );

  return response?.data?.response?.data;
};

export const addSectionService = async (payload, nft_uid) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${nft_uid}/sections/create`,
    "post",
    payload
  );

  return response?.data?.response?.data;
};

export const getNFTStats = async () => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/account/summary`,
    "get"
  );

  return response?.data?.response?.data;
};

export const deleteSectionService = async (nft_uid, section_uid) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${nft_uid}/section/${section_uid}/delete`,
    "delete"
  );

  return response?.data?.response?.data;
};

export const updateSectionService = async (payload, nft_uid, section_uid) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${nft_uid}/section/${section_uid}/update`,
    "patch",
    payload
  );

  return response?.data?.response?.data;
};

export const transferNFTService = async (payload, id) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${id}/transfer`,
    "post",
    payload
  );
  return response.data;
};
export const deleteNft = (nftUID) => {
  return apiRequest(
    `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/${nftUID}/delete`,
    "delete"
  );
};
