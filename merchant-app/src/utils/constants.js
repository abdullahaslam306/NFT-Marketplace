/* 
    Note: In future, when localization is implemented, try to feed the values from JSON files based on locale

*/
export const REGEX_EMAIL =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

/* Sign In page messages */
export const SIGNUP_CONGRATULATIONS = "Congratulations!";
export const SIGNUP_CONGRATULATIONS_SUBTEXT =
  "Your account is protected. Now let’s go to explore your new account.";
export const SIGNUP_SUCCESS_MESSAGE = `Your account is activated. Please Sign in with your credentials to continue setting up your account.`;
export const SIGNIN_2FA_AUTH_TITLE = `Well done! Now help us protect your account`;
export const SIGNIN_2FA_AUTH_ENTER_PHONE_NO = `Your security is our priority! Please enter your phone number to activate two-factor authentication.`;
export const SIGNIN_2FA_VERIFY_PHONE_TITLE = `Enter 6-digit code`;
export const SIGNIN_2FA_VERIFY_PHONE_DESC_1 = `Almost done, now enter the 6-digit code we sent to `;
export const SIGNIN_2FA_VERIFY_PHONE_DESC_2 = ` to finish authentication.`;

export const SIGNIN_2FA_CODE_TITLE = "Verify your account";
export const SIGNIN_2FA_CODE_DESC =
  "Finish authentication by entering the 6-digit code we sent to ";
export const CONFRIMATION_CODE_SENT_ON_PHONE =
  "Confrmation code has been sent on your mobile number.";
export const MFA_CODE_RESENT =
  "It may take a minute to receive your code. you should be able to send a new code in ";

export const AUTH_SESSION_TIMEOUT_STATUSES = [498, 401];
export const FORBIDDEN_STATUS_CODE = 403;
export const IDTOKEN_DEFAULT_VALUE = "public";

// TODO: replace with exact session expired message
export const SESSION_EXPIRED = "SESSION expired! please login again";
export const INSUFFICIENT_PERMISSION =
  "You do not have sufficient permissions to use this feature";

/* 
    SIGNUP messages
*/
// export const resendLinkError = "Seems like you have already verified your email. Contact our administrator if the issue persists"
export const authenticateYourAccount = "Authenticate your account.";
export const resendLinkError =
  "Something went wrong while sending a link. Please try again later";
export const resendLinkEmailNotPresentError =
  "Email address of the user is not present";
export const checkEmailMessage = `Check your email & hit the link to authenticate, it will be valid
for 60 minutes.`;
export const waitForSomeTime = `It may take a minute to receive your email, check your spam folder
or if you haven’t receive it,`;
export const sendANewLink = "send a new link";
export const resentLinkTitle = "We sent a new link.";
export const resentLinkDescription =
  "Please check your email again and hit the link to authenticate your account.";
export const resentLinkSubDesc =
  "Check your spam folder if you can’t see the email or wait";
export const INCORRECT_CREDENTIALS =
  "Invalid credentials. Please re-enter the correct credentials to proceed.";

/* 
    VERIFY E-mail
*/
export const needMerchantAcc = `Need a merchant account?, hit the SIGN UP button below to
create a new account.`;
export const linkExpired = "Your link is expired.";

/* 
    MERCHANT / CONSUMER / EMAIL NOT REGISTERED
*/
export const alreadyHaveMerchantAccount = `You already have an account on Blocommerce`;
export const emailAlreadyRegistered = `is already registered
with us, hit the SIGN IN button below to access your account.`;
export const emailNotRegistered = "Your email is not registered";

/* 
    Lock & Mint Modal
*/

export const insufficientFunds = `You don’t have enough balance to cover the fees, please purchase ETH to continue your transaction`;
export const purchaseEth = `Purchase ETH`;

/* 
    BUTTON TEXTS
*/
export const signIn = "SIGN IN";
export const signUpCps = "SIGN UP";

/* 
AWS Cognito Exception types
*/
const USER_SRP_AUTH = `USER_SRP_AUTH`;
const UserNotFoundException = `UserNotFoundException`;
const notAuthorisedException = `NotAuthorizedException`;
export { USER_SRP_AUTH, UserNotFoundException, notAuthorisedException };

/*
    STEPPER Constants
*/
export const sixDigitCode = `Enter 6-digit code`;
export const authUrAcc = "Authenticate your account";
export const activate2fa = "Activate two-factor authentication";
export const signUp = "Sign Up";

/* 
    OTP field Error
*/
export const otpRequired =
  "You cannot leave this field empty. Please enter the code to authenticate your account.";
export const otpInvalid =
  "Incomplete code. Please enter the complete 6-digit code to authenticate your account.";
export const invalidAuthCode =
  "Invalid code. Please enter a valid code to verify your account";
export const invalidSession =
  "Invalid session for the user, session is expired.";

export const INVALID_CODE_AUTH_STATE =
  "Invalid code or auth state for the user.";
/* 
    ACCOUNT BLOCKED Error
*/
export const accountBlockedTitle = "Your account is blocked";
export const accountBlockDesc =
  "We are sorry, you enter a wrong password 5 times, you can try entering your password in 30 minutes.";
export const genericErrorMsg = "Something went wrong. Please try again later.";

export const VALID_FILE_EXTENSIONS_PROFILE_PICTURE = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
];
export const VALID_FILE_EXTENSIONS_THUMBNAIL = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
];

export const VALID_FILE_EXTENSIONS_ASSET_MANAGEMENT = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "mp3",
  "mp4",
  "mov",
  "webm",
  "wav",
  "glb",
];

export const MAX_PROFILE_PICTURE_SIZE = 10;

export const MAX_PROFILE_THUMBNAIL = 10;

export const MAX_ASSET_MANAGEMENT_FILE_SIZE = 100;

export const MAX_PROFILE_PICTURE_SIZE_ERROR =
  "File size exceeds maximum limit 10MB.";

export const MAX_PROFILE_THUMBNAIL_ERROR =
  "File size exceeds maximum limit 20MB.";

export const MAX_ASSET_MANAGEMENT_FILE_SIZE_ERROR =
  "File size exceeds maximum limit 100MB.";

export const FILE_EXTENSIONS_PROFILE_PICTURE_ERR =
  "Invalid format, Accepted formats are  ." +
  VALID_FILE_EXTENSIONS_PROFILE_PICTURE.join(" .");

export const FILE_EXTENSIONS_THUMBNAIL_ERR =
  "Invalid format, Accepted formats are  ." +
  VALID_FILE_EXTENSIONS_THUMBNAIL.join(" .");

export const FILE_EXTENSIONS_ASSET_MANAGEMENT_ERR = "Invalid file format.";

export const transaction_verification_text =
  "To confirm your transaction, please complete the following verification. It may take a minute to receive your codes";

export const phoneNumChangeText =
  "To update your phone number, please complete the following verification. It may take a minute to receive your codes";

export const AmplifyConfig = {
  aws_project_region: "us-east-1",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: process.env.NEXT_PUBLIC_USER_POOL_ID,
  //"us-east-1_Yh6OvPSyr",
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_USER_POOL_WEBCLIENT_ID,
  //"2ilkk68bvc8o29msqsjh3qiq6n",
  //"2abqhrejhnq2atf7kd3qg35rd1",
  oauth: {
    domain: "mfa-auth.auth.us-east-1.amazoncognito.com",
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "https://blocommerce.com/account/verify/",
    redirectSignOut: "https://blocommerce.com/",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
  aws_cognito_login_mechanisms: [],
  aws_cognito_signup_attributes: ["EMAIL"],
  aws_cognito_mfa_configuration: "ON",
  aws_cognito_mfa_types: ["SMS"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [
      "REQUIRES_LOWERCASE",
      "REQUIRES_UPPERCASE",
      "REQUIRES_NUMBERS",
      "REQUIRES_SYMBOLS",
    ],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],
};

export const NFT_LAZYMINT_CONGRALATIONS = "Congratulations.";
export const NFT_LAZYMINT_CONGRALATIONS_SUBTEXT =
  "Your NFT was successfully minted with lazy minting.";

export const NFT_LOCKMINT_CONGRALATIONS = "Your NFT is being minted.";
export const NFT_LOCKMINT_CONGRALATIONS_SUBTEXT =
  "NFT status will change to “Live” once Ethereum network confirms.";

/*
  Wallet
*/
export const WALLET_NAME_UPDATED_SUCCESSFULLY =
  "You wallet name updated successfully.";
export const WALLET_UPDATE_ERROR = "Error in updating wallet name.";

/**
 * Smart Contract
 * */
export const SMART_CONTRACTS_LIST_ERROR =
  "Error in getting smart contract list.";
export const SMART_CONTRACT_DELETE_SUCCESS =
  "Your smart contract was successfully disconnected.";
export const SMART_CONTRACT_DELETE_ERROR = "Error in deleting smart contract.";
export const SMART_CONTRACT_IMPORTED_SUCCESSFULLY =
  "Your smart contract was successfully imported.";
export const SMART_CONTRACT_IMPORTED_ERROR =
  "Error in importing smart contract.";

export const continuejourneyAccordian = [
  {
    name: "Complete your profile",
    value: "Edit your personal profile and update your security settings. ",
    link: "/profile-setting",
  },
  {
    name: "Connect your external wallet",
    value:
      "Connect one or more wallets via Metamask to your BLOCommerce account.",
    link: "/wallet-settings",
  },
  {
    name: "Import existing smart-contract",
    value:
      "Import existing ERC-721 or ERC-1155 smart-contracts to your account to index your rare NFTs.",
    link: "/wallet-settings",
  },
  {
    name: "Mint your NFTs",
    value:
      "Mint your NFTs using our intuitive minting and design tools on Blockchain.",
    link: "/nfts",
  },
  {
    name: "Analyze your NFT portfolio performance",
    value:
      "Access the comprehensive dashboard aggregating the complete transaction history for your currently or previously owned NFTs to analyze performance, assist in tax returns etc. ",
    link: "/NFTPortfolioAnalysis",
  },
];

export const PrivacyPolicy_URL = "https://www.blocommerce.com/privacy-policy";
export const TermsandConditions_URL =
  "https://www.blocommerce.com/terms-of-use";
