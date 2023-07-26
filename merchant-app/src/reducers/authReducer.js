import { saveUserSession } from "../services/localStorage";
import { ActionType } from "../utils/actionTypes";

const initialState = {
  userSession: null,
  isAuthenticated: false,
  isAuthenticatedWithNewUser: false,
  userDoesNotExists: false,
  cognitoUserForIntermediateAction: null,
  loading: false,
  email: "",
  error: null,
  show2FA: false,
  MFA_success: false,
  phone: false,
  isRegistered: false,
  isEmailVerified: false,
  isPhoneVerified: true,
  signUpResponse: null,
  isEmailAlreadyExists: false,
  isMerchant: false,
  showCheckEmail: false,
  showRestLink: false,
  isUserNotRegistered: false,
  showOTP: false,
  forgotPwdSuccess: false,
  showUserNotFound: false,
  inValidCreds: false,
  transId: "",
  setAuth: false,
  emailisAuthenticated: false,
  userAlreadyConfirmed: false,
  isEmailVerificationLoading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_USER_SESSION_SUCCESS:
      return {
        ...state,
        userSession: action.listappuser,
        isAuthenticated: !!action.listappuser,
        setAuth: true,
      };
    case ActionType.SET_USER_SESSION_FAILURE:
      return {
        ...state,
        error: action.error,
        setAuth: true,
      };
    case ActionType.SET_COGNITO_USER_FOR_INTERMEDIATE_ACTION:
      return { ...state, cognitoUserForIntermediateAction: action.payload };
    case ActionType.SIGN_IN_USER:
      let { payload } = action;
      let { email } = payload;
      return { ...state, loading: true, email };
    case ActionType.SIGN_IN_USER_ERROR:
      let showEmailScreen = false;
      let showUserNotFound = false;
      let inValidCreds = false;
      if (
        action.error &&
        action.error.code &&
        action.error.code === "NotAuthorizedException"
      ) {
        inValidCreds = true;
      }
      if (
        action.error &&
        action.error.code &&
        action.error.code === "UserNotConfirmedException"
      ) {
        showEmailScreen = true;
      }
      if (
        action.error &&
        action.error.code &&
        action.error.code === "UserNotFoundException"
      ) {
        showUserNotFound = true;
      }
      return {
        ...state,
        loading: false,
        error: action.payload,
        showCheckEmail: showEmailScreen,
        showUserNotFound: showUserNotFound,
        inValidCreds: inValidCreds,
      };
    case ActionType.SET_RESEND_VERIFY_LINK_SUCCESS:
      return { ...state, showCheckEmail: true, showRestLink: true };
    case ActionType.SIGN_IN_USER_DOES_NOT_EXISTS:
      return { ...state, userDoesNotExists: true };
    case ActionType.SIGN_IN_USER_SUCCESS_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        show2FA:
          action.listappuser.challengeName ||
          (action.listappuser.attributes &&
            action.listappuser.attributes.phone_number_verified),
        cognitoUserForIntermediateAction: action.listappuser,
        isPhoneVerified:
          action.listappuser.challengeName ||
          (action.listappuser.attributes &&
            action.listappuser.attributes.phone_number_verified),
        isEmailVerified:
          action.listappuser.attributes &&
          action.listappuser.attributes.email_verified,
        emailisAuthenticated: false,
      };
    case ActionType.SIGN_IN_INTERIMN_STATE:
      return { ...state, loading: false, show2FA: true };
    case ActionType.RESET_AUTH:
      return { ...initialState };
    case ActionType.LOGOUT_SUCCESS:
      return { ...initialState };
    case ActionType.SET_MFA_SUCCESS:
      return {
        ...state,
        cognitoUserForIntermediateAction: action.listappuser,
        userSession: action.listappuser.signInUserSession,
        // show2FA: false,
        MFA_success: true,
        isAuthenticated: true,
      };
    case ActionType.SET_MFA_FAILURE:
      return {
        ...state,
        error: action.error,
        show2FA: false,
      };
    case ActionType.CLOSE_SFA:
      return {
        ...state,
        show2FA: false,
      };
    case ActionType.SIGN_UP_USER_SUCCESS:
      return {
        ...state,
        signUpResponse: action.listappuser.config,
        isRegistered: true,
      };
    case ActionType.SIGN_UP_USER_FAILURE:
      let isMerchant =
        action.errMsg &&
        action.errMsg.responseCode &&
        action.errMsg.responseCode === "MerchantAccountExistsException";
      return {
        ...state,
        signUpResponse: action.errMsg,
        isEmailAlreadyExists: true,
        isMerchant: isMerchant,
      };
    case ActionType.SET_EMAIL_VERIFICATON_LOADING:
      return {
        ...state,
        isEmailVerificationLoading: action.payload,
      };
    case ActionType.CONFIRM_SIGNUP_SUCCESS:
      return {
        ...state,
        isEmailVerified: true,
        emailisAuthenticated: true,
        isEmailVerificationLoading: false,
      };
    case ActionType.CONFIRM_SIGNUP_FAILURE:
      if (
        action.error &&
        action.error.code &&
        action.error.code === "NotAuthorizedException" &&
        action.error.message &&
        action.error.message.indexOf("CONFIRMED")
      ) {
        return {
          ...state,
          isEmailVerified: true,
          resp: true,
          userAlreadyConfirmed: true,
          isEmailVerificationLoading: false,
        };
      }
      return {
        ...state,
      };
    case ActionType.ADD_PHONE_NUMBER_SUCCESS:
      return {
        ...state,
        phone: true,
      };
    case ActionType.VERIFY_PHONE_NUMBER_SUCCESS:
      saveUserSession(state.cognitoUserForIntermediateAction.signInUserSession);
      return {
        ...state,
        isAuthenticated: true,
        isPhoneVerified: true,
        isAuthenticatedWithNewUser: true,
      };

      case ActionType.FIRST_TIME_USER_FALSE:
        return {
          ...state,
          isAuthenticatedWithNewUser: false,
        };  
    case ActionType.FORGOT_PASSWORD_SUCCESS:
      let transId = "";
      if (
        action.listappuser &&
        action.listappuser.data &&
        action.listappuser.data.response &&
        action.listappuser.data.response.data &&
        action.listappuser.data.response.data.id
      ) {
        transId = action.listappuser.data.response.data.id;
      }
      return {
        ...state,
        showOTP: true,
        transId: transId,
      };
    case ActionType.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        isUserNotRegistered: true,
      };
    case ActionType.FORGOT_PASSWORD_SUBMIT_SUCCESS:
      return {
        ...state,
        showOTP: false,
        forgotPwdSuccess: true,
      };
    case ActionType.FORGOT_PASSWORD_SUBMIT_FAILURE:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default authReducer;
