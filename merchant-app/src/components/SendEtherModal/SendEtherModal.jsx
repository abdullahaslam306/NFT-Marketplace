import { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Button, OutlinedInput, Grid, TextField } from "@mui/material";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import { validateWalletAddress } from "../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import SecurityVerificationComponent from "../SecurityVerificationModal/SecurityVerificationModal";
import Lottie from "react-lottie";
import animationData from "../successModal/lottiesAnimationData.json";
import { getCurrencySymbol } from "../../utils/helper";
import CustomModal from "../Modal/Modal";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { actions } from "../../actions";
let { walletActions, profileActions, commonActions } = actions;

export default function SendEtherModal({ showModal, handlefn }) {
  const [showWarning, setshowWarning] = useState(false);
  const [addrvalue, setaddrValue] = useState("");
  const [showError, setShowErr] = useState(false);
  const [emailotp, setemailotp] = useState("");
  const [phoneotp, setphoneotp] = useState("");
  const [etherVal, setetherVal] = useState();
  const [total, setTotal] = useState(0);
  const [fiat, setFiat] = useState(0);
  const [fiatTotal, setFiatTotal] = useState(0);
  const [lowBalance, setlowBalance] = useState(false);
  const theme = useTheme();
  const [showSameWalletError, setshowSameWalletError] = useState(false);

  const handlePhoneOTPFn = (otpVal) => {
    setphoneotp(otpVal);
  };

  const handleEmailOTPFn = (otpVal) => {
    setemailotp(otpVal);
  };

  const walletReducer = useSelector(
    (state) => (state && state.walletReducer) || {}
  );
  const profileReducer = useSelector(
    (state) => (state && state.profileReducer) || {}
  );
  const commonReducer = useSelector(
    (state) => (state && state.commonReducer) || {}
  );

  const dispatch = useDispatch();
  let defaultCurrency = "USD";
  if (
    profileReducer &&
    profileReducer.userProfile &&
    profileReducer.userProfile.defaultCurrency
  ) {
    defaultCurrency = profileReducer.userProfile.defaultCurrency;
  }
  let rateKey = defaultCurrency + "ETH";
  let currencySymbol = getCurrencySymbol(defaultCurrency);
  let fiatRate = 0;

  if (walletReducer && walletReducer.fiatRates) {
    fiatRate = walletReducer.fiatRates.cryptoRate[rateKey];
  }

  const resendCodeClicked = (type) => {
    dispatch(
      profileActions.resendMFA({
        transactionUid: profileReducer && profileReducer.transId,
        action: "sendCrypto",
        channel: type,
      })
    );
  };
  useEffect(() => {
    dispatch(actions.commonActions.setModalState(true));
    if (
      profileReducer &&
      profileReducer.userProfile &&
      profileReducer.userProfile.wallet &&
      profileReducer.userProfile.wallet.address
    ) {
      dispatch(
        walletActions.getETHBalance(
          profileReducer.userProfile.wallet.address,
          defaultCurrency
        )
      );
    }
    dispatch(walletActions.gasEstimate(defaultCurrency, "sendCrypto"));
    if (
      profileReducer &&
      profileReducer.sendMFASuccess &&
      !walletReducer.sendEtherSuccess
    ) {
      dispatch(walletActions.showSecurityModal(true));
    }
  }, []);

  const handleClose = () => {
    if (walletReducer.sendEtherSuccess) {
      dispatch(walletActions.showSecurityModal(false));
    }
    handlefn();
  };

  const showSecurityModal = walletReducer.showSecurityModal;

  const handleConfirm = () => {
    dispatch(commonActions.setLoading(true));
    dispatch(profileActions.sendMFA({ action: "sendCrypto" }, () => {}, true));
    dispatch(walletActions.showSecurityModal(true));
  };

  const handleConfirmTransaction = () => {
    dispatch(commonActions.setLoading(true));
    dispatch(
      walletActions.transferETH({
        to: addrvalue,
        value: etherVal,
        transactionUid: profileReducer.transId,
        emailCode: emailotp,
        phoneCode: phoneotp,
      })
    );
  };

  const handleChange = (prop) => (event) => {
    let { value } = event["target"];
    if (value) {
      setshowWarning(true);
    }
    setaddrValue(value);
    if (!validateWalletAddress(value)) {
      setShowErr(true);
    } else {
      setShowErr(false);
    }
    if (value === profileReducer?.userProfile?.wallet?.address) {
      setshowSameWalletError(true);
    } else {
      setshowSameWalletError(false);
    }
  };

  const handleEtherValChange = (event) => {
    event.preventDefault();
    const validated = new RegExp(/^[+]?([0-9]{0,})*[.]?([0-9]{0,6})?$/);

    if (validated.test(event.target.value)) {
      setetherVal(event.target.value);
      setFiat((fiatRate * event.target.value).toFixed(2));
    } else {
      setetherVal((prevVal) => {
        if (typeof prevVal === "undefined") {
          return "";
        } else return prevVal;
      });
    }

    if (
      walletReducer &&
      walletReducer.gasEstimate &&
      walletReducer.gasEstimate.response &&
      walletReducer.gasEstimate.response.EstimateInETH
    ) {
      let gasEstimate = parseFloat(
        walletReducer.gasEstimate.response.EstimateInETH
      );
      setTotal(parseFloat(event.target.value.toString()) + gasEstimate);
      let bal = parseFloat(
        walletReducer &&
          walletReducer.ethBalance &&
          walletReducer.ethBalance.Eth
      );
      if (bal < parseFloat(event.target.value.toString()) + gasEstimate) {
        setlowBalance(true);
      } else {
        setlowBalance(false);
      }
    }
    if (
      walletReducer &&
      walletReducer.gasEstimate.response &&
      walletReducer.gasEstimate.response.Fiat
    ) {
      setFiatTotal(
        (
          fiatRate * event.target.value +
          parseFloat(walletReducer.gasEstimate.response.Fiat)
        ).toFixed(2)
      );
    }
    if (!event.target.value || event.target.value === "0") {
      setFiatTotal("");
      setTotal("");
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (
    (commonReducer.loading || walletReducer.sendEtherSuccess) &&
    !walletReducer.sendEtherFailure
  ) {
    return (
      <div
        style={{
          padding: "25px",
          background: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box>
          {!walletReducer.sendEtherSuccess && (
            <>
              <LoadingIndicator
                title={"Confirming your transaction..."}
                isModal={true}
              />
            </>
          )}
          <CustomModal
            isCloseButton={true}
            showModal={showModal}
            onClose={handlefn}
          >
            {walletReducer.sendEtherSuccess && (
              <Box
                sx={{ padding: "30px", maxWidth: { sm: "100%", md: "450px" } }}
              >
                <Box>
                  <Lottie options={defaultOptions} height={154} width={154} />
                </Box>
                <Box
                  sx={{
                    height: "80px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "60px",
                        color: "#24D182",
                        textAlign: "right",
                      }}
                    >
                      {etherVal}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      style={{ marginTop: "37px", marginLeft: "10px" }}
                    >
                      ETH
                    </Typography>
                  </Box>
                </Box>
                <Typography style={{ textAlign: "center" }}>
                  {currencySymbol}
                  {parseFloat(fiatRate * etherVal).toFixed(6)} {defaultCurrency}
                </Typography>
                <div
                  style={{
                    marginTop: "15px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.5)",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    float: "left",
                    marginTop: "30px",
                  }}
                >
                  <div style={{ float: "left" }}>
                    <Typography style={{ marginTop: "5px" }}>
                      Max Gas Fee
                    </Typography>
                  </div>
                  <div style={{ float: "right" }}>
                    <Typography
                      style={{ fontSize: "14px", textAlign: "right" }}
                    >
                      {walletReducer.gasEstimate &&
                        walletReducer.gasEstimate.response &&
                        parseFloat(
                          walletReducer.gasEstimate.response.EstimateInETH
                        ).toFixed(6)}{" "}
                      ETH
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "14px",
                        textAlign: "right",
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      $
                      {walletReducer.gasEstimate &&
                        walletReducer.gasEstimate.response &&
                        walletReducer.gasEstimate.response.Fiat.toFixed(2)}{" "}
                      {defaultCurrency}
                    </Typography>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    float: "left",
                    marginTop: "30px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ float: "left" }}>
                    <Typography style={{ marginTop: "5px" }}>Total</Typography>
                  </div>
                  <div style={{ float: "right" }}>
                    <Typography
                      style={{ fontSize: "14px", textAlign: "right" }}
                    >
                      {total.toFixed(6)} ETH
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "14px",
                        textAlign: "right",
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {currencySymbol}
                      {fiatTotal} {defaultCurrency}
                    </Typography>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    float: "left",
                    marginBottom: "40px",
                  }}
                >
                  <div style={{ float: "left" }}>
                    <Typography>ETH sent to</Typography>
                  </div>
                  <div style={{ float: "right" }}>
                    <Typography
                      style={{ fontSize: "14px", textAlign: "right" }}
                    >
                      {addrvalue.substr(0, 9)}...
                      {addrvalue.substr(addrvalue.length - 4)}
                    </Typography>
                  </div>
                </div>
                <Grid
                  style={{ marginTop: "40px" }}
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Button
                      onClick={handleClose}
                      color="primary"
                      variant="contained"
                    >
                      {"GO TO MY WALLET"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CustomModal>
        </Box>
      </div>
    );
  }
  return (
    <>
      {showSecurityModal && (
        <>
          <SecurityVerificationComponent
            handlefn={handlefn}
            showModal={true}
            emailotp={emailotp}
            phoneotp={phoneotp}
            handleEmailOTPFn={handleEmailOTPFn}
            handlePhoneOTPFn={handlePhoneOTPFn}
            handleConfirmTransaction={handleConfirmTransaction}
            resendCodeClicked={resendCodeClicked}
          />
        </>
      )}
      {!showSecurityModal && (
        <CustomModal
          isCloseButton={true}
          showModal={showModal}
          onClose={handlefn}
        >
          <Box sx={{ padding: "25px", maxWidth: "450px" }}>
            <Typography
              variant="h4"
              style={{ marginTop: "25px", marginBottom: "10px" }}
            >
              Send Ether
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Balance:{" "}
              {(walletReducer &&
                walletReducer.ethBalance &&
                parseFloat(walletReducer.ethBalance.Eth).toFixed(6)) ||
                0}{" "}
              ETH - {currencySymbol}
              {(walletReducer &&
                walletReducer.ethBalance &&
                walletReducer.ethBalance.fiat.toFixed(2)) ||
                0}{" "}
              {defaultCurrency}
            </Typography>
            <div>
              <TextField
                variant="standard"
                value={etherVal}
                type="text"
                onChange={handleEtherValChange}
                placeholder={"0"}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    color: "#00E387",
                    fontStyle: "normal",
                    fontWeight: 300,
                    fontSize: "60px",
                    float: "left",
                    margin: "0",
                    maxWidth: "400px",
                    border: "none",
                  },
                  endAdornment: (
                    <Typography
                      variant="h4"
                      style={{ width: "200px", marginTop: "15px" }}
                    >
                      ETH
                    </Typography>
                  ),
                }}
              />
            </div>
            <Typography variant="h4">
              {currencySymbol}
              {fiat} {defaultCurrency}
            </Typography>
            {lowBalance && (
              <Typography
                sx={{ fontSize: "12px", color: theme.palette.error.dark }}
              >
                You don’t have enough balance to cover the fees
              </Typography>
            )}

            {showWarning && (
              <>
                <p
                  style={{
                    fontSize: "16px",
                    width: "100%",
                    float: "left",
                  }}
                >
                  Make sure you enter a correct wallet address,
                  <span style={{ color: "#ebb440" }}>
                    &nbsp;an incorrect one will result in permanent loss of
                    crypto assets.
                  </span>
                </p>
              </>
            )}
            <OutlinedInput
              type="text"
              value={addrvalue}
              id="address"
              name="address"
              onChange={handleChange("address")}
              placeholder="To: Wallet Address"
              fullWidth
              autoComplete={"false"}
              style={{ marginTop: "30px" }}
            />
            {showError && (
              <Typography color="error" style={{ fontSize: "12px" }}>
                Please enter a correct wallet address
              </Typography>
            )}
            {showSameWalletError && (
              <Typography color="error" style={{ fontSize: "12px" }}>
                You cannot send cryptocurrency to the same wallet address.
              </Typography>
            )}
            {!showError && addrvalue && (
              <>
                <div
                  style={{
                    width: "100%",
                    float: "left",
                    marginTop: "30px",
                  }}
                >
                  <div style={{ float: "left" }}>
                    <Typography style={{ marginTop: "5px" }}>
                      Max Gas Fee
                    </Typography>
                  </div>
                  <div style={{ float: "right" }}>
                    <Typography
                      style={{ fontSize: "14px", textAlign: "right" }}
                    >
                      {walletReducer.gasEstimate &&
                        walletReducer.gasEstimate.response &&
                        parseFloat(
                          walletReducer?.gasEstimate?.response?.EstimateInETH
                        ).toFixed(6)}{" "}
                      ETH
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "14px",
                        textAlign: "right",
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      $
                      {walletReducer.gasEstimate &&
                        walletReducer.gasEstimate.response &&
                        walletReducer.gasEstimate.response.Fiat.toFixed(2)}{" "}
                      {defaultCurrency}
                    </Typography>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    float: "left",
                    marginTop: "30px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ float: "left" }}>
                    <Typography style={{ marginTop: "5px" }}>Total</Typography>
                  </div>
                  <div style={{ float: "right" }}>
                    <Typography
                      style={{ fontSize: "14px", textAlign: "right" }}
                    >
                      {total && total.toFixed(6)} ETH
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "14px",
                        textAlign: "right",
                        color: "rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {"$"}
                      {fiatTotal && parseFloat(fiatTotal).toFixed(2)} USD
                    </Typography>
                  </div>
                </div>
              </>
            )}
            <Button
              onClick={handleConfirm}
              variant="contained"
              color="primary"
              disabled={
                showError ||
                lowBalance ||
                !addrvalue ||
                showSameWalletError ||
                !etherVal ||
                etherVal === "0"
                  ? true
                  : false
              }
              style={{
                float: "right",
                marginTop: "20px",
                marginBottom: "20px",
                marginRight: 0,
              }}
            >
              CONFIRM&nbsp;&nbsp;
              <ArrowForwardSharpIcon />
            </Button>
          </Box>
        </CustomModal>
      )}
    </>
  );
}
