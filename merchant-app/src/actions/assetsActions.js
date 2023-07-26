import { ActionType } from "../utils/actionTypes";
import { getAssets } from "../services/assetsService";

let prevFilter = "";
let prevSearchQuery = "";
export const getAllAssets = ({
  displayLoader = true,
  refresh = false,
  filter,
  pageNumber,
  searchQuery,
}) => {
  return async (dispatch, getState) => {
    if (prevFilter !== filter) dispatch(updateGetAssetsSuccess([]));
    if (displayLoader) dispatch(loading());
    let assetsList = [];
    try {
      const payload = await getAssets(filter, pageNumber, searchQuery);
      // dispatch({ type: ActionType.FETCHED_ALL_ASSETS, payload: false });
      if (
        prevSearchQuery === searchQuery &&
        prevFilter === filter &&
        !refresh
      ) {
        assetsList = [
          ...getState().assetsReducer.assetsList,
          ...payload.data.response.data,
        ];
        dispatch(updateGetAssetsSuccess(assetsList));
      } else {
        dispatch(updateGetAssetsSuccess([]));
        assetsList = [...payload.data.response.data];
        dispatch(updateGetAssetsSuccess(assetsList));
      }

      if (assetsList.length === 0)
        dispatch({ type: ActionType.NO_ASSETS, payload: true });

      dispatch(loading(false));
      dispatch(updateIsDeletingAsset(false));
      prevFilter = filter;
      prevSearchQuery = searchQuery;
    } catch (error) {
      if (
        error?.response?.status === 404 &&
        prevSearchQuery === searchQuery &&
        window?.location.pathname === "/assets"
      ) {
        dispatch({ type: ActionType.FETCHED_ALL_ASSETS, payload: true });
      } else dispatch(updateGetAssetsSuccess([]));

      if (getState().assetsReducer.isDeletingAsset)
        dispatch(updateGetAssetsSuccess([]));

      dispatch(loading(false));
    }
  };

  function loading(payload = true) {
    return { type: ActionType.ASSETS_LOADING, payload };
  }
};

export const updateSearchAssetQuery = (payload) => {
  return { type: ActionType.SEARCH_QUERY, payload };
};

export const updateFetchedAllAssets = (payload) => {
  return { type: ActionType.FETCHED_ALL_ASSETS, payload };
};

export const updateIsDeletingAsset = (payload) => {
  return { type: ActionType.IS_DELETING_ASSET, payload };
};

export const updateGetAssetsSuccess = (payload) => {
  return { type: ActionType.GET_ASSETS_SUCCESS, payload };
};
