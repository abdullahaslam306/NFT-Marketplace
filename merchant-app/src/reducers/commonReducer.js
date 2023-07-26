import { ActionType } from "../utils/actionTypes";

export const initialState = {
  themeState: "dark",
  loading: false,
  modal: false,
  isSnackBarOpen: false,
  snackbarMessage: "",
  snackBarType: "error",
  snackBarButton: "",
  isMFAEnabled: false,
  isPhoneVerified: false,
  stepperStep: 0,
  drawer: "dashboard",
  number: "",
  numberEntered: false,
  verifyNumber: false,
  createModalOpen: false,
};

/* Reducer to store the common attributes for the  app */
const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.DISPLAY_SNACKBAR:
      return {
        ...state,
        isSnackBarOpen: true,
        snackbarMessage: action.result.payload,
        snackBarType: action.result.type,
        snackBarButton: action.result.button,
      };
    case ActionType.CLOSE_SNACKBAR:
      return {
        ...state,
        isSnackBarOpen: false,
        snackbarMessage: "",
      };
    case ActionType.STEPPER_STEP:
      return {
        ...state,
        stepperStep: action.step,
      };
    case ActionType.TOGGLE_THEME_STATE:
      return {
        ...state,
        themeState: action.payload,
      };
    case ActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case ActionType.SET_DRAWER_STATE:
      return {
        ...state,
        drawer: action.payload,
        createModalOpen: action.createModalOpen,
      };
    case ActionType.UPDATE_CREATE_MODAL_FOR_NFT:
      return {
        ...state,
        createModalOpen: action.payload,
      };
    case ActionType.SET_MODAL_STATE:
      return {
        ...state,
        modal: action.payload,
      };
    case ActionType.SET_PHONE_NUMBER:
      return {
        ...state,
        number: action.payload,
      };
    case ActionType.SET_VERIFY_RESEND_CODE:
      return {
        ...state,
        numberEntered: false,
      };
    case ActionType.SET_VERIFY_NUMBER_SUCCESS:
      return {
        ...state,
        verifyNumber: true,
      };
    case ActionType.RESET_ROOT_VALUE:
      return {
        ...initialState,
      };
    case ActionType.SET_SUCCESS_SCREEN_CLOSE:
      return {
        ...state,
        isPhoneVerified: true,
      };
    default:
      return { ...state };
  }
};

export default commonReducer;
