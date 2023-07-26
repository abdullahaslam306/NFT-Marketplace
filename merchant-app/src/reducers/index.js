import { combineReducers } from "redux";
import authReducer from "./authReducer";
import commonReducer from "./commonReducer";
import assetsReducer from "./assetsReducer";
import profileReducer from "./profileReducer";
import nftReducer from "./nftReducer";
import walletReducer from "./walletReducer";
import nftPortfolioAnalysisReducer from "./nftPortfolioAnalysisReducer"
import smartContractReducer from "./smartContractReducer";

export default combineReducers({
  authReducer,
  commonReducer,
  assetsReducer,
  profileReducer,
  nftReducer,
  walletReducer,
  nftPortfolioAnalysisReducer,
  smartContractReducer
});
