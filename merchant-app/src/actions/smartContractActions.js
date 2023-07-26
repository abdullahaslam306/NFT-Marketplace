import {
  SMART_CONTRACTS_LIST_ERROR,
  SMART_CONTRACT_DELETE_ERROR,
  SMART_CONTRACT_DELETE_SUCCESS,
  SMART_CONTRACT_IMPORTED_SUCCESSFULLY,
} from "../utils/constants";
import { ActionType } from "../utils/actionTypes";
import { apiRequest } from "../utils/helper";
import { commonActions } from "./commonActions";

let { displaySnackbar, setLoading } = commonActions;
let WALLET_DOMAIN = process.env.NEXT_PUBLIC_WALLET_DOMAIN;

const getSmartContractsList = (loading = false, params = {}) => {
  let URLPARAMS = Object.keys(params).length
    ? `?limit=${params.limit || 10}&offset=${params.offset || 0}`
    : "?limit=50";

  return async (dispatch) => {
    try {
      dispatch(setLoading(loading));
      const response = await apiRequest(
        `${WALLET_DOMAIN}/api/v1/smart-contract/list${URLPARAMS}`,
        "get"
      );
      dispatch({
        type: ActionType.SET_SMART_CONTRACTS_LIST,
        payload: response.data,
      });
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(displaySnackbar(SMART_CONTRACTS_LIST_ERROR));
    }
  };
};

const deleteSmartContract = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await apiRequest(
        `${WALLET_DOMAIN}/api/v1/smart-contract/${payload.id}/disconnect`,
        "delete"
      );
      dispatch(setLoading(false));
      if (
        response &&
        response.data &&
        response.data.response &&
        response.data.response.indexOf("successfully") > -1
      ) {
        dispatch({ type: ActionType.DELETE_SMART_CONTRACT_SUCCESS, payload });
        dispatch(displaySnackbar(SMART_CONTRACT_DELETE_SUCCESS, "success"));
      }
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(displaySnackbar(SMART_CONTRACT_DELETE_ERROR));
    }
  };
};

const importExistingSmartContract = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const apiRresponse = await apiRequest(
        `${WALLET_DOMAIN}/api/v1/smart-contract/import`,
        "post",
        payload
      );
      dispatch(setLoading(false));
      dispatch(setImportSmartContractResponse(apiRresponse.data));
      const { response } = apiRresponse.data;
      if (response.includes("successfully")) {
        dispatch(
          displaySnackbar(SMART_CONTRACT_IMPORTED_SUCCESSFULLY, "success")
        );
        dispatch({ type: ActionType.SET_SMART_CONTRACTS_LIST, payload: null });
        dispatch(getSmartContractsList());
      }
    } catch (apiError) {
      dispatch(setLoading(false));
      dispatch(setImportSmartContractResponse(apiError.response.data));
    }
  };
};

const setImportSmartContractResponse = (payload = null) => {
  return (dispatch) =>
    dispatch({ type: ActionType.IMPORT_SMART_CONTRACT_RESPONSE, payload });
};

export const smartContractActions = {
  getSmartContractsList,
  deleteSmartContract,
  importExistingSmartContract,
  setImportSmartContractResponse,
};
