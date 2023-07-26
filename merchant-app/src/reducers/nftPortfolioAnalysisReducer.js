import { ActionType } from "../utils/actionTypes";

export const initialState = {
  porfolioStats: {},
  transactionStats: {},
  transactionStatsLoading: true,
  porfolioStatsLoading: false,
  earningsStatsLoading: true,
  spendingsStatsLoading: true,
  nftTransactionLoading: false,
  spendingsStats: {},
  earningsStats: {},
  nftTrasaction: {
    totalCount: 0,
    data: [],
  },
};

export default function nftPortfolioAnalysisReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case ActionType.GET_PORTFOLIO_STATS_SUCCESS:
      return {
        ...state,
        porfolioStats: action.payload,
      };
    case ActionType.GET_PORTFOLIO_STATS_LOADING:
      return {
        ...state,
        porfolioStatsLoading: action.payload,
      };

    case ActionType.GET_PORTFOLIO_STATS_FAILURE:
      return {
        ...state,
        porfolioStats: {},
      };

    case ActionType.GET_TRANSACTION_STATS_SUCCESS:
      return {
        ...state,
        transactionStats: action.payload,
      };

    case ActionType.GET_TRANSACTION_STATS_LOADING:
      return {
        ...state,
        transactionStatsLoading: action.payload,
      };

    case ActionType.GET_EARNINGS_STATS_LOADING:
      return {
        ...state,
        earningsStatsLoading: action.payload,
      };

    case ActionType.GET_SPENDINGS_STATS_LOADING:
      return {
        ...state,
        spendingsStatsLoading: action.payload,
      };

    case ActionType.GET_TRANSACTION_STATS_FAILURE:
      return {
        ...state,
        transactionStats: {},
      };

    case ActionType.GET_SPENDINGS_STATS_SUCCESS:
      return {
        ...state,
        spendingsStats: action.payload,
      };

    case ActionType.GET_SPENDINGS_STATS_FAILURE:
      return {
        ...state,
        spendingsStats: {},
      };

    case ActionType.GET_EARNINGS_STATS_SUCCESS:
      return {
        ...state,
        earningsStats: action.payload,
      };

    case ActionType.GET_EARNINGS_STATS_FAILURE:
      return {
        ...state,
        earningsStats: {},
      };
    case ActionType.GET_NFT_TRANSACTION_SUCCESS:
      return {
        ...state,
        nftTrasaction: {
          totalCount: action?.payload?.response?.meta?.totalRecords,
          data: action?.payload?.response?.data,
        },
      };

      case ActionType.GET_NFT_TRANSACTION_LOADING:
      return {
        ...state,
        nftTransactionLoading: action.payload,
      };

    case ActionType.GET_NFT_TRANSACTION_FAILURE:
      return {
        ...state,
        nftTrasaction: {
          totalCount: 0,
          data: [],
        },
      };

    default:
      return { ...state };
  }
}
