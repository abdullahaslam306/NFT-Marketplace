import { ActionType } from "../utils/actionTypes";

export const initialState = {
  loading: false,
  assetsModalOpen: false,
  total: 0,
  nftData: {},
  nftList: [],
  loadingNftList: false,
  nftupdateData: {},
  selectedNFT: {},
  nftInfoById: {},
  blockChainInfo: [],
  trasactionHistory: [],
  loadingPreview: false,
  sectionList: [],
  loadingTransferNFT: false,
  transferNFT: {},
  loadingSection: false,
  loadingBlockInfo: false,
  loadingTrasaction: false,
  expandedPanel: "panel3",
  isMobileView: false,
  nftEditData: {},
  textEditorData: "",
  textEditorDataSectionList: [],
  imgUrl: "",
  setShowAlert: false,
  setFieldTouched: false,
  search: "",
  filters: {},
  pageNumber: 0,
  showHelpModal: false,
};

export default function nftReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.CREATE_NFT_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionType.CREATE_NFT_SUCCESS:
      return {
        ...state,
        nftData: action.payload,
      };
    case ActionType.CREATE_NFT_FAILURE:
      return {
        ...state,
        nftData: action.payload,
      };
    case ActionType.LIST_NFT_SUCCESS:
      return {
        ...state,
        nftList: action.payload.nftList,
        total: action.payload.total,
        loadingNftList: false,
      };
    case ActionType.LIST_NFT_LOADING:
      return {
        ...state,
        loadingNftList: true,
      };
    case ActionType.CLEAR_NFT_LIST:
      return {
        ...state,
        nftList: [],
      };
    case ActionType.LIST_NFT_FAILURE:
      return {
        ...state,
        loadingNftList: false,
        nftList: [],
      };
    case ActionType.UPDATE_NFT_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionType.NFT_SEARCH:
      return {
        ...state,
        search: action.payload,
      };
    case ActionType.UPDATE_PAGE_NUMBER_NFT:
      return {
        ...state,
        pageNumber: action.payload,
      };
    case ActionType.NFT_FILTER:
      return {
        ...state,
        filters: action.payload,
      };
    case ActionType.UPDATE_NFT_SUCCESS:
      return {
        ...state,
        nftupdateData: action.payload,
        nftEditData: {},
      };
    case ActionType.UPDATE_NFT_FAILURE:
      return {
        ...state,
        nftupdateData: action.payload,
      };
    case ActionType.GETNFTINFOBYID_LOADING:
      return {
        ...state,
        loadingPreview: action.payload,
      };
    case ActionType.GETNFTINFOBYID_SUCCESS:
      return {
        ...state,
        nftInfoById: action.payload,
        nftEditData: {
          properties: action.payload.properties || [],
          tags: action.payload.tags || [],
          title: action.payload.title || "",
          totalEditions: action.payload.totalEditions || "",
          description: action?.payload?.description,
        },
        textEditorData: action?.payload?.description,
      };
    case ActionType.GETNFTINFOBYID_FAILURE:
      return {
        ...state,
        nftInfoById: action.payload,
        nftEditData: "",
      };
    case ActionType.GET_BLOCKCHAININFO_BYID_LOADING:
      return {
        ...state,
        loadingBlockInfo: action.payload,
      };
    case ActionType.GET_BLOCKCHAININFO_BYID_SUCCESS:
      return {
        ...state,
        blockChainInfo: action.payload,
      };
    case ActionType.GET_BLOCKCHAININFO_BYID_FAILURE:
      return {
        ...state,
        blockChainInfo: action.payload,
      };
    case ActionType.GET_TRASACTIONHISTORY_BYID_LOADING:
      return {
        ...state,
        loadingTrasaction: action.payload,
      };
    case ActionType.GET_TRASACTIONHISTORY_BYID_SUCCESS:
      return {
        ...state,
        trasactionHistory: action.payload,
      };
    case ActionType.GET_TRASACTIONHISTORY_BYID_FAILURE:
      return {
        ...state,
        trasactionHistory: action.payload,
      };
    case ActionType.GET_SECTIONLIST_LOADING:
      return {
        ...state,
        loadingSection: action.payload,
      };
    case ActionType.GET_SECTIONLIST_SUCCESS:
      return {
        ...state,
        sectionList: action.payload,
        // textEditorDataSectionList: action.payload,
      };
    case ActionType.GET_SECTIONLIST_FAILURE:
      return {
        ...state,
        sectionList: [],
      };
    case ActionType.OPEN_ASSETS_MODAL:
      return {
        ...state,
        assetsModalOpen: true,
      };
    case ActionType.CLOSE_ASSETS_MODAL:
      return {
        ...state,
        assetsModalOpen: false,
      };
    case ActionType.TRANSFERNFT_LOADING:
      return {
        ...state,
        loadingTransferNFT: action.payload,
      };
    case ActionType.SET_NFT_TRANSFER_RESPONSE:
      return {
        ...state,
        transferNFT: action.payload,
      };
    case ActionType.EXPANDED_PANEL:
      return {
        ...state,
        expandedPanel: action.panelName,
      };
    case ActionType.SET_NFT_MOBILE_VIEW:
      return {
        ...state,
        isMobileView: action.panelName,
      };
    case ActionType.SET_NFT_DATA:
      return {
        ...state,
        nftEditData: action.payload,
      };
    case ActionType.SET_SECTION_DATA:
      return {
        ...state,
        sectionList: action.payload,
      };
    case ActionType.SET_EDITSECTION_DATA:
      return {
        ...state,
        textEditorDataSectionList: action.payload,
      };
    case ActionType.SET_NFTIMG_URL:
      return {
        ...state,
        imgUrl: action.payload,
      };
    case ActionType.SET_SHOW_ALERT:
      return {
        ...state,
        setShowAlert: action.payload,
      };
    case ActionType.SET_FIELD_TOUCHED:
      return {
        ...state,
        setFieldTouched: action.payload,
      };
    case ActionType.SET_HELP_MODAL:
      return {
        ...state,
        showHelpModal: action.payload,
      };
    case ActionType.RESET_INFO_ID_DETAILS:
      return {
        ...state,
        nftInfoById: {},
        sectionList: [],
        nftEditData: {},
        textEditorData: "",
        textEditorDataSectionList: [],
        expandedPanel: "panel3",
      };
    default:
      return { ...state };
  }
}
