import { ActionType } from "../utils/actionTypes";
import { profileActions } from "./profileActions";
import { commonActions } from "./commonActions";
import { walletService } from "../services/walletService";
import { WALLET_UPDATE_ERROR } from "../utils/constants";
let { displaySnackbar, setLoading } = commonActions;

const getETHBalance = (walletaddress, currency) => {
  return (dispatch) => {
    walletService.getETHBalance(walletaddress, currency).then(
      (balance) => {
        dispatch(success(balance && balance.data && balance.data.response));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };
  function success(balance) {
    return { type: ActionType.GET_ETH_BALANCE_SUCCESS, balance };
  }
  function failure(error) {
    return { type: ActionType.GET_ETH_BALANCE_FAILURE, error };
  }
};

const gasEstimate = (currency, action, editions, destAddress, nftId) => {
  return (dispatch) => {
    dispatch(loading(true));
    walletService
      .gasEstimate(currency, action, editions, destAddress, nftId)
      .then(
        (balance) => {
          dispatch(loading(false));
          dispatch(success(balance && balance.data));
        },
        (error) => {
          dispatch(loading(false));
          dispatch(displaySnackbar("Error in fetching gas estimate"));
          dispatch(failure(error));
        }
      );
  };
  function success(estimate) {
    return { type: ActionType.GAS_ESTIMATE_SUCCESS, estimate };
  }
  function loading(payload) {
    return { type: ActionType.GAS_ESTIMATE_LOADING, payload };
  }
  function failure(error) {
    return { type: ActionType.GAS_ESTIMATE_FAILURE, error };
  }
};

const getRates = () => {
  return (dispatch) => {
    walletService.getRates().then(
      (balance) => {
        dispatch(success(balance && balance.data && balance.data.response));
      },
      (error) => {
        dispatch(displaySnackbar("Error in fetching fiat rates"));
        dispatch(failure(error));
      }
    );
  };
  function success(rates) {
    return { type: ActionType.GET_RATES_SUCCESS, rates };
  }
  function failure(error) {
    return { type: ActionType.GET_RATES_FAILURE, error };
  }
};

const showSecurityModal = (payload) => {
  return { type: ActionType.SHOW_SECURITY_MODAL, payload };
};

const transferETH = (payload) => {
  return (dispatch) => {
    walletService.transferETH(payload).then(
      (response) => {
        dispatch(setLoading(false));
        dispatch(success(response));
        setTimeout(() => {
          dispatch(clearValues(true));
          dispatch(commonActions.setModalState(false));
        }, 15000);
      },
      (error) => {
        let errMsg = "Something went wrong. Please try later.";
        if (error && error.response && error.response.data) {
          if (error.response.data.response) {
            errMsg = error.response.data.response;
          } else if (error.response.data.message) {
            errMsg = error.response.data.message;
          }
        }
        dispatch(setLoading(false));
        //dispatch(clearValues());
        dispatch(displaySnackbar(errMsg));
        dispatch(commonActions.setModalState(true));
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.TRANSFER_ETH_SUCCESS, payload };
  }
  function failure(error) {
    return { type: ActionType.TRANSFER_ETH_FAILURE, error };
  }
};

const updateWalletName = (payload) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    walletService
      .updateWalletName(payload)
      .then((response) => {
        dispatch({
          type: ActionType.UPDATE_WALLET_NAME_RESPONSE,
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch(displaySnackbar(WALLET_UPDATE_ERROR));
        dispatch({ type: ActionType.UPDATE_WALLET_NAME_RESPONSE, error });
      })
      .finally(() => dispatch(setLoading(false)));
  };
};
const getWallets = (showBalance) => {
  return (dispatch) => {
    dispatch(loading(true));
    walletService.getUserWalletList(showBalance).then(
      (response) => {
        dispatch(
          success(response && response.data && response?.data?.response?.data)
        );
        dispatch(loading());
      },
      (error) => {
        dispatch(displaySnackbar("Error in fetching user's wallets"));
        dispatch(failure(error));
        dispatch(loading());
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_WALLETS_SUCCESS, payload };
  }
  function loading(payload = false) {
    return { type: ActionType.GET_WALLETS_LOADING, payload };
  }
  function failure(error) {
    return { type: ActionType.GET_WALLETS_FAILURE, error };
  }
};

const connectExternalWallet = (data, setOpenSuccessModal) => {
  return (dispatch) => {
    walletService.connectExternalWallet(data).then(
      (response) => {
        setOpenSuccessModal(true);
        dispatch(getWallets());
      },
      (error) => {
        // console.error({error})
        setOpenSuccessModal(false);
        dispatch(displaySnackbar(error?.response?.data?.response));
      }
    );
  };

  function failure(error) {
    return { type: ActionType.GET_WALLETS_FAILURE, error };
  }
};

const clearValues = (payload) => {
  return { type: ActionType.CLEAR_WALLET_REDUCER, payload };
};
const disableSendEther = (payload) => {
  return { type: ActionType.DISABLE_HIDE_SEND_ETHER, payload };
};

const gasEstimateLoadingTrue = () => {
  return { type: ActionType.GAS_ESTIMATE_LOADING_TRUE };
};

export const walletActions = {
  getETHBalance,
  gasEstimate,
  getRates,
  showSecurityModal,
  transferETH,
  updateWalletName,
  getWallets,
  connectExternalWallet,
  clearValues,
  disableSendEther,
  gasEstimateLoadingTrue
};
