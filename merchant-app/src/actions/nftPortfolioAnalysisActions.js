import { ActionType } from "../utils/actionTypes";
import { profileActions } from "./profileActions";
import { commonActions } from "./commonActions";
import { nftPortfolioAnalysisService } from "../services/nftPortfolioAnalysisService";

let { clearValues } = profileActions;
let { displaySnackbar, setLoading } = commonActions;

const getPortfolioStats = (params) => {
  return (dispatch) => {
    dispatch(loading(true));
    nftPortfolioAnalysisService.getPortfolioStats(params).then(
      (response) => {
        dispatch(loading(false));
        dispatch(success(response?.response?.data?.response?.data?.attributes));
      },
      (error) => {
        dispatch(displaySnackbar(error?.response?.data?.response));
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_PORTFOLIO_STATS_SUCCESS, payload };
  }

  function loading(payload) {
    return { type: ActionType.GET_PORTFOLIO_STATS_LOADING, payload };
  }

  function failure(error) {
    return { type: ActionType.GET_PORTFOLIO_STATS_FAILURE, error };
  }
};

const getTransactionStats = (params) => {
  return (dispatch) => {
    dispatch(loading(true));
    nftPortfolioAnalysisService.getTransactionStats(params).then(
      (response) => {
        dispatch(loading(false));
        dispatch(success(response?.response?.data?.response?.data?.attributes));
      },
      (error) => {
        dispatch(loading(false));
        dispatch(displaySnackbar(error?.response?.data?.response));
        dispatch(failure(error));
      }
    );
  };

  function success(payload) {
    return { type: ActionType.GET_TRANSACTION_STATS_SUCCESS, payload };
  }

  function loading(payload) {
    return { type: ActionType.GET_TRANSACTION_STATS_LOADING, payload };
  }

  function failure(error) {
    return { type: ActionType.GET_TRANSACTION_STATS_FAILURE, error };
  }
};

const getEarningStats = (params) => {
  return (dispatch) => {
    dispatch(loading(true));
    nftPortfolioAnalysisService.getEarningsStats(params).then(
      (response) => {
        dispatch(loading(false));
        dispatch(success(response?.response?.data?.response?.data?.attributes));
      },
      (error) => {
        dispatch(loading(false));
        dispatch(displaySnackbar(error?.response?.data?.response));
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_EARNINGS_STATS_SUCCESS, payload };
  }

  function loading(payload) {
    return { type: ActionType.GET_EARNINGS_STATS_LOADING, payload };
  }

  function failure(error) {
    return { type: ActionType.GET_EARNINGS_STATS_FAILURE, error };
  }
};

const getSpendingStats = (params) => {
  return (dispatch) => {
    dispatch(loading(true));
    nftPortfolioAnalysisService.getSpendingsStats(params).then(
      (response) => {
        dispatch(loading(false));
        dispatch(success(response?.response?.data?.response?.data?.attributes));
      },
      (error) => {
        dispatch(loading(false));
        dispatch(displaySnackbar(error?.response?.data?.response));
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_SPENDINGS_STATS_SUCCESS, payload };
  }

  function loading(payload) {
    return { type: ActionType.GET_SPENDINGS_STATS_LOADING, payload };
  }

  function failure(error) {
    return { type: ActionType.GET_SPENDINGS_STATS_FAILURE, error };
  }
};

const getNFTTrasaction = (params) => {
  return (dispatch) => {
    dispatch(loading(true));
    nftPortfolioAnalysisService.getNFTTrasaction(params).then(
      (response) => {
        dispatch(success(response?.response?.data));
        dispatch(loading(false));
      },
      (error) => {
        dispatch(displaySnackbar(error?.response?.data?.response));
        dispatch(failure(error));
        dispatch(loading(false));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_NFT_TRANSACTION_SUCCESS, payload };
  }

  function failure(error) {
    return { type: ActionType.GET_NFT_TRANSACTION_FAILURE, error };
  }

  function loading(payload) {
    return { type: ActionType.GET_NFT_TRANSACTION_LOADING, payload };
  }
};

export const nftPortfolioAnalysisActions = {
  getPortfolioStats,
  getTransactionStats,
  getSpendingStats,
  getEarningStats,
  getNFTTrasaction,
};
