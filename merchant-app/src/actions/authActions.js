import { saveUserSession } from "../services/localStorage";
import { ActionType } from "../utils/actionTypes";
import { authService } from "../services/authServices";
import { commonActions } from "./commonActions";
import { invalidAuthCode } from "../utils/constants";
import { INCORRECT_CREDENTIALS } from "../utils/constants";
let { displaySnackbar, setLoading, updateStepper } = commonActions;

/* 
    Set the user session
*/

const setUserSession = (payload) => {
  return (dispatch) => {
    authService.setUserSession(payload).then(
      (payload) => {
        dispatch(success(payload));
        dispatch(setLoading(false));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(failure(error.error));
      }
    );
  };
  function success(listappuser) {
    return { type: ActionType.SET_USER_SESSION_SUCCESS, listappuser };
  }
  function failure(error) {
    return { type: ActionType.SET_USER_SESSION_FAILURE, error };
  }
};

const confirmLogin = (cognitoUser, code) => {
  return (dispatch) => {
    authService.confirmLogin(cognitoUser, code).then(
      (payload) => {
        setTimeout(() => {
          dispatch(setLoading(false));
          dispatch(closeSFA());
        }, 3000);
        if (payload.signInUserSession) {
          saveUserSession(payload.signInUserSession);
        }
        dispatch(success(payload));
      },
      (error) => {
        dispatch(displaySnackbar(invalidAuthCode, "error"));
        dispatch(setLoading(false));
        dispatch(failure(error.toString()));
      }
    );
  };
  function success(listappuser) {
    return {
      type: ActionType.SET_MFA_SUCCESS,
      listappuser,
    };
  }
  function failure(error) {
    return {
      type: ActionType.SET_MFA_FAILURE,
      error,
    };
  }
};
const closeSFA = () => {
  return {
    type: ActionType.CLOSE_SFA,
  };
};
const resendSignUpVerifyLink = (email) => {
  return (dispatch) => {
    authService.resendSignUpVerifyLink(email).then(
      (payload) => {
        dispatch(setLoading(false));
        dispatch(success(payload));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(failure(error.toString()));
      }
    );
  };
  function success(listappuser) {
    return {
      type: ActionType.SET_RESEND_VERIFY_LINK_SUCCESS,
      listappuser,
    };
  }
  function failure(error) {
    return {
      type: ActionType.SET_RESEND_VERIFY_LINK_FAILURE,
      error,
    };
  }
};

const setCognitoUserForIntermediateAction = (payload) => {
  return (dispatch) => {
    authService.enableSMSMFA(payload).then(
      (payload) => {
        dispatch(success(payload));
      },
      (error) => dispatch(failure(error.toString()))
    );
  };
  function success(listappuser) {
    return {
      type: ActionType.SET_COGNITO_USER_FOR_INTERMEDIATE_ACTION,
      listappuser,
    };
  }
  function failure(error) {
    return {
      type: ActionType.SET_COGNITO_USER_FOR_INTERMEDIATE_ACTION_FAILURE,
      error,
    };
  }
};

/*
 SIGN IN action creator
*/
const signInUserAction = (user) => {
  return (dispatch) => {
    authService.loginWithEmailPwd(user.email, user.password).then(
      (listappuser) => {
        dispatch(setLoading(false));
        dispatch(success(listappuser));
      },
      (error) => {
        dispatch(setLoading(false));
        if (error && error.code && error.code === "NotAuthorizedException") {
          dispatch(displaySnackbar(INCORRECT_CREDENTIALS, "error"));
        }
        dispatch(failure(error));
      }
    );
  };
  function success(listappuser) {
    return { type: ActionType.SIGN_IN_USER_SUCCESS_AUTH_SUCCESS, listappuser };
  }
  function failure(error) {
    return { type: ActionType.SIGN_IN_USER_ERROR, error };
  }
};

const forgotPwd = (email) => {
  return (dispatch) => {
    authService.forgotPwd(email).then(
      (listappuser) => {
        dispatch(setLoading(false));
        dispatch(success(listappuser));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(
          displaySnackbar(
            error &&
              error.response &&
              error.response.data &&
              error.response.data.response,
            "error"
          )
        );
        dispatch(failure(error.toString()));
      }
    );
  };
  function success(listappuser) {
    return { type: ActionType.FORGOT_PASSWORD_SUCCESS, listappuser };
  }
  function failure(error) {
    return { type: ActionType.FORGOT_PASSWORD_FAILURE, error };
  }
};

const logoutUser = () => {
  return (dispatch) => {
    authService.logoutUser().then(
      (listappuser) => {
        dispatch(setLoading(false));
        dispatch(success(listappuser));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(failure(error.toString()));
      }
    );
  };
  function success(listappuser) {
    return { type: ActionType.LOGOUT_SUCCESS, listappuser };
  }
  function failure(error) {
    return { type: ActionType.LOGOUT_FAILURE, error };
  }
};

const signUp = (payload) => {
  return (dispatch) => {
    authService.signUp(payload).then(
      (listappuser) => {
        dispatch(setLoading(false));
        dispatch(updateStepper(1));
        dispatch(success(listappuser));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(failure(error));
      }
    );
  };
  function success(listappuser) {
    return { type: ActionType.SIGN_UP_USER_SUCCESS, listappuser };
  }
  function failure(error) {
    let errMsg =
      (error && error.response && error.response.data) || error.toString();
    return { type: ActionType.SIGN_UP_USER_FAILURE, errMsg };
  }
};

const confirmSignUp = (email, code) => {
  return (dispatch) => {
    authService.confirmSignUp(email, code).then(
      (listappuser) => {
        setTimeout(()=>{
        dispatch(setLoading(false));
        }, 5000)
        dispatch(success(listappuser));
      },
      (error) => {
        setTimeout(()=>{
          dispatch(setLoading(false));
          }, 5000)
        dispatch(failure(error));
      }
    );
  };
  function success(listappuser) {
    return { type: ActionType.CONFIRM_SIGNUP_SUCCESS, listappuser };
  }
  function failure(error) {
    return { type: ActionType.CONFIRM_SIGNUP_FAILURE, error };
  }
};

const forgotPwdSubmit = (payload) => {
  return (dispatch) => {
    authService.forgotPasswordSubmit(payload).then(
      (listappuser) => {
        dispatch(setLoading(false));
        dispatch(success(listappuser));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(
          displaySnackbar(
            error &&
              error.response &&
              error.response.data &&
              error.response.data.response,
            "error"
          )
        );
        dispatch(failure(error));
      }
    );
  };
  function success(listappuser) {
    return { type: ActionType.FORGOT_PASSWORD_SUBMIT_SUCCESS, listappuser };
  }
  function failure(error) {
    return { type: ActionType.FORGOT_PASSWORD_SUBMIT_FAILURE, error };
  }
};

const addPhoneNumber = (payload, token) => {
  return (dispatch) => {
    authService.addPhoneNumber(payload, token).then(
      (result) => {
        dispatch(setLoading(false));
        dispatch(success(result));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(
          displaySnackbar(
            (error &&
              error.response &&
              error.response.data &&
              error.response.data.response) ||
              error.toString(),
            "error"
          )
        );
        dispatch(failure(error));
      }
    );
  };
  function success(result) {
    return { type: ActionType.ADD_PHONE_NUMBER_SUCCESS, result };
  }
  function failure(error) {
    return { type: ActionType.ADD_PHONE_NUMBER_FAILURE, error };
  }
};

const verifyPhoneNumber = (payload, token) => {
  return (dispatch) => {
    authService.verifyPhoneNumber(payload, token).then(
      (result) => {
        //dispatch(setLoading(false));
        dispatch(success(result));
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(displaySnackbar(invalidAuthCode, "error"));
        dispatch(commonActions.updateStepper(4));
        // dispatch(
        //   displaySnackbar(
        //     (error &&
        //       error.response &&
        //       error.response.data &&
        //       error.response.data.message) ||
        //       error.toString(),
        //     "error"
        //   )
        // );
        dispatch(failure(error));
      }
    );
  };
  function success(result) {
    return { type: ActionType.VERIFY_PHONE_NUMBER_SUCCESS, result };
  }
  function failure(error) {
    return { type: ActionType.VERIFY_PHONE_NUMBER_FAILURE, error };
  }
};

const setEmailVerificationLoading = (payload) => {
  return { type: ActionType.SET_EMAIL_VERIFICATON_LOADING, payload };
};

const setFirstTimeUserFalse = () => {
  return { type: ActionType.FIRST_TIME_USER_FALSE };
};

export const authActions = {
  logoutUser,
  signInUserAction,
  setCognitoUserForIntermediateAction,
  setUserSession,
  confirmLogin,
  resendSignUpVerifyLink,
  forgotPwd,
  signUp,
  confirmSignUp,
  forgotPwdSubmit,
  addPhoneNumber,
  verifyPhoneNumber,
  closeSFA,
  setEmailVerificationLoading,
  setFirstTimeUserFalse
};
