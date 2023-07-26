import { ActionType } from "../utils/actionTypes";
import {
  createNFT,
  updateNFT,
  getAllNFT,
  getNFTInfoByIDService,
  getBlockchainInfoByNftUid,
  getTransactionHistoryByNftUid,
  getSectionListService,
  transferNFTService,
  addSectionService,
  updateSectionService,
  deleteSectionService,
} from "../services/nftServices";
import { actions } from "../actions";
const createNFTAction = (isLoading = true, payload, pushFunc) => {
  return (dispatch) => {
    if (isLoading) dispatch(loading(true));

    createNFT(payload)
      .then((payload) => {
        if (payload) {
          dispatch(success(payload.data.response.data));
          dispatch(loading(false));
          pushFunc(payload?.data?.response?.data?.id);
        }
      })
      .catch((error) => {
        dispatch(
          actions.commonActions.displaySnackbar(
            error.message || "An error occurred!",
            "error"
          )
        );
        dispatch(loading(false));
      });
  };
  function success(payload) {
    return { type: ActionType.CREATE_NFT_SUCCESS, payload };
  }

  function loading(payload = true) {
    return { type: ActionType.CREATE_NFT_LOADING, payload };
  }

  function failure(payload) {
    return { type: ActionType.CREATE_NFT_FAILURE, payload };
  }
};

const loading = (payload = true) => {
  return { type: ActionType.CREATE_NFT_LOADING, payload };
};

const getNFTListAction = (isLoading = true, payload) => {
  return (dispatch) => {
    if (isLoading) {
      dispatch(loading(isLoading));
    }
    getAllNFT(payload)
      .then((payload) => {
        dispatch(success(payload));
      })
      .catch((err) => {
        // dispatch(actions.commonActions.displaySnackbar(err.message, "error"));
        dispatch(failure(err));
      });
  };

  function success(payload) {
    return { type: ActionType.LIST_NFT_SUCCESS, payload };
  }

  function loading(payload = true) {
    return { type: ActionType.LIST_NFT_LOADING, payload };
  }

  function failure(payload) {
    return { type: ActionType.LIST_NFT_FAILURE, payload };
  }
};

const updateNFTSearch = (payload) => {
  return { type: ActionType.NFT_SEARCH, payload };
};

const updateNFTFilter = (payload) => {
  return { type: ActionType.NFT_FILTER, payload };
};

const updateNFTPageNumber = (payload) => {
  return { type: ActionType.UPDATE_PAGE_NUMBER_NFT, payload };
};

const clearNFTList = () => {
  return { type: ActionType.CLEAR_NFT_LIST, payload: [] };
};

const updateNFTAction = (isLoading = false, payload, id, type, callBackFn) => {
  return (dispatch) => {
    if (isLoading) dispatch(loading(true));
    if (payload.properties && !payload.properties.length) {
      delete payload.properties;
    }
    if (payload.tags && !payload.tags.length) {
      delete payload.tags;
    }
    updateNFT(payload, id)
      .then((payload) => {
        if (payload) dispatch(success(payload));
        dispatch(loading(false));
        if (type === "SAVE_DRAFT") {
          dispatch(
            actions.commonActions.displaySnackbar(
              "NFT information has been updated successfully",
              "success"
            )
          );
          dispatch(actions.nftActions.getNFTInfoByID(false, payload.id));
        } else {
          callBackFn(true);
        }
      })
      .catch((err) => {
        dispatch(
          actions.commonActions.displaySnackbar(
            err.response.data.response || "Something went wrong",
            "error"
          )
        );
        // dispatch(failure(payload.data.response.data))
        dispatch(loading(false));
      });
  };
  function success(payload) {
    return { type: ActionType.UPDATE_NFT_SUCCESS, payload };
  }

  function failure(payload) {
    return { type: ActionType.UPDATE_NFT_FAILURE, payload };
  }
};
const openSelectAssetsForNFT = () => {
  return (dispatch) => {
    dispatch(open());
  };

  function open() {
    return { type: ActionType.OPEN_ASSETS_MODAL };
  }
};

const closeSelectAssetsForNFT = () => {
  return (dispatch) => {
    dispatch(close());
  };

  function close() {
    return { type: ActionType.CLOSE_ASSETS_MODAL };
  }
};

const getNFTInfoByID = (isLoading = false, id) => {
  return (dispatch) => {
    if (isLoading) dispatch(loading(true));
    getNFTInfoByIDService(id)
      .then((payload) => {
        dispatch(success(payload));
        dispatch(loading(false));
      })
      .catch((err) => {
        dispatch(actions.commonActions.displaySnackbar(err.message, "error"));
        dispatch(failure(err));
        dispatch(loading(false));
      });
  };

  function success(payload) {
    return { type: ActionType.GETNFTINFOBYID_SUCCESS, payload };
  }

  function loading(payload = true) {
    return { type: ActionType.GETNFTINFOBYID_LOADING, payload };
  }

  function failure(payload) {
    return { type: ActionType.GETNFTINFOBYID_FAILURE, payload };
  }
};

const getBlockChainInfoByIDAction = (isLoading = false, id) => {
  return (dispatch) => {
    if (isLoading) dispatch(loading(true));
    getBlockchainInfoByNftUid(id)
      .then((payload) => {
        dispatch(success(payload));
        dispatch(loading(false));
      })
      .catch((err) => {
        dispatch(failure(err));
        dispatch(loading(false));
      });
  };

  function success(payload) {
    return { type: ActionType.GET_BLOCKCHAININFO_BYID_SUCCESS, payload };
  }

  function loading(payload = true) {
    return { type: ActionType.GET_BLOCKCHAININFO_BYID_LOADING, payload };
  }

  function failure(payload) {
    return { type: ActionType.GET_BLOCKCHAININFO_BYID_FAILURE, payload };
  }
};

const getTransactionHistoryByIDAction = (
  isLoading = false,
  id,
  offset,
  limit
) => {
  return (dispatch) => {
    if (isLoading) dispatch(loading(true));
    getTransactionHistoryByNftUid(id, offset, limit)
      .then((payload) => {
        dispatch(success(payload));
        dispatch(loading(false));
      })
      .catch((err) => {
        dispatch(failure(err));
        dispatch(loading(false));
      });
  };

  function success(payload) {
    return { type: ActionType.GET_TRASACTIONHISTORY_BYID_SUCCESS, payload };
  }

  function loading(payload = true) {
    return { type: ActionType.GET_TRASACTIONHISTORY_BYID_LOADING, payload };
  }

  function failure(payload) {
    return { type: ActionType.GET_TRASACTIONHISTORY_BYID_FAILURE, payload };
  }
};

const clearNFTInfoByID = () => {
  return { type: ActionType.GETNFTINFOBYID_SUCCESS, payload: [] };
};

const getSectionListAction = (isLoading = false, id) => {
  return (dispatch) => {
    if (isLoading) dispatch(loading(true));
    getSectionListService(id)
      .then((payload) => {
        dispatch(success(payload));
        dispatch(loading(false));
      })
      .catch((err) => {
        dispatch(failure(err));
        dispatch(loading(false));
      });
  };

  function success(payload) {
    return { type: ActionType.GET_SECTIONLIST_SUCCESS, payload };
  }

  function loading(payload = true) {
    return { type: ActionType.GET_SECTIONLIST_LOADING, payload };
  }

  function failure(payload) {
    return { type: ActionType.GET_SECTIONLIST_FAILURE, payload };
  }
};

const addSectionAction = (isLoading = false, payload, nft_uid) => {
  return (dispatch) => {
    addSectionService(payload, nft_uid)
      .then((payload) => {
        dispatch(getSectionListAction(false, nft_uid));
      })
      .catch((err) => {});
  };
};

const updateSectionAction = (
  isLoading = false,
  payload,
  nft_uid,
  section_uid
) => {
  return (dispatch) => {
    updateSectionService(payload, nft_uid, section_uid)
      .then((payload) => {
        dispatch(getSectionListAction(false, nft_uid));
      })
      .catch((err) => {});
  };
};

const deleteSectionAction = (isLoading = false, nft_uid, section_uid) => {
  return (dispatch) => {
    // if (isLoading) dispatch(loading(true));
    deleteSectionService(nft_uid, section_uid)
      .then((payload) => {
        dispatch(getSectionListAction(false, nft_uid));
      })
      .catch((err) => {
        dispatch(
          actions.commonActions.displaySnackbar(
            err.response.data.response || "An error occurred!",
            "error"
          )
        );
      });
  };
};

const transferNFTAction = (isLoading = false, payload, id, cb) => {
  return (dispatch) => {
    if (isLoading) dispatch(loading(true));
    transferNFTService(payload, id)
      .then((payload) => {
        dispatch(setNftTransferResponse(payload));
        dispatch(loading(false));
        cb(payload);
      })
      .catch((err) => {
        cb(err.response.data);
        let message = err.response.data.response || "An error occurred!";
        if (message.includes("(error")) {
          message = message.split("(error")[0];
        }
        dispatch(actions.commonActions.displaySnackbar(message, "error"));
        dispatch(setNftTransferResponse(err.response.data));
        dispatch(loading(false));
      });
  };

  function loading(payload = true) {
    return { type: ActionType.TRANSFERNFT_LOADING, payload };
  }
};

const setExpandedPanel = (panelName) => {
  return { type: ActionType.EXPANDED_PANEL, panelName };
};

const setMobileview = (panelName) => {
  return { type: ActionType.SET_NFT_MOBILE_VIEW, panelName };
};

const setNftData = (payload) => {
  return { type: ActionType.SET_NFT_DATA, payload };
};

const setSectionData = (payload) => {
  return { type: ActionType.SET_SECTION_DATA, payload };
};
const setEditedSectionData = (payload) => {
  return { type: ActionType.SET_EDITSECTION_DATA, payload };
};
const setNftImgUrl = (payload) => {
  return { type: ActionType.SET_NFTIMG_URL, payload };
};
const setShowAlert = (payload) => {
  return { type: ActionType.SET_SHOW_ALERT, payload };
};

const setNftTransferResponse = (payload = null) => {
  return (dispatch) =>
    dispatch({ type: ActionType.SET_NFT_TRANSFER_RESPONSE, payload });
};

const setFieldTouched = (payload = null) => {
  return (dispatch) =>
    dispatch({ type: ActionType.SET_FIELD_TOUCHED, payload });
};

const showHelpModal = (payload = null) => {
  return (dispatch) => dispatch({ type: ActionType.SET_HELP_MODAL, payload });
};

const resetNftInfoDetails = () => {
  return (dispatch) => dispatch({ type: ActionType.RESET_INFO_ID_DETAILS });
};

export const nftActions = {
  createNFTAction,
  updateNFTAction,
  openSelectAssetsForNFT,
  closeSelectAssetsForNFT,
  getNFTListAction,
  getNFTInfoByID,
  getTransactionHistoryByIDAction,
  getBlockChainInfoByIDAction,
  updateNFTSearch,
  getSectionListAction,
  updateNFTFilter,
  updateNFTPageNumber,
  clearNFTList,
  transferNFTAction,
  setExpandedPanel,
  setMobileview,
  setNftData,
  updateSectionAction,
  addSectionAction,
  clearNFTInfoByID,
  deleteSectionAction,
  setSectionData,
  setNftImgUrl,
  setShowAlert,
  setNftTransferResponse,
  setEditedSectionData,
  setFieldTouched,
  resetNftInfoDetails,
  showHelpModal,
};
