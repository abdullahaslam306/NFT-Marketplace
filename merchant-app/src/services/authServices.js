import { Auth } from "aws-amplify";
import { trimmedString } from "../utils/helper";
import axios from "axios";
import { apiRequest } from "../utils/helper";

let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const signUp = (payload) => {
  return axios.post(`${API_BASE_URL}/api/v1/merchant/register`, payload);
};

/**
 *  Send a new link to resend verify email link
 * @param email
 * @returns
 */
function resendSignUpVerifyLink(email) {
  return Auth.resendSignUp(trimmedString(email));
}

/**
 * Enable SMS MFA using AWS Auth
 * @param congnitoUser
 * @returns
 */
function enableSMSMFA(congnitoUser) {
  return new Promise(async (resolve, reject) => {
    Auth.setPreferredMFA(congnitoUser, "SMS")
      .then((user) => {
        Auth.enableSMS(congnitoUser)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

function updatePhoneNumber({ congintoUser, phone_number }) {
  return new Promise((resolve, reject) => {
    Auth.updateUserAttributes(congintoUser, {
      phone_number,
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

/**
 * GET current user information using Amplify Auth
 * @returns
 */
function currentUserInfo() {
  return Auth.currentUserInfo();
}

/**
 * first time signup, when user clicks on the authenticate user link/button
 *  use the confirmSignup auth method to validate the user
 * Note: the params are to be fetched from the qury string for this workflow
 * @param email
 * @param authCode
 * @returns
 */
function confirmSignUp(email, authCode) {
  return new Promise((resolve, reject) => {
    Auth.confirmSignUp(trimmedString(email), authCode)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 *
 * @param email
 * @param password
 * @returns
 */
function loginWithEmailPwd(email, password) {
  return new Promise((resolve, reject) => {
    Auth.signIn(trimmedString(email), password)
      .then((userAttribute) => resolve(userAttribute))
      .catch((err) => reject(err));
  });
}

// User not confirmed exception
// if the user tries to sign in without confirming the email during sign up
// resend the email verification link to the user and inform them to verify email
// this should trigger the same lambda as the custom lambda triggered previously for signup
const resendConfirmationEmail = (username) => {
  return Auth.resendSignUp(username);
};

// use the following method to logout an user from amplify
const logoutUser = () => {
  localStorage.clear();
  return Auth.signOut();
};

// Login with MFA flow, when MFA is enabled and user has to enter the code along with email address
/**
 *
 * @param cognitoUser
 * @param code
 * @returns
 */
function confirmLogin(cognitoUser, code) {
  return new Promise((resolve, reject) => {
    Auth.confirmSignIn(cognitoUser, code, "SMS_MFA")
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

/**
 *  Refresh the authozization Token
 *  To be used when working on user session handling
 * @returns {Promise}
 */
async function refreshAuthorization() {
  return new Promise(async (resolve, reject) => {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const currentSession = await Auth.currentSession();
    cognitoUser.refreshSession(
      currentSession.getRefreshToken(),
      async (err, session) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(session);
        }
      }
    );
  });
}

//these two apis use axios directly, because token is not set in the session yet.
function addPhoneNumber(payload, token) {
  return axios.patch(
    `${API_BASE_URL}/api/v1/merchant/add-phone`,
    {
      phoneNumber: payload,
    },
    {
      headers: { authorization: `Bearer ${token}` },
    }
  );
}
function verifyPhoneNumber(payload, token) {
  return axios.post(`${API_BASE_URL}/api/v1/merchant/verify-phone`, payload, {
    headers: { authorization: `Bearer ${token}` },
  });
}

// forgot password api
const forgotPwd = (email) => {
  // return Auth.forgotPassword(trimmedString(email));
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/auth/forgot-password/initiate`,
    "put",
    { action: "forgotPassword", email: trimmedString(email) }
  );
};

const forgotPasswordSubmit = (payload) => {
  //return Auth.forgotPasswordSubmit(email, otp, new_password);
  return apiRequest(
    `${API_BASE_URL}/api/v1/merchant/profile/forgot-password/update`,
    "patch",
    payload
  );
};

const setUserSession = (cognitoUser) => {
  return new Promise((resolve, reject) => {
    if (cognitoUser) {
      resolve(cognitoUser);
    } else {
      reject({ error: "" });
    }
  });
};

export const authService = {
  forgotPasswordSubmit,
  forgotPwd,
  verifyPhoneNumber,
  resendConfirmationEmail,
  addPhoneNumber,
  refreshAuthorization,
  confirmLogin,
  loginWithEmailPwd,
  logoutUser,
  confirmSignUp,
  currentUserInfo,
  signUp,
  updatePhoneNumber,
  enableSMSMFA,
  resendSignUpVerifyLink,
  setUserSession,
};
