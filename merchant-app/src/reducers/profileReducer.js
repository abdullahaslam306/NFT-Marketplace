import { ActionType } from "../utils/actionTypes";

export const initialState = {
  success: false,
  loading: false,
  modal: false,
  sendMFASuccess: false,
  updatePwdSuccess: false,
  updatePhoneSuccess: false,
  number: "",
  transId: "",
  countriesList: [],
  languagesList: [],
  s3Credentials: {},
  currenciesList: [],
  profileImage: "",
  statesList: [],
  userProfile: null,
  editedProfile: null,
  isValidUsername: true,
  updateProfileSuccess: false,
  profileUUID: "",
};

/* Reducer to store the common attributes for the  app */
export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.SET_PHONE_NUMBER_CHANGE:
      return {
        ...state,
        modal: action.payload.modal,
        number: action.payload.number,
      };
    case ActionType.GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        countriesList: action.payload,
      };
    case ActionType.GET_LANGUAGES_SUCCESS:
      return {
        ...state,
        languagesList: action.payload,
      };
    case ActionType.GET_USER_PROFILE_UUID_SUCCESS:
      return {
        ...state,
        profileUUID: action.payload,
      };

    case ActionType.GET_USER_PROFILE_UUID_FAILURE:
      return {
        ...state,
        profileUUID: "",
      };

    case ActionType.GET_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        profileImage: action.payload,
      };
    case ActionType.GET_CURRENCIES_SUCCESS:
      return { ...state, currenciesList: action.payload };
    case ActionType.GET_S3_CREDENTIALS_FOR_PROFILE_PIC_SUCCESS:
      return { ...state, s3Credentials: action.payload };
    case ActionType.LOADING_S3_CREDENTIALS:
      return {
        ...state,
        s3Credentials: { ...state.s3Credentials, loading: action.payload },
      };
    case ActionType.GET_STATE_FROM_COUNTRY_SUCCESS:
      return { ...state, statesList: action.payload };
    case ActionType.RESEND_MFA_SUCCESS:
      let transcId = "";
      if (action.payload && action.payload.data && action.payload.data.id) {
        transcId = action.payload.data.id;
      }
      return {
        ...state,
        transId: transcId,
      };
    case ActionType.SEND_MFA_SUCCESS:
      let transId = "";
      if (action.payload && action.payload.data && action.payload.data.id) {
        transId = action.payload.data.id;
      }
      return {
        ...state,
        sendMFASuccess: action.sendMfaCheck? false : true ,
        transId: transId,
        phoneNumber: action.payload.data.attributes.phone,
        email: action.payload.data.attributes.email,
        sendMFACryptoSuccess : action.sendMfaCheck || false
      };
    case ActionType.UPDATE_PASSWORD_SUCCESS:
      return { ...state, updatePwdSuccess: true, sendMFASuccess: false };
    case ActionType.UPDATE_PHONE_SUCCESS:
      return {
        ...state,
        updatePhoneSuccess: true,
        sendMFASuccess: false,
      };
    case ActionType.CLEAR_PROFILE_VALUES:
      return {
        ...state,
        sendMFASuccess: false,
        updatePwdSuccess: false,
        updatePhoneSuccess: false,
        updateProfileSuccess: false,
        transId: "",
      };
    case ActionType.SET_USER_PROFILE:
      return { ...state, userProfile: action.payload, loading: false };
    case ActionType.GET_USER_PROFILE_SUCCESS:
      return { ...state, userProfile: action.userProfile };
    case ActionType.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        editedProfile: {},
        updateProfileSuccess: action.profilePhoto ? false : true,
      };
    case ActionType.EDIT_PROFILE:
      return { ...state, editedProfile: action.payload };
    case ActionType.CHECK_USERNAME_SUCCESS:
      return {
        ...state,
        isValidUsername:
          action.payload &&
          action.payload.response &&
          action.payload.response.data &&
          action.payload.response.data.attributes &&
          action.payload.response.data.attributes.isAvailable
            ? true
            : false,
      };
    case ActionType.CHECK_USERNAME_FAILURE:
      return {
        ...state,
        isValidUsername: false,
      };
    default:
      return { ...state };
  }
}
