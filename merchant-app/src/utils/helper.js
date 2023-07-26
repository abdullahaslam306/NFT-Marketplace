import axios from "axios";
import jwtDecode from "jwt-decode";
import getSymbolFromCurrency from "currency-symbol-map";
import {
  getSavedUserSession,
  saveUserSession,
  removeSession,
} from "../services/localStorage";
import { authService } from "../services/authServices";
import { format } from "date-fns";

export const rules = {
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  number: "^[0-9]",
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
};

export function validateEmail(email) {
  const re = rules["email"];
  return re.test(String(email).toLowerCase());
}

export function validatePhoneForE164(phoneNumber) {
  const regEx = /^\+[1-9]\d{10,14}$/;

  return regEx.test(phoneNumber);
}

export function validatePassword(password) {
  var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  let isLengthValid = password.length > 7;
  let lc = /[a-z]/.test(password);
  let uc = /[A-Z]/.test(password);
  let sc = format.test(password);
  let number = /\d/.test(password);
  return isLengthValid && lc && uc && sc && number;
}

var WAValidator = require("wallet-address-validator");

export const trimmedString = (unTrimmedString) => {
  return String(unTrimmedString || "").trim();
};

export function removehiphenSpaces(string) {
  if (typeof string !== "string") return "";
  return string.replace(/[\s-)(]+/g, "");
}

export const validateWalletAddress = (address) => {
  var valid = WAValidator.validate(address, "ETH");
  if (valid) {
    return true;
  } else {
    return false;
  }
};

export const getCognitoUserAttributes = (congitoUserAttributes) => {
  const preferredMFA = congitoUserAttributes["preferredMFA"] || "";
  const challengeName = congitoUserAttributes["challengeName"] || "";

  // user attributes for acocunt management
  const attributes = congitoUserAttributes["attributes"] || {};
  const signInUserSession = congitoUserAttributes["signInUserSession"] || {};

  const email_verified = attributes["email_verified"] || false;
  const phone_number = attributes["phone_number"] || "";
  const phone_number_verified = attributes["phone_number_verified"] || false;

  return {
    attributes,
    email_verified,
    phone_number,
    phone_number_verified,
    signInUserSession,
    preferredMFA,
    challengeName,
  };
};

export const apiRequest = async (url, method, body) => {
  try {
    let session = getSavedUserSession();
    let headers = {};
    if (session && session.accessToken) {
      const now = Math.round(new Date().getTime() / 1000);
      let { accessToken } = session;
      let decodedToken = jwtDecode(accessToken.jwtToken);
      headers = { authorization: "Bearer " };
      if (decodedToken.exp > now) {
        headers.authorization = headers.authorization + accessToken.jwtToken;
      } else {
        await authService
          .refreshAuthorization()
          .then((response) => {
            saveUserSession(response);
            headers.authorization =
              headers.authorization + response.accessToken.jwtToken;
          })
          .catch(() => {
            removeSession();
            window.location.href = "/";
          });
      }
    }

    switch (method) {
      case "get":
        return axios.get(url, { headers: headers });
      case "delete":
        return axios.delete(url, { headers: headers });
      case "post":
        return axios.post(url, body, { headers: headers });
      case "patch":
        return axios.patch(url, body, { headers: headers });
      case "put":
        return axios.put(url, body, { headers: headers });
      default:
        return axios.get(url);
    }
  } catch (err) {
    return new Promise((resolve, reject) => {
      reject({ error: "" });
    });
  }
};

export const getCurrencySymbol = (currencyCode) => {
  let symbol = "$";
  symbol = getSymbolFromCurrency(currencyCode);
  return symbol;
};

export const checkIsMobile = (req) => {
  let userAgent;
  if (req) {
    userAgent = req.headers["user-agent"];
  } else {
    userAgent = navigator.userAgent;
  }

  let isMobile = Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );

  return { isMobile };
};

export const DatetoHumanReadableUTC = (value) => {
  return value
    ? " " + format(new Date(value), "yyyy-MM-dd HH:mm") + " UTC"
    : "N/A";
};

export const FilterDate = (value, filter = "yyyy-MM-dd") => {
  return value ? " " + format(new Date(value), filter) : "N/A";
};

export const statusCustomValue = (statusArgs = "") => {
  let statusValue = statusArgs?.toLowerCase();

  if (statusValue === "lazy") {
    return "Minted (lazy minted)";
  }
  if (statusValue === "live") {
    return "Minted (locked)";
  }
  return statusValue?.charAt(0)?.toUpperCase() + statusValue?.slice(1);
};

export const smartContractsLink = (smartContractValue) => {
  let ENV_VALUE = process.env.NEXT_PUBLIC_ENV_KEY;
  if (ENV_VALUE === "dev" || ENV_VALUE === "stg") {
    return `https://rinkeby.etherscan.io/address/${smartContractValue}`;
  } else {
    return `https://etherscan.io/address/${smartContractValue}`;
  }
};

export const openUrl = (url, openInNewTab = true) => {
  if (
    ["http://", "https://"].some((protocol) => url.indexOf(protocol) > -1) ===
    false
  ) {
    url = "http://" + url;
  }
  window.open(
    `${url}`,
    openInNewTab ? "_blank" : "_self",
    "noopener,noreferrer"
  );
};
