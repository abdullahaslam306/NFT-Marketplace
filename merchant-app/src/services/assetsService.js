import { apiRequest } from "../utils/helper";

export const getAssets = (filter, pageNumber = 0, searchQuery = "") => {
  return apiRequest(
    `${process.env.NEXT_PUBLIC_ASSET_MANAGEMENT_DOMAIN}/api/v1/assets?${
      filter ? `type=${filter}&` : ""
    }offset=${pageNumber * 10}&limit=10${
      searchQuery ? `&name=${searchQuery}` : ""
    }`,
    "get"
  );
};

export const deleteAsset = (assetUID) => {
  return apiRequest(
    `${process.env.NEXT_PUBLIC_ASSET_MANAGEMENT_DOMAIN}/api/v1/asset/${assetUID}`,
    "delete"
  );
};

export const updateAsset = (assetId, payload) => {
  return apiRequest(
    `${process.env.NEXT_PUBLIC_ASSET_MANAGEMENT_DOMAIN}/api/v1/asset/${assetId}/update`,
    "patch",
    payload
  );
};

export const createAsset = async (payload) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_ASSET_MANAGEMENT_DOMAIN}/api/v1/asset/create`,
    "post",
    payload
  );
  return response?.data?.response?.data?.id;
};

export const getS3CredentialsForAssetUplaoding = async (assetUid) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/merchant/auth/temp-credentials?action=uploadAsset&assetUid=${assetUid}`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};

export const getS3CredentialsForThumbnailUplaod = async (assetUid) => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/merchant/auth/temp-credentials?action=uploadAssetThumbnail&assetUid=${assetUid}`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};

export const getTempCredentialsForAsset = async () => {
  const response = await apiRequest(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/merchant/auth/temp-credentials?action=getAllNfts`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};
