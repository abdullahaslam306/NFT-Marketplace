let ENV_KEY = process.env.NEXT_PUBLIC_ENV_KEY;

// Environment based session keys for different enviroments to prevent name space collisions
export const environmentBasedUniqueKey = (key) => {
  return key + "_" + ENV_KEY;
};

const USER_SESSION_KEY = environmentBasedUniqueKey("USER_SESSION_KEY");

// Theme value
const THEME_STATE = environmentBasedUniqueKey("APP_THEME_TYPE");

export const saveValueInLocalStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getValueFromLocalStorage = (key) => {
  return window.localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key) || "null")
    : null;
};

/* 
    Save the user session related information
    userSession<{} | null>
    @params:
    accessToken: string;
    refreshToken: string;
    idToken: string;
*/
export const saveUserSession = (userSession) => {
  saveValueInLocalStorage(USER_SESSION_KEY, userSession);
};

export const getSavedUserSession = () => {
  return getValueFromLocalStorage(USER_SESSION_KEY);
};

/* 
    get the Saved theme state for the application from local storage

*/
export const getSavedThemeState = () => {
  return getValueFromLocalStorage(THEME_STATE)
    ? getValueFromLocalStorage(THEME_STATE)
    : true;
};

export const removeSession = () => {
  window.localStorage.removeItem(USER_SESSION_KEY);
};
