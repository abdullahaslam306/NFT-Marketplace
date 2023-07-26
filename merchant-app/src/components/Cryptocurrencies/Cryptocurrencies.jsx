import {
  Typography,
  Box,
  Grid,
  Link,
  Button,
  useMediaQuery,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getCurrencySymbol } from "../../utils/helper";
import axios from "axios";
import { useState, useEffect } from "react";
import { actions } from "../../actions";
import { useTheme } from "@mui/styles";
import SendEtherModal from "../SendEtherModal/SendEtherModal";
import ReceiveEtherModal from "../ReceiveEtherModal/ReceiveEtherModal";
import { ETHIcon, MetaMaskIconSmall } from "../../BloIcons";
import BuyCryptoTag from "../buyCryptoTag";
import SendCryptoTag from "../sendCryptoCurrency";
import ReceiveCryptoTag from "../receiveCryptoCurrency";

export default function CryptoCurrencies() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const walletReducer = useSelector(
    (state) => (state && state.walletReducer) || {}
  );
  const profile = useSelector((state) => (state && state.profileReducer) || {});
  let defaultCurrency = "USD";
  if (profile && profile.userProfile && profile.userProfile.defaultCurrency) {
    defaultCurrency = profile.userProfile.defaultCurrency;
  }
  let rateKey = defaultCurrency + "ETH";
  let currencySymbol = getCurrencySymbol(defaultCurrency);
  let fiatRate = 0;

  if (
    walletReducer &&
    walletReducer.fiatRates &&
    walletReducer.fiatRates.cryptoRate
  ) {
    fiatRate = walletReducer.fiatRates.cryptoRate[rateKey].toFixed(2);
  }

  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [buyCryptoTag, setBuyCryptoTag] = useState(false);
  const [receiveCryptoTag, setReceiveCryptoTag] = useState(false);
  const [sendCryptoTag, setSendCryptoTag] = useState(false);

  const handleSend = () => {
    setSendCryptoTag(true);
    dispatch(actions.walletActions.disableSendEther(true));
    setShowSend(true);
    setTimeout(() => {
      setSendCryptoTag(false);
    });
  };

  const closeSend = () => {
    dispatch(actions.commonActions.setModalState(false));
    setShowSend(false);
    dispatch(actions.walletActions.showSecurityModal(false));
    dispatch(actions.walletActions.clearValues(true));
  };

  const closeReceive = () => {
    dispatch(actions.commonActions.setModalState(false));
    setShowReceive(false);
  };

  const [redirectURL, setredirectURL] = useState("");
  const dispatch = useDispatch();
  let { userProfile } = profile;
  if (userProfile && userProfile.defaultCurrency) {
    defaultCurrency = profile.userProfile.defaultCurrency;
  }

  const handleBuyCrypto = async () => {
    let obj = {
      walletAddress:
        (userProfile && userProfile.wallet && userProfile.wallet.address) || "",
    };
    setBuyCryptoTag(true);

    setTimeout(() => {
      setBuyCryptoTag(false);
    }, 1000);
    if (userProfile && userProfile.address) {
      obj.street1 = userProfile.address;
      obj.address = userProfile.address;
    }
    if (userProfile && userProfile.zip) {
      obj.postalCode = userProfile.zip;
    }
    if (userProfile && userProfile.city) {
      obj.city = userProfile.city;
    }
    if (userProfile && userProfile.state) {
      obj.state = userProfile.state;
    }
    if (userProfile && userProfile.country) {
      obj.country = userProfile.country;
    }
    if (userProfile && userProfile.wallet && userProfile.wallet.address) {
      let response = await axios
        .post(process.env.NEXT_PUBLIC_WYRE_RESERVE_URL, obj)
        .catch((err) => {
          dispatch(
            actions.commonActions.displaySnackbar(
              "Error occured. Please try later."
            )
          );
        });
      if (
        response &&
        response.status === 200 &&
        response.data &&
        response.data.response
      ) {
        setredirectURL(response.data.response.url);
      } else {
        dispatch(
          actions.commonActions.displaySnackbar(
            "Error occured. Please try later."
          )
        );
      }
    } else {
      dispatch(
        actions.commonActions.displaySnackbar(
          "User has no wallet address",
          "error"
        )
      );
    }
  };
  if (redirectURL) {
    const y = window.top.outerHeight / 2 + window.top.screenY - 700 / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - 500 / 2;
    window.open(
      redirectURL,
      "_blank",
      "height=700,width=500,left=" + x + ",top=" + y
    );
    setredirectURL("");
  }

  const handleReceive = () => {
    setReceiveCryptoTag(true);
    setShowReceive(true);
    setTimeout(() => {
      setReceiveCryptoTag(false);
    });
  };

  useEffect(() => {
    dispatch(actions.walletActions.getWallets(true));
    dispatch(actions.profileActions.getUserProfile());
    const fn = () => {
      if (
        profile &&
        profile.userProfile &&
        profile.userProfile.wallet &&
        profile.userProfile.wallet.address
      ) {
        dispatch(
          actions.walletActions.getETHBalance(
            profile.userProfile.wallet.address,
            defaultCurrency
          )
        );
      }
      dispatch(
        actions.walletActions.gasEstimate(defaultCurrency, "sendCrypto")
      );
      dispatch(actions.walletActions.getRates());
    };
    fn();
    const interval = setInterval(() => fn(), 10000);
    return () => {
      clearInterval(interval);
    };
  }, [profile?.userProfile?.wallet?.address]);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        padding: matches ? "3.28rem 3.28rem 3.28rem 3rem" : "16px",
      }}
    >
      {buyCryptoTag && (
        <BuyCryptoTag
          walletAddress={
            profile &&
            profile.userProfile &&
            profile.userProfile.wallet &&
            profile.userProfile.wallet.address
          }
        />
      )}
      {sendCryptoTag && (
        <SendCryptoTag
          walletAddress={
            profile &&
            profile.userProfile &&
            profile.userProfile.wallet &&
            profile.userProfile.wallet.address
          }
        />
      )}
      {receiveCryptoTag && (
        <ReceiveCryptoTag
          walletAddress={
            profile &&
            profile.userProfile &&
            profile.userProfile.wallet &&
            profile.userProfile.wallet.address
          }
        />
      )}
      {showSend && !walletReducer.hideSendEther && (
        <SendEtherModal showModal={showSend} handlefn={closeSend} />
      )}
      {showReceive && (
        <ReceiveEtherModal showReceive={true} handleClose={closeReceive} />
      )}
      <Typography variant="h4" sx={{ fontSize: "1.75rem", mb: "22px" }}>
        Your Cryptocurrencies
      </Typography>
      <Divider />
      <Box sx={{ paddingTop: "2.5rem", paddingBottom: "1rem" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} sx={{ pt: "0!important" }}>
            <Typography variant="h4" sx={{ fontSize: "1.25rem" }}>
              Blocommerce Wallet
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              pt: "0!important",
              textAlign: "end",
              display: { md: "block", xs: "none" },
            }}
          >
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleBuyCrypto}
              style={{ margin: "0 0px 0 10px" }}
              sx={{ fontSize: "0.813rem", fontWeight: "500" }}
            >
              BUY
            </Button> */}
            <Button
              variant="outlined"
              color="secondary"
              style={{ margin: "0 0px 0 10px" }}
              onClick={handleReceive}
              sx={{
                color: theme.palette.secondary.light,
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              RECEIVE
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              style={{ margin: "0 0px 0 10px" }}
              onClick={handleSend}
              sx={{
                color: theme.palette.secondary.light,
                fontSize: "0.813rem",
                fontWeight: "500",
              }}
            >
              SEND
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex", marginTop: "10px" }}
          sx={{
            pt: "0!important",
            textAlign: "end",
            display: { md: "none !important", xs: "block" },
          }}
        >
          {/* <Button
            variant="contained"
            color="primary"
            onClick={handleBuyCrypto}
            style={{ margin: "0 0px 0 10px" }}
            sx={{ fontSize: "0.813rem", fontWeight: "500" }}
          >
            BUY
          </Button> */}
          <Button
            variant="outlined"
            color="secondary"
            style={{ margin: "0 0px 0 0px" }}
            onClick={handleReceive}
            sx={{
              color: theme.palette.secondary.light,
              fontSize: "0.813rem",
              fontWeight: "500",
            }}
          >
            RECEIVE
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ margin: "0 0px 0 10px" }}
            onClick={handleSend}
            sx={{
              color: theme.palette.secondary.light,
              fontSize: "0.813rem",
              fontWeight: "500",
            }}
          >
            SEND
          </Button>
        </Grid>
      </Box>
      {matches ? (
        <>
          <Grid
            container
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)" }}
            sx={{ background: "#383F4E" }}
          >
            <Grid item sm>
              <Typography style={{ padding: "15px", fontWeight: 500 }}>
                Asset
              </Typography>
            </Grid>
            <Grid item sm>
              <Typography style={{ padding: "15px", fontWeight: 500 }}>
                Balance
              </Typography>
            </Grid>
            <Grid item sm></Grid>
          </Grid>
          <Grid
            container
            sx={{
              flexWrap: "nowrap",
              background: "#383F4E",
            }}
          >
            <Grid
              container
              item
              sm
              style={{
                padding: "15px",
                flexWrap: "nowrap",
              }}
            >
              <Grid item sx={{ mr: "15px" }}>
                <svg
                  width="35"
                  height="57"
                  viewBox="0 0 35 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.4888 29.0344L17.5 39.3656L0.5 29.0344L17.5 0L34.4888 29.0344ZM17.5 42.6832L0.5 32.352L17.5 57L34.5 32.352L17.5 42.6832Z"
                    fill="#9A8CF2"
                  />
                </svg>
              </Grid>
              <Grid item sm>
                <Typography style={{ fontWeight: 900, fontSize: "18px" }}>
                  ETH
                </Typography>
                <Typography
                  style={{
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  1 ETH ≈ {currencySymbol}
                  {fiatRate} {defaultCurrency}
                </Typography>
              </Grid>
            </Grid>
            <Grid item sm style={{ padding: "15px 0 15px 0" }}>
              <Typography style={{ fontSize: "18px", fontWeight: 900 }}>
                {walletReducer.ethBalance &&
                  parseFloat(walletReducer.ethBalance.Eth).toFixed(6)}{" "}
                ETH
              </Typography>
              <Typography
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                {`≈ ${currencySymbol}`}
                {walletReducer.ethBalance &&
                  walletReducer.ethBalance.fiat.toFixed(2)}{" "}
                {defaultCurrency}
              </Typography>
            </Grid>
            <Grid
              item
              sm
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Link
                target="_blank"
                style={{ cursor: "pointer" }}
                href={
                  (walletReducer.ethBalance && walletReducer.ethBalance.url) ||
                  walletReducer.ethBalance === 0 ||
                  ""
                }
              >
                <Grid container>
                  <Grid item>
                    <Typography sx={{ color: theme.palette.primary.main }}>
                      View On Etherscan
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <KeyboardArrowRightIcon />
                  </Grid>
                </Grid>
              </Link>
            </Grid>
          </Grid>
        </>
      ) : (
        <Box
          sx={{
            background: theme.palette.info.main,
            width: "100%",
            float: "left",
          }}
        >
          <Grid container sx={{ padding: "25px", flexWrap: "nowrap" }}>
            <Grid item sx={{ pr: "20px" }}>
              <ETHIcon />
            </Grid>
            <Grid item>
              <Typography style={{ fontWeight: 900, fontSize: "18px" }}>
                ETH
              </Typography>
              <Typography
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                1 ETH ≈ {currencySymbol}
                {parseFloat(fiatRate).toFixed(2)} {defaultCurrency}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            sx={{ background: theme.palette.background.paper, padding: "15px" }}
          >
            <Typography style={{ padding: "15px", fontWeight: 500 }}>
              Balance
            </Typography>
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: 900,
                padding: "0px 15px 0 15px",
              }}
            >
              {walletReducer.ethBalance &&
                parseFloat(walletReducer.ethBalance.Eth).toFixed(6)}{" "}
              ETH
            </Typography>
            <Typography
              style={{
                fontSize: "14px",
                padding: "0 15px 15px 15px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {`≈ ${currencySymbol}`}
              {walletReducer.ethBalance &&
                walletReducer.ethBalance.fiat.toFixed(2)}{" "}
              {defaultCurrency}
            </Typography>
          </Grid>
          <Box sx={{ padding: "25px" }}>
            <Link
              href={
                (walletReducer.ethBalance && walletReducer.ethBalance.url) ||
                walletReducer.ethBalance === 0 ||
                ""
              }
            >
              VIEW ON ETHERSCAN
            </Link>
          </Box>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} sx={{ pt: "0!important" }}>
          <h4
            style={{
              fontSize: "1.25rem",
              margin: "0",
              paddingTop: "2.5rem",
              paddingBottom: "1rem",
            }}
          >
            External Wallets
          </h4>
        </Grid>
      </Grid>
      {walletReducer.walletList.length <= 1 &&
      walletReducer.walletList?.[0]?.attributes?.walletType ===
        "blocommerce" ? (
        <Box
          sx={{
            height: "153px",
            background: "#393F4E",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box>No external wallets connected.</Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              dispatch(actions.commonActions.setDrawerState("wallet-settings"))
            }
            startIcon={<MetaMaskIconSmall />}
            style={{ margin: "10px" }}
          >
            ADD A WALLET
          </Button>
        </Box>
      ) : (
        <>
          {walletReducer.walletsLoading ? (
            <CircularProgress style={{ marginLeft: "50%" }} color="primary" />
          ) : matches ? (
            <>
              <Grid
                container
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)" }}
                sx={{ background: "#383F4E" }}
              >
                <Grid item sm>
                  <Typography style={{ padding: "15px", fontWeight: 500 }}>
                    Asset
                  </Typography>
                </Grid>
                <Grid item sm>
                  <Typography style={{ padding: "15px", fontWeight: 500 }}>
                    Balance
                  </Typography>
                </Grid>
                <Grid item sm>
                  <Typography style={{ padding: "15px 0", fontWeight: 500 }}>
                    Wallets
                  </Typography>
                </Grid>
                <Grid item sm></Grid>
              </Grid>

              {walletReducer.walletList.map((wallet) => {
                if (wallet.attributes.walletType !== "blocommerce")
                  return (
                    <>
                      <Grid
                        container
                        sx={{
                          flexWrap: "nowrap",
                          background: "#383F4E",
                        }}
                      >
                        <Grid
                          container
                          item
                          sm
                          style={{
                            padding: "15px",
                            flexWrap: "nowrap",
                          }}
                        >
                          <Grid item sx={{ mr: "15px" }}>
                            <svg
                              width="35"
                              height="57"
                              viewBox="0 0 35 57"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M34.4888 29.0344L17.5 39.3656L0.5 29.0344L17.5 0L34.4888 29.0344ZM17.5 42.6832L0.5 32.352L17.5 57L34.5 32.352L17.5 42.6832Z"
                                fill="#9A8CF2"
                              />
                            </svg>
                          </Grid>
                          <Grid item sm>
                            <Typography
                              style={{ fontWeight: 900, fontSize: "18px" }}
                            >
                              ETH
                            </Typography>
                            <Typography
                              style={{
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.5)",
                              }}
                            >
                              1 ETH ≈ {currencySymbol}
                              {fiatRate} {defaultCurrency}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item sm style={{ padding: "15px 0 15px 0" }}>
                          <Typography
                            style={{ fontSize: "18px", fontWeight: 900 }}
                          >
                            {parseFloat(
                              wallet?.attributes?.balance?.Eth
                            ).toFixed(6)}
                            {" ETH"}
                          </Typography>
                          <Typography
                            style={{
                              fontSize: "14px",
                              color: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            {`≈ ${currencySymbol}`}
                            {(
                              wallet?.attributes?.balance?.Eth * +fiatRate
                            ).toFixed(2)}{" "}
                            {defaultCurrency}
                          </Typography>
                        </Grid>
                        <Grid item sm style={{ padding: "15px 0 15px 0" }}>
                          <Typography
                            style={{ fontSize: "18px", fontWeight: 900 }}
                          >
                            {wallet?.attributes?.name}
                          </Typography>
                          <Typography
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            {wallet?.attributes?.address}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          sm
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          <Link
                            target="_blank"
                            style={{ cursor: "pointer" }}
                            href={wallet?.attributes?.balance?.Url}
                          >
                            <Grid container>
                              <Grid item>
                                <Typography
                                  sx={{ color: theme.palette.primary.main }}
                                >
                                  View On Etherscan
                                </Typography>
                              </Grid>
                              <Grid item xs>
                                <KeyboardArrowRightIcon />
                              </Grid>
                            </Grid>
                          </Link>
                        </Grid>
                      </Grid>
                    </>
                  );
              })}
            </>
          ) : (
            <Box
              sx={{
                background: theme.palette.info.main,
                width: "100%",
                float: "left",
              }}
            >
              <Grid container sx={{ padding: "25px", flexWrap: "nowrap" }}>
                <Grid item sx={{ pr: "20px" }}>
                  <ETHIcon />
                </Grid>
                <Grid item>
                  <Typography style={{ fontWeight: 900, fontSize: "18px" }}>
                    ETH
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "14px",
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    1 ETH ≈ {currencySymbol}
                    {fiatRate} {defaultCurrency}
                  </Typography>
                </Grid>
              </Grid>
              {walletReducer.walletList.map((wallet) => {
                if (wallet.attributes.walletType !== "blocommerce")
                  return (
                    <>
                      <Grid
                        sx={{
                          background: theme.palette.background.paper,
                          padding: "15px",
                        }}
                      >
                        <Typography
                          style={{ padding: "15px", fontWeight: 500 }}
                        >
                          Balance
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "18px",
                            fontWeight: 900,
                            padding: "0px 15px 0 15px",
                          }}
                        >
                          {parseFloat(wallet?.attributes?.balance?.Eth).toFixed(
                            6
                          )}
                          {" ETH"}
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "14px",
                            padding: "0 15px 15px 15px",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {`≈ ${currencySymbol}`}
                          {(
                            wallet?.attributes?.balance?.Eth * +fiatRate
                          ).toFixed(2)}{" "}
                          {defaultCurrency}
                        </Typography>
                      </Grid>
                      <hr
                        style={{
                          margin: "0",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                        }}
                      />
                      <Grid
                        sx={{
                          background: theme.palette.background.paper,
                          padding: "15px",
                        }}
                      >
                        <Typography
                          style={{ padding: "15px", fontWeight: 500 }}
                        >
                          Wallets
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "18px",
                            fontWeight: 900,
                            padding: "0px 15px 0 15px",
                          }}
                        >
                          {wallet?.attributes?.name}
                        </Typography>

                        <Typography
                          style={{
                            fontSize: "14px",
                            padding: "0 15px 15px 15px",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          {wallet?.attributes?.address}
                        </Typography>
                      </Grid>
                      <Box sx={{ padding: "25px" }}>
                        <Link href={wallet?.attributes?.balance?.Url}>
                          VIEW ON ETHERSCAN
                        </Link>
                      </Box>
                    </>
                  );
              })}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
