import { ActionType } from "../utils/actionTypes";

export const initialState = {
  success: false,
  loading: true,
  modal: false,
  assetsList: [],
  noAssets: false,
  fetchedAllAssets: false,
  searchQuery: "",
  isDeletingAsset: false,
};

export default function assetsReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.ASSETS_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionType.GET_ASSETS_SUCCESS:
      return {
        ...state,
        assetsList: action.payload,
      };
    case ActionType.FETCHED_ALL_ASSETS:
      return {
        ...state,
        fetchedAllAssets: action.payload,
      };
    case ActionType.IS_DELETING_ASSET:
      return {
        ...state,
        isDeletingAsset: action.payload,
      };
    case ActionType.NO_ASSETS:
      return {
        ...state,
        noAssets: action.payload,
      };
    case ActionType.SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    default:
      return { ...state };
  }
}
