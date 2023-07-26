import { ActionType } from "../utils/actionTypes";

export const initialState = {
  ethBalance: null,
  gasEstimate: null,
  fiatRates: null,
  showSecurityModal: false,
  sendEtherSuccess: false,
  sendEtherFailure: false,
  updateWalletNameResponse: null,
  walletsLoading: true,
  gasEstimatesLoading: true,
  walletList: [],
  hideSendEther: false,
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.GET_ETH_BALANCE_SUCCESS:
      return {
        ...state,
        ethBalance: action.balance,
      };
    case ActionType.GAS_ESTIMATE_SUCCESS:
      return {
        ...state,
        gasEstimate: action.estimate,
      };
    case ActionType.GAS_ESTIMATE_LOADING:
      return {
        ...state,
        gasEstimatesLoading: action.payload,
      };
    case ActionType.GAS_ESTIMATE_LOADING_TRUE:
      return {
        ...state,
        gasEstimatesLoading: false,
      }  
    case ActionType.GET_RATES_SUCCESS:
      return {
        ...state,
        fiatRates: action.rates,
      };
    case ActionType.GET_WALLETS_SUCCESS:
      return {
        ...state,
        walletList: action.payload,
      };
    case ActionType.UPDATE_WALLETS_LIST_ITEM:
      const updatedProps = action.payload;
      const updatedList = state.walletList.map((wallet) =>
        wallet.id === updatedProps.id ? { ...wallet, ...updatedProps } : wallet
      );
      return { ...state, walletList: [...updatedList] };
    case ActionType.GET_WALLETS_LOADING:
      return {
        ...state,
        walletsLoading: action.payload,
      };
    case ActionType.SHOW_SECURITY_MODAL:
      return { ...state, showSecurityModal: action.payload };
    case ActionType.TRANSFER_ETH_SUCCESS:
      return { ...state, sendEtherSuccess: true, sendEtherFailure: false };
    case ActionType.TRANSFER_ETH_FAILURE:
      return { ...state, sendEtherFailure: true };
    case ActionType.UPDATE_WALLET_NAME_RESPONSE:
      const response = action.payload || null;
      return { ...state, updateWalletNameResponse: response };
    case ActionType.DISABLE_HIDE_SEND_ETHER:
      return { ...state, hideSendEther: false };
    case ActionType.CLEAR_WALLET_REDUCER:
      return {
        ...state,
        ethBalance: null,
        gasEstimate: null,
        fiatRates: null,
        showSecurityModal: false,
        sendEtherSuccess: false,
        sendEtherFailure: false,
        updateWalletNameResponse: null,
        hideSendEther: true,
      };

    default:
      return { ...state };
  }
}
