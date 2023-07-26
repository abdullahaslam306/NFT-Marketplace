import { ActionType } from "../utils/actionTypes";
import { profileService } from "../services/profileServices";
import { commonActions } from "../actions/commonActions";
import { downloadS3Base64 } from "../utils/s3Upload";
let { displaySnackbar, setLoading, setModalState } = commonActions;

const updatePassword = (payload) => {
  return (dispatch) => {
    profileService.updatePassword(payload).then(
      (payload) => {
        if (payload && payload.data && payload.data.response) {
          dispatch(setLoading(false));
          dispatch(setModalState(true));
          dispatch(success(payload.data.response));
        } else {
          dispatch(failure("error"));
        }
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(
          displaySnackbar(
            error.response &&
              error.response.data &&
              error.response.data.response
          )
        );
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.UPDATE_PASSWORD_SUCCESS, payload };
  }
  function failure(error) {
    return { type: ActionType.UPDATE_PASSWORD_FAILURE, error };
  }
};

const updatePhoneNumber = (payload) => {
  return (dispatch) => {
    profileService.updatePhoneNumber(payload).then(
      (payload) => {
        if (payload && payload.data && payload.data.response) {
          dispatch(setLoading(false));
          dispatch(setModalState(true));
          dispatch(success(payload.data.response));
          dispatch(getUserProfile());
        } else {
          dispatch(failure("error"));
        }
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(
          displaySnackbar(
            error.response &&
              error.response.data &&
              error.response.data.response
          )
        );
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.UPDATE_PHONE_SUCCESS, payload };
  }
  function failure(error) {
    return { type: ActionType.UPDATE_PHONE_FAILURE, error };
  }
};

const sendMFA = (payload, callBack = () => {}, sendMfaCheck) => {
  return (dispatch) => {
    profileService.sendMFA(payload).then(
      (payload) => {
        dispatch(setLoading(false));
        if (payload && payload.data && payload.data.response) {
          dispatch(success(payload.data.response, sendMfaCheck));
          callBack(true);
        } else {
          dispatch(failure("error"));
        }
      },
      (error) => {
        dispatch(setLoading(false));
        callBack(false);
        dispatch(
          displaySnackbar(
            error.response &&
              error.response.data &&
              error.response.data.response
          )
        );
        dispatch(failure(error));
      }
    );
  };
  function success(payload, sendMfaCheck) {
    return { type: ActionType.SEND_MFA_SUCCESS, payload, sendMfaCheck };
  }
  function failure(error) {
    return { type: ActionType.SEND_MFA_FAILURE, error };
  }
};

const resendMFA = (payload) => {
  return (dispatch) => {
    profileService.resendMFA(payload).then(
      (payload) => {
        if (payload && payload.data && payload.data.response) {
          dispatch(setLoading(false));
          dispatch(success(payload.data.response));
        } else {
          dispatch(failure("error"));
        }
      },
      (error) => {
        dispatch(setLoading(false));
        dispatch(
          displaySnackbar(
            error.response &&
              error.response.data &&
              error.response.data.response
          )
        );
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.RESEND_MFA_SUCCESS, payload };
  }
  function failure(error) {
    return { type: ActionType.RESEND_MFA_FAILURE, error };
  }
};

const getCountries = () => {
  return (dispatch) => {
    profileService.getCountries().then(
      (payload) => {
        if (payload && payload.data && payload.data.response) {
          dispatch(success(payload.data.response));
        } else {
          dispatch(success([]));
        }
      },
      (error) => {
        dispatch(success([]));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_COUNTRIES_SUCCESS, payload };
  }
};

const getLanguages = () => {
  return (dispatch) => {
    profileService.getLanguages().then(
      (payload) => {
        if (payload && payload.data && payload.data.response) {
          dispatch(success(payload.data.response));
        } else {
          dispatch(success([]));
        }
      },
      (error) => {
        dispatch(success([]));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_LANGUAGES_SUCCESS, payload };
  }
};

const getCurrencies = () => {
  return (dispatch) => {
    profileService.getCurrencies().then(
      (payload) => {
        if (payload && payload.data && payload.data.response) {
          dispatch(success(payload.data.response));
        } else {
          dispatch(success([]));
        }
      },
      (error) => {
        dispatch(success([]));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_CURRENCIES_SUCCESS, payload };
  }
};

const getStatesFromCountries = (countryCode) => {
  return (dispatch) => {
    profileService.getStatesFromCountries(countryCode).then(
      (payload) => {
        if (payload && payload.data && payload.data.response) {
          dispatch(success(payload.data.response));
        } else {
          dispatch(failure("error"));
        }
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_STATE_FROM_COUNTRY_SUCCESS, payload };
  }
  function failure(error) {
    return { type: ActionType.GET_STATE_FROM_COUNTRY_FAILURE, error };
  }
};

const getS3CredentialsForFetchingProfileImage = (filePath) => {
  return (dispatch) => {
    profileService.getS3CredentialsForFetchingProfileImage().then(
      async (payload) => {
        const response = await downloadS3Base64(filePath, payload);
        if (response) {
          dispatch(success(response));
        } else {
          dispatch(failure("error"));
        }
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return { type: ActionType.GET_PROFILE_PICTURE_SUCCESS, payload };
  }
  function failure(error) {
    return { type: ActionType.GET_PROFILE_PICTURE_FAILURE, error };
  }
};
const clearValues = () => {
  return { type: ActionType.CLEAR_PROFILE_VALUES, success: true };
};

const setUserProfile = (payload) => {
  return { type: ActionType.SET_USER_PROFILE, payload };
};

const getUserProfile = () => {
  return (dispatch) => {
    profileService.getUserProfile().then(
      (payload) => {
        dispatch(setLoading(false));
        if (payload?.data?.response?.included?.[0]?.attributes)
          dispatch(success(payload.data.response.included[0].attributes));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };
  function success(userProfile) {
    return {
      type: ActionType.GET_USER_PROFILE_SUCCESS,
      userProfile,
    };
  }
  function failure(error) {
    return {
      type: ActionType.SET_RESEND_VERIFY_LINK_FAILURE,
      error,
    };
  }
};

const getUserProfileUUID = () => {
  return (dispatch) => {
    profileService.getUserProfile().then(
      (payload) => {
        dispatch(setLoading(false));
        dispatch(success(payload.data.response.included[0]?.id));
      },
      (error) => {
        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return {
      type: ActionType.GET_USER_PROFILE_UUID_SUCCESS,
      payload,
    };
  }
  function failure(error) {
    return {
      type: ActionType.GET_USER_PROFILE_UUID_FAILURE,
      error,
    };
  }
};

const updateUserProfile = (
  payload,
  cb = null,
  cbData,
  profilePhoto = false
) => {
  return (dispatch) => {
    profileService.updateUserProfile(payload).then(
      (payload) => {
        dispatch(setLoading(false));
        dispatch(setModalState(true));
        dispatch(success(payload.data, profilePhoto));
        if (cb) {
          dispatch(cb(cbData));
        }
      },
      (error) => {
        dispatch(setLoading(false));
        if (error.response && error.response.data)
          dispatch(
            displaySnackbar(
              error.response.data.response ||
                error.response.data.message ||
                "Something went wrong!"
            )
          );
        dispatch(failure(error));
      }
    );
  };
  function success(payload, profilePhoto) {
    return {
      type: ActionType.UPDATE_USER_PROFILE_SUCCESS,
      payload,
      profilePhoto,
    };
  }
  function failure(error) {
    return {
      type: ActionType.UPDATE_USER_PROFILE_FAILURE,
      error,
    };
  }
};

const setEditedProfile = (payload) => {
  return {
    type: ActionType.EDIT_PROFILE,
    payload,
  };
};

const checkUserName = (username, callBackValidatorError) => {
  return (dispatch) => {
    profileService.checkUserName(username).then(
      (payload) => {
        dispatch(success(payload.data));
        callBackValidatorError(payload.data);
      },
      (error) => {
        callBackValidatorError(error.response.data);

        dispatch(failure(error));
      }
    );
  };
  function success(payload) {
    return {
      type: ActionType.CHECK_USERNAME_SUCCESS,
      payload,
    };
  }
  function failure(error) {
    return {
      type: ActionType.CHECK_USERNAME_FAILURE,
      error,
    };
  }
};

export const profileActions = {
  clearValues,
  getStatesFromCountries,
  getS3CredentialsForFetchingProfileImage,
  getCurrencies,
  updatePhoneNumber,
  updatePassword,
  sendMFA,
  resendMFA,
  getCountries,
  getLanguages,
  getUserProfile,
  setUserProfile,
  updateUserProfile,
  setEditedProfile,
  checkUserName,
  getUserProfileUUID,
};
