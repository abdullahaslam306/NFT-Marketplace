export const ActionType = {
  SET_USER_SESSION_SUCCESS: "SET_USER_SESSION_SUCCESS",
  SET_USER_SESSION_FAILURE: "SET_USER_SESSION_FAILURE",
  SET_COGNITO_USER_FOR_INTERMEDIATE_ACTION:
    "SET_COGNITO_USER_FOR_INTERMEDIATE_ACTION",
  SET_COGNITO_USER_FOR_INTERMEDIATE_ACTION_FAILURE:
    "SET_COGNITO_USER_FOR_INTERMEDIATE_FAILURE",
  SIGN_IN_USER: "SIGN_IN_USER",
  SIGN_IN_USER_ERROR: "SIGN_IN_USER_ERROR",
  SIGN_IN_USER_DOES_NOT_EXISTS: "SIGN_IN_USER_DOES_NOT_EXISTS",
  SIGN_IN_USER_SUCCESS_AUTH_SUCCESS: "SIGN_IN_USER_SUCCESS_AUTH_SUCCESS",
  SIGN_IN_INTERIMN_STATE: "SIGN_IN_INTERIMN_STATE",
  DISPLAY_SNACKBAR: "DISPLAY_SNACKBAR",
  CLOSE_SNACKBAR: "CLOSE_SNACKBAR",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  LOGOUT_FAILURE: "LOGOUT_FAILURE",
  STEPPER_STEP: "STEPPER_STEP",
  TOGGLE_THEME_STATE: "TOGGLE_THEME_STATE",
  SHOW_2FA_SCREEN: "SHOW_2FA_SCREEN",
  REGISTER_USER: "REGISTER_USER",
  REGISTER_USER_SUCCESS: "REGISTER_USER_SUCCESS",
  REGISTER_USER_ERROR: "REGISTER_USER_ERROR",
  SIGN_UP_USER: "SIGN_UP_USER",
  SIGN_UP_USER_SUCCESS: "SIGN_UP_USER_SUCCESS",
  SIGN_UP_USER_FAILURE: "SIGN_UP_USER_FAILURE",
  CONFIRM_SIGNUP_SUCCESS: "CONFIRM_SIGNUP_SUCCESS",
  SET_EMAIL_VERIFICATON_LOADING: "SET_EMAIL_VERIFICATON_LOADING",
  CONFIRM_SIGNUP_FAILURE: "CONFIRM_SIGNUP_FAILURE",
  SET_LOADING: "SET_LOADING",
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_DRAWER_STATE: "SET_DRAWER_STATE",
  SET_MODAL_STATE: "SET_MODAL_STATE",
  SET_USER_PROFILE: "SET_USER_PROFILE",
  GET_USER_PROFILE: "GET_USER_PROFILE",
  UPDATE_USER_PROFILE_SUCCESS: "UPDATE_USER_PROFILE_SUCCESS",
  UPDATE_USER_PROFILE_FAILURE: "UPDATE_USER_PROFILE_FAILURE",
  SET_VERIFY_NUMBER: "SET_VERIFY_NUMBER",
  SET_VERIFY_RESEND_CODE: "SET_VERIFY_RESEND_CODE",
  SET_VERIFY_NUMBER_SUCCESS: "SET_VERIFY_NUMBER_SUCCESS",
  SET_SUCCESS_SCREEN_CLOSE: "SET_SUCCESS_SCREEN_CLOSE",
  RESET_ROOT_VALUE: "RESET_ROOT_VALUE",
  ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
  RESET_AUTH: "RESET_AUTH",
  SET_MFA_SUCCESS: "SET_MFA_SUCCESS",
  SET_MFA_FAILURE: "SET_MFA_FAILURE",
  CLOSE_SFA: "CLOSE_SFA",
  SET_RESEND_VERIFY_LINK_SUCCESS: "SET_RESEND_VERIFY_LINK_SUCCESS",
  SET_RESEND_VERIFY_LINK_FAILURE: "SET_RESEND_VERIFY_LINK_FAILURE",
  SET_PASSWORD_CHANGE: "SET_PASSWORD_CHANGE",
  SET_PHONE_NUMBER_CHANGE: "SET_PHONE_NUMBER_CHANGE",
  ADD_PHONE_NUMBER_SUCCESS: "ADD_PHONE_NUMBER_SUCCESS",
  ADD_PHONE_NUMBER_FAILURE: "ADD_PHONE_NUMBER_FAILURE",
  VERIFY_PHONE_NUMBER_SUCCESS: "VERIFY_PHONE_NUMBER_SUCCESS",
  VERIFY_PHONE_NUMBER_FAILURE: "VERIFY_PHONE_NUMBER_FAILURE",
  GET_USER_PROFILE_SUCCESS: "GET_USER_PROFILE_SUCCESS",
  SET_PHONE_NUMBER: "SET_PHONE_NUMBER",
  FORGOT_PASSWORD_SUCCESS: "FORGOT_PASSWORD_SUCCESS",
  FORGOT_PASSWORD_FAILURE: "FORGOT_PASSWORD_FAILURE",
  FORGOT_PASSWORD_SUBMIT_SUCCESS: "FORGOT_PASSWORD_SUBMIT_SUCCESS",
  FORGOT_PASSWORD_SUBMIT_FAILURE: "FORGOT_PASSWORD_SUBMIT_FAILURE",
  SIDE_BAR_CLICKED: "SIDE_BAR_CLICKED",
  FIRST_TIME_USER_FALSE: "FIRST_TIME_USER_FALSE",
  GAS_ESTIMATE_LOADING_TRUE:"GAS_ESTIMATE_LOADING_TRUE",

  //profile screen
  GET_COUNTRIES_SUCCESS: "GET_COUNTRIES_SUCCESS",
  GET_COUNTRIES_FAILURE: "GET_COUNTRIES_FAILURE",
  GET_LANGUAGES_SUCCESS: "GET_LANGUAGES_SUCCESS",
  GET_LANGUAGES_FAILURE: "GET_LANGUAGES_FAILURE",
  GET_CURRENCIES_SUCCESS: "GET_CURRENCIES_SUCCESS",
  GET_CURRENCIES_FAILURE: "GET_CURRENCIES_FAILURE",
  GET_STATE_FROM_COUNTRY_SUCCESS: "GET_STATE_FROM_COUNTRY_SUCCESS",
  GET_STATE_FROM_COUNTRY_FAILURE: "GET_STATE_FROM_COUNTRY_FAILURE",
  GET_S3_CREDENTIALS_FOR_PROFILE_PIC_SUCCESS:
    "GET_S3_CREDENTIALS_FOR_PROFILE_PIC_SUCCESS",
  GET_S3_CREDENTIALS_FOR_PROFILE_PIC_FAILURE:
    "GET_S3_CREDENTIALS_FOR_PROFILE_PIC_FAILURE",
  LOADING_S3_CREDENTIALS: "LOADING_S3_CREDENTIALS",
  EDIT_PROFILE: "EDIT_PROFILE",
  CHECK_USERNAME_SUCCESS: "CHECK_USERNAME_SUCCESS",
  CHECK_USERNAME_FAILURE: "CHECK_USERNAME_FAILURE",
  GET_PROFILE_PICTURE_SUCCESS: "GET_PROFILE_PICTURE_SUCCESS",
  GET_PROFILE_PICTURE_FAILURE: "GET_PROFILE_PICTURE_FAILURE",
  UPDATE_PASSWORD_SUCCESS: "UPDATE_PASSWORD_SUCCESS",
  UPDATE_PASSWORD_FAILURE: "UPDATE_PASSWORD_FAILURE",
  UPDATE_PHONE_SUCCESS: "UPDATE_PHONE_SUCCESS",
  UPDATE_PHONE_FAILURE: "UPDATE_PHONE_FAILURE",
  SEND_MFA_SUCCESS: "SEND_MFA_SUCCESS",
  SEND_MFA_FAILURE: "SEND_MFA_FAILURE",
  RESEND_MFA_SUCCESS: "RESEND_MFA_SUCCESS",
  RESEND_MFA_FAILURE: "RESEND_MFA_FAILURE",
  CLEAR_PROFILE_VALUES: "CLEAR_PROFILE_VALUES",
  GET_USER_PROFILE_UUID_SUCCESS: "GET_USER_PROFILE_UUID_SUCCESS",
  GET_USER_PROFILE_UUID_FAILURE: "GET_USER_PROFILE_UUID_FAILURE",

  //wallet
  GET_ETH_BALANCE_SUCCESS: "GET_ETH_BALANCE_SUCCESS",
  GET_ETH_BALANCE_FAILURE: "GET_ETH_BALANCE_FAILURE",
  GAS_ESTIMATE_SUCCESS: "GAS_ESTIMATE_SUCCESS",
  GAS_ESTIMATE_LOADING: "GAS_ESTIMATE_LOADING",
  GAS_ESTIMATE_FAILURE: "GAS_ESTIMATE_FAILURE",
  GET_RATES_SUCCESS: "GET_RATES_SUCCESS",
  GET_RATES_FAILURE: "GET_RATES_FAILURE",
  SHOW_SECURITY_MODAL: "SHOW_SECURITY_MODAL",
  TRANSFER_ETH_SUCCESS: "TRANSFER_ETH_SUCCESS",
  TRANSFER_ETH_FAILURE: "TRANSFER_ETH_FAILURE",
  UPDATE_WALLET_NAME: "UPDATE_WALLET_NAME",
  UPDATE_WALLET_NAME_RESPONSE: "UPDATE_WALLET_NAME_RESPONSE",
  GET_WALLETS_SUCCESS: "GET_WALLETS_SUCCESS",
  GET_WALLETS_FAILURE: "GET_WALLETS_FAILURE",
  UPDATE_WALLETS_LIST_ITEM: "UPDATE_WALLETS_LIST",
  GET_WALLETS_LOADING: "GET_WALLETS_LOADING",
  CLEAR_WALLET_REDUCER: "CLEAR_WALLET_REDUCER",
  DISABLE_HIDE_SEND_ETHER: "DISABLE_HIDE_SEND_ETHER",

  //Assets
  GET_ASSETS_SUCCESS: "GET_ASSETS_SUCCESS",
  ASSETS_LOADING: "ASSETS_LOADING",
  FETCHED_ALL_ASSETS: "FETCHED_ALL_ASSETS",
  IS_DELETING_ASSET: "IS_DELETING_ASSET",
  SEARCH_QUERY: "SEARCH_QUERY",
  NO_ASSETS: "NO_ASSETS",

  //NFT Related Actions
  CREATE_NFT_INITIATE: "CREATE_NFT_INITIATE",
  CREATE_NFT_LOADING: "CREATE_NFT_LOADING",
  CREATE_NFT_SUCCESS: "CREATE_NFT_SUCCESS",
  CREATE_NFT_FAILURE: "CREATE_NFT_FAILURE",
  UPDATE_CREATE_MODAL_FOR_NFT: "UPDATE_CREATE_MODAL_FOR_NFT",

  NFT_SEARCH: "NFT_SEARCH",
  NFT_FILTER: "NFT_FILTER",
  CLEAR_NFT_LIST: "CLEAR_NFT_LIST",
  UPDATE_PAGE_NUMBER_NFT: "UPDATE_PAGE_NUMBER_NFT",
  LIST_NFT_SUCCESS: "LIST_NFT_SUCCESS",
  LIST_NFT_FAILURE: "LIST_NFT_FAILURE",
  LIST_NFT_LOADING: "LIST_NFT_LOADING",
  UPDATE_NFT_INITIATE: "UPDATE_NFT_INITIATE",
  UPDATE_NFT_LOADING: "UPDATE_NFT_LOADING",
  UPDATE_NFT_SUCCESS: "UPDATE_NFT_SUCCESS",
  UPDATE_NFT_FAILURE: "UPDATE_NFT_FAILURE",
  OPEN_ASSETS_MODAL: "OPEN_ASSETS_MODAL",
  CLOSE_ASSETS_MODAL: "CLOSE_ASSETS_MODAL",
  GET_BLOCKCHAININFO_BYID_SUCCESS: "GET_BLOCKCHAININFO_BYID_SUCCESS",
  GET_BLOCKCHAININFO_BYID_FAILURE: "GET_BLOCKCHAININFO_BYID_FAILURE",
  GET_BLOCKCHAININFO_BYID_LOADING: "GET_BLOCKCHAININFO_BYID_LOADING",
  GET_TRASACTIONHISTORY_BYID_SUCCESS: "GET_TRASACTIONHISTORY_BYID_SUCCESS",
  GET_TRASACTIONHISTORY_BYID_FAILURE: "GET_TRASACTIONHISTORY_BYID_FAILURE",
  GET_TRASACTIONHISTORY_BYID_LOADING: "GET_TRASACTIONHISTORY_BYID_LOADING",
  GET_SECTIONLIST_SUCCESS: "GET_SECTIONLIST_SUCCESS",
  GET_SECTIONLIST_FAILURE: "GET_SECTIONLIST_FAILURE",
  GET_SECTIONLIST_LOADING: "GET_SECTIONLIST_LOADING",
  SET_NFT_TRANSFER_RESPONSE: "SET_NFT_TRANSFER_RESPONSE",
  TRANSFERNFT_LOADING: "TRANSFERNFT_LOADING",
  GETNFTINFOBYID_SUCCESS: "GETNFTINFOBYID_SUCCESS",
  GETNFTINFOBYID_FAILURE: "GETNFTINFOBYID_FAILURE",
  GETNFTINFOBYID_LOADING: "GETNFTINFOBYID_LOADING",
  EXPANDED_PANEL: "EXPANDED_PANEL",
  SET_NFT_MOBILE_VIEW: "SET_NFT_MOBILE_VIEW",
  SET_NFT_DATA: "SET_NFT_DATA",
  SET_SECTION_DATA: "SET_SECTION_DATA",
  SET_EDITSECTION_DATA: "SET_EDITSECTION_DATA",

  SET_NFTIMG_URL: "SET_NFTIMG_URL",
  SET_SHOW_ALERT: "SET_SHOW_ALERT",
  SET_FIELD_TOUCHED: "SET_FIELD_TOUCHED",
  RESET_INFO_ID_DETAILS: "RESET_INFO_ID_DETAILS",
  SET_HELP_MODAL: "SET_HELP_MODAL",
  NEW_NFT_MINTED: "NEW_NFT_MINTED",

  GET_PORTFOLIO_STATS_SUCCESS: "GET_PORTFOLIO_STATS_SUCCESS",
  GET_PORTFOLIO_STATS_LOADING: "GET_PORTFOLIO_STATS_LOADING",
  GET_TRANSACTION_STATS_LOADING: "GET_TRANSACTION_STATS_LOADING",
  GET_EARNINGS_STATS_LOADING: "GET_EARNINGS_STATS_LOADING",
  GET_SPENDINGS_STATS_LOADING: "GET_SPENDINGS_STATS_LOADING",
  GET_PORTFOLIO_STATS_FAILURE: "GET_PORTFOLIO_STATS_FAILURE",
  GET_TRANSACTION_STATS_SUCCESS: "GET_TRANSACTION_STATS_SUCCESS",
  GET_TRANSACTION_STATS_FAILURE: "GET_TRANSACTION_STATS_FAILURE",
  GET_SPENDINGS_STATS_SUCCESS: "GET_SPENDINGS_STATS_SUCCESS",
  GET_SPENDINGS_STATS_FAILURE: "GET_SPENDINGS_STATS_FAILURE",
  GET_EARNINGS_STATS_SUCCESS: "GET_EARNINGS_STATS_SUCCESS",
  GET_EARNINGS_STATS_FAILURE: "GET_EARNINGS_STATS_FAILURE",
  GET_NFT_TRANSACTION_SUCCESS: "GET_NFT_TRANSACTION_SUCCESS",
  GET_NFT_TRANSACTION_LOADING: "GET_NFT_TRANSACTION_LOADING",
  GET_NFT_TRANSACTION_FAILURE: "GET_NFT_TRANSACTION_FAILURE",

  //Smart Contract Actions
  SET_SMART_CONTRACTS_LIST: "SET_SMART_CONTRACTS_LIST",
  UPDATE_SMART_CONTRACT_LIST: "UPDATE_SMART_CONTRACT_LIST",
  DELETE_SMART_CONTRACT: "DELETE_SMART_CONTRACT",
  DELETE_SMART_CONTRACT_SUCCESS: "DELETE_SMART_CONTRACT_SUCCESS",
  IMPORT_SMART_CONTRACT_RESPONSE: "IMPORT_SMART_CONTRACT_RESPONSE",
};
