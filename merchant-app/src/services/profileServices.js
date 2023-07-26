import { apiRequest } from "../utils/helper";

let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
let META_INFO_DOMAIN = process.env.NEXT_PUBLIC_META_INFO_DOMAIN;

const getCountries = () => {
  return apiRequest(META_INFO_DOMAIN + "/api/v1/countries", "get", {});
};

const getLanguages = () => {
  return apiRequest(META_INFO_DOMAIN + "/api/v1/languages", "get");
};

const getCurrencies = () => {
  return apiRequest(META_INFO_DOMAIN + "/api/v1/currencies", "get");
};

const getStatesFromCountries = (countryCode) => {
  return apiRequest(
    `${META_INFO_DOMAIN}/api/v1/country/${countryCode}/states`,
    "get"
  );
};

const getS3CredentialsForFetchingProfileImage = async () => {
  const response = await apiRequest(
    `${API_BASE_URL}/api/v1/merchant/auth/temp-credentials?action=getProfileImage`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};

const sendMFA = (params) => {
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/auth/mfa/send`,
    "post",
    params
  );
};

const resendMFA = (params) => {
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/auth/mfa/resend`,
    "patch",
    params
  );
};

const updatePassword = (params) => {
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/profile/password/update`,
    "put",
    params
  );
};

const updatePhoneNumber = (params) => {
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/profile/phone/update`,
    "put",
    params
  );
};
export const getS3CredentialsForImageUplaoding = async () => {
  const response = await apiRequest(
    `${API_BASE_URL}/api/v1/merchant/auth/temp-credentials?action=uploadProfileImage`,
    "get"
  );
  return response?.data?.response?.data?.attributes;
};

const getUserProfile = () => {
  return apiRequest(`${API_BASE_URL}/api/v1/merchant/info`, "get");
};

const updateUserProfile = (payload) => {
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/profile/update`,
    "patch",
    payload
  );
};

const checkUserName = (username) => {
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/profile/unique-username?username=${username}`,
    "get"
  );
};

export const profileService = {
  getCountries,
  getLanguages,
  getCurrencies,
  getStatesFromCountries,
  sendMFA,
  resendMFA,
  updatePassword,
  updatePhoneNumber,
  getS3CredentialsForFetchingProfileImage,
  getS3CredentialsForImageUplaoding,
  checkUserName,
  getUserProfile,
  updateUserProfile,
};
