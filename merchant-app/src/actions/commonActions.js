import { ActionType } from "../utils/actionTypes";

const displaySnackbar = (payload, type, button) => {
  let result = { payload, type, button };
  return { type: ActionType.DISPLAY_SNACKBAR, result };
};

const closeSnackBar = () => {
  return { type: ActionType.CLOSE_SNACKBAR };
};

const updateStepper = (step) => {
  return { type: ActionType.STEPPER_STEP, step };
};

const setPhoneNumber = (payload) => {
  return { type: ActionType.SET_PHONE_NUMBER, payload };
};

const toggleThemeState = (payload) => {
  return { type: ActionType.TOGGLE_THEME_STATE, payload };
};

const setLoading = (payload) => {
  return { type: ActionType.SET_LOADING, payload };
};

const setDrawerState = (payload, createModalOpen) => {
  window.history.replaceState(null, payload, "/" + payload);
  return { type: ActionType.SET_DRAWER_STATE, payload, createModalOpen };
};

const updateCreateModalForNFT = (payload) => {
  return { type: ActionType.UPDATE_CREATE_MODAL_FOR_NFT, payload };
};

const setModalState = (payload) => {
  return { type: ActionType.SET_MODAL_STATE, payload };
};

export const commonActions = {
  displaySnackbar,
  setDrawerState,
  setLoading,
  closeSnackBar,
  updateStepper,
  setPhoneNumber,
  setModalState,
  updateCreateModalForNFT,
  toggleThemeState,
};
