import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicButton from "../../Button/BasicButton";
import Modal from "../../Modal/ModalV2";
import { useSendNFTStyles } from "./SendNftModalStyles";
import { SendNFTOTPComponent } from "./SendNFTOTPComponent";
import CustomizedTables from "./SendNFTTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Divider,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  FormHelperText,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { walletActions } from "../../../actions/walletActions";
import { validateWalletAddress } from "../../../utils/helper";
import { useTheme } from "@mui/system";
import { NoImageIcon } from "../../../BloIcons/index";
import { getTempCredentialsForAsset } from "../../../services/assetsService";
import { downloadS3Base64 } from "../../../utils/s3Upload";
import { actions } from "../../../actions";
import { LoadingIndicator } from "../../LoadingIndicator/LoadingIndicator";
import { getCurrencySymbol } from "../../../utils/helper";
import SuccessModal from "../../successModal/index";

function NFTSendComponent({
  openSendNFT,
  handleCloseSendNFT,
  selectedNft,
  setIsNftTransfered,
}) {
  const dispatch = useDispatch();
  const { title, totalEditions, owners, assets, id } = selectedNft || {};
  const editions = {
    external: 0,
    blocommerce:
      selectedNft?.owners?.find((owner) => owner?.walletType === "blocommerce")
        ?.editionsOwned || 0,
  };
  selectedNft?.owners?.forEach((owner) => {
    if (owner?.walletType === "external")
      editions.external = editions.external + owner.editionsOwned;
  });

  const availableEdition = owners?.[0]?.editionsOwned;
  const [values, setValues] = React.useState({
    walletAddress: "",
    totalEditions: "1",
    amount: null,
    showZeroErr: false,
  });
  const [thumbnaliPath, setThumbnaliPath] = useState("");
  const [tempCred, setTempCredentials] = useState({});
  const [showError, setShowErr] = useState(false);
  const [showEditionError, setShowEditionErr] = useState(false);
  const [showBalanceError, setShowBalanceError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSameWalletError, setshowSameWalletError] = useState(false);
  const [showWarning, setshowWarning] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState("step1");

  const user = useSelector((state) => state.profileReducer);
  let defaultCurrency = "USD";
  if (user && user.userProfile && user.userProfile.defaultCurrency) {
    defaultCurrency = user.userProfile.defaultCurrency;
  }
  const { loadingTransferNFT, transferNFT } = useSelector(
    (state) => state.nftReducer || {}
  );
  const walletReducer = useSelector((state) => state.walletReducer);

  let currencySymbol = getCurrencySymbol(defaultCurrency);

  useEffect(() => {
    if (typeof walletActions !== "undefined") {
      dispatch(
        actions.walletActions.getETHBalance(
          user.userProfile.wallet.address,
          defaultCurrency
        )
      );
      if (values.walletAddress && values.totalEditions) {
        dispatch(
          walletActions.gasEstimate(
            defaultCurrency,
            "sendNft",
            values.totalEditions,
            values.walletAddress,
            id
          )
        );
      }
    }
    setLoading(true);
    getTempCredentialsForAsset().then((res) => {
      setTempCredentials(res);
    });
  }, []);

  useEffect(() => {
    const { ethBalance, gasEstimate } = walletReducer;
    if (
      ethBalance &&
      gasEstimate &&
      ethBalance.Eth < gasEstimate.response.EstimateInETH
    ) {
      setShowBalanceError(true);
    }
  }, [walletReducer]);

  useEffect(() => {
    if (assets?.length) {
      if (assets[0]?.bucketName) {
        downloadS3Base64(
          assets[0]?.thumbnailPath,
          tempCred,
          "",
          assets[0].bucketName
        ).then((thumbnailData) => {
          setLoading(false);
          setThumbnaliPath(thumbnailData);
        });
      } else {
        setThumbnaliPath(
          assets[0].thumbnailPath?.replace("ipfs:/", "https://ipfs.io/ipfs")
        );
      }
    } else {
      setLoading(false);
      setThumbnaliPath("");
    }
  }, [tempCred]);

  useEffect(() => {
    dispatch(
      walletActions.gasEstimateLoadingTrue()
    );
  },[]);

  const handleChange = (event) => {
    let { value } = event["target"];
    if (value && event.target.name === "totalEditions") {
      value = +value.replace(/\D/g, "");
    }
    if (value) {
      setshowWarning(true);
    }
    if (value === 0 && event.target.name === "totalEditions") {
      setValues({
        ...values,
        showZeroErr: true,
        [event.target.name]: value,
      });
    } else {
      setValues({
        ...values,
        showZeroErr: false,
        [event.target.name]: value,
      });
      if (
        event.target.name === "totalEditions" &&
        event.target.value &&
        event.target.value !== "0" &&
        values.walletAddress
      ) {
        dispatch(
          walletActions.gasEstimate(
            defaultCurrency,
            "sendNft",
            value,
            values.walletAddress,
            id
          )
        );
      }
    }

    if (
      !validateWalletAddress(value) &&
      event.target.name === "walletAddress"
    ) {
      setShowErr(true);
    } else {
      setShowErr(false);
      if (event.target.name === "walletAddress") {
        dispatch(
          walletActions.gasEstimate(
            defaultCurrency,
            "sendNft",
            values.totalEditions,
            value,
            id
          )
        );
      }
    }
    if (value === user?.userProfile?.wallet?.address) {
      setshowSameWalletError(true);
    }

    if (event.target.name === "totalEditions") {
      if (parseInt(value) > availableEdition || value === "0") {
        setShowEditionErr(true);
      } else {
        setShowEditionErr(false);
      }
    }
  };
  const sendNFTClick = () => {
    setConfirmSubmit("step2");
    dispatch(
      actions.profileActions.sendMFA({ action: "sendNft" }, () => {}, true)
    );
  };

  const sendNftClasses = useSendNFTStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loadingTransferNFT) {
    return (
      <LoadingIndicator isModal={true} title="Confirming your transaction..." />
    );
  } else if (transferNFT && transferNFT.responseCode === "NFT Transfered") {
    return (
      <SuccessModal
        text={"Your transaction is completed"}
        open={true}
        onActionButtonClick={() => {
          setIsNftTransfered(true);
          handleCloseSendNFT();
        }}
        showActionButton={true}
        actionButtonText={"GO TO MY NFT WALLET"}
        subTextDisplay={true}
      />
    );
  }

  return (
    <Modal
      open={openSendNFT}
      onClose={handleCloseSendNFT}
      margin={confirmSubmit === "step1" ? "70px 15px" : null}
    >
      <div
        className={sendNftClasses.container}
        style={{ maxWidth: confirmSubmit === "step2" ? "450px" : "650px" }}
      >
        <Typography
          variant="h4"
          style={{ margin: "60px  0px 20px 0px", backgroundColor: "inherit" }}
          data-testid="send-nft-modal-title"
        >
          {confirmSubmit === "step1" ? "Send NFT " : "Security Verification "}
          {/* Security Verification */}
        </Typography>
        {confirmSubmit === "step2" ? (
          <SendNFTOTPComponent
            {...{ values, id, setConfirmSubmit, handleCloseSendNFT }}
          />
        ) : (
          <>
            {isMobile ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "35%",
                    }}
                  >
                    {thumbnaliPath === "" ? (
                      <NoImageIcon
                        id={"emptyImage"}
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      />
                    ) : (
                      <img
                        id={"thumbnailedImage"}
                        alt={"thumbnail"}
                        src={thumbnaliPath}
                        style={{
                          width: "80px",
                          height: "80px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ marginLeft: "15px", width: "65%" }}>
                    <p className={sendNftClasses.mobileViewSendNFT}>
                      Title: {title}
                    </p>
                    <Divider className={sendNftClasses.divider} />
                    <p
                      className={sendNftClasses.mobileViewSendNFT}
                      style={{ fontWeight: "900", fontSize: "20px" }}
                    >
                      # of editions
                    </p>
                    <p className={sendNftClasses.mobileViewSendNFT}>
                      BLOcommerce: {editions?.blocommerce}
                    </p>
                    <p className={sendNftClasses.mobileViewSendNFT}>
                      External Wallets: {editions?.external}
                    </p>
                    <p className={sendNftClasses.mobileViewSendNFT}>
                      Total Editions: {totalEditions}
                    </p>
                  </div>
                </div>
                <div style={{ color: "#B6AEF6", margin: " 20px 0 0 0" }}>
                  You can only send NFTs owned in your BLOCommerce wallet.
                </div>
              </>
            ) : (
              <>
                <CustomizedTables
                  {...{
                    title,
                    totalEditions,
                    thumbnaliPath,
                    availableEdition,
                    editions,
                  }}
                />
                <div style={{ color: "#B6AEF6" }}>
                  You can only send NFTs owned in your BLOCommerce wallet.
                </div>
                <Divider className={sendNftClasses.divider} />
              </>
            )}
            {values.walletAddress && showWarning && (
              <Typography
                variant="p"
                style={{ margin: "20px 0 10px 0" }}
                paragraph={true}
              >
                Make sure you enter a correct wallet address,
                <span className={sendNftClasses.messageWalletAddress}>
                  an incorrect one will result in permanent loss of NFT assets.
                </span>
              </Typography>
            )}
            <TextField
              margin="normal"
              fullWidth
              label="Wallet Address"
              name="walletAddress"
              variant="outlined"
              placeholder="To: Wallet Address"
              error={showError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {values.walletAddress && !showError ? (
                      <CheckCircleIcon style={{ color: "#00E387" }} />
                    ) : values.walletAddress && showError ? (
                      <CancelIcon style={{ color: "#eb0808" }} />
                    ) : null}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setValues({ ...values, walletAddress: "" })}
                  >
                    {values.walletAddress && (
                      <CloseIcon
                        style={{ color: "#ffffff", cursor: "pointer" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={handleChange}
              value={values.walletAddress}
            />
            {showError && values.walletAddress && (
              <FormHelperText
                style={{
                  color: "#EE463C",
                  fontStyle: "400",
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                Invalid Address. Please enter a correct wallet address.
              </FormHelperText>
            )}
            {showSameWalletError && (
              <FormHelperText
                style={{
                  color: "#EE463C",
                  fontStyle: "400",
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                You cannot send NFT to the same wallet address.
              </FormHelperText>
            )}
            <TextField
              margin="normal"
              fullWidth
              label="# of editions"
              name="totalEditions"
              variant="outlined"
              onChange={handleChange}
              value={values.totalEditions}
              error={showEditionError}
            />
            {showEditionError && values.totalEditions && !showBalanceError ? (
              <FormHelperText
                style={{
                  color: "#EE463C",
                  fontStyle: "400",
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                You don’t have enough number of edition to transfer, please{" "}
                <span style={{ color: "#24d182" }}>enter</span> valid number of
                edition to continue your transaction
              </FormHelperText>
            ) : !showEditionError &&
              values.totalEditions &&
              showBalanceError ? (
              <FormHelperText
                style={{
                  color: "#EE463C",
                  fontStyle: "400",
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                You don’t have enough balance to cover the fees, please{" "}
                <span style={{ color: "#24d182" }}>purchase</span> more ETH to
                continue your transaction
              </FormHelperText>
            ) : showEditionError && !showBalanceError ? (
              <FormHelperText
                style={{
                  color: "#EE463C",
                  fontStyle: "400",
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                Please <span style={{ color: "#24d182" }}>enter</span> valid
                number of edition to continue your transaction
              </FormHelperText>
            ) : null}
            <Divider className={sendNftClasses.divider} />
            <div className={sendNftClasses.gasfeesWrapper}>
              <Typography
                variant="h6"
                style={{
                  marginBottom: "10px",
                  fontSize: "16px",
                  fontWeight: "400",
                }}
              >
                Max Gas Fee
              </Typography>
              <div>
                <Typography
                  variant="h6"
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  {walletReducer.gasEstimatesLoading ? (
                    <CircularProgress sx={{ color: "#B6B6B7" }} size={26} />
                  ) : (
                    <>
                      {values.totalEditions &&
                      values.totalEditions !== "0" &&                 
                      walletReducer?.gasEstimate &&
                      walletReducer?.gasEstimate.response
                        ? parseFloat(
                            walletReducer?.gasEstimate.response.EstimateInETH
                          ).toFixed(6)
                        : ""}{" "}
                      ETH
                    </>
                  )}
                </Typography>
                <Typography
                  variant="p"
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                  paragraph={true}
                >
                  {walletReducer.gasEstimatesLoading ? (
                    <CircularProgress sx={{ color: "#B6B6B7" }} size={26} />
                  ) : (
                    <>
                  {currencySymbol}{" "}
                  {values.totalEditions &&
                  values.totalEditions !== "0" &&
                  walletReducer?.gasEstimate &&
                  walletReducer?.gasEstimate.response
                    ? parseFloat(
                        walletReducer?.gasEstimate.response.Fiat
                      ).toFixed(2)
                    : ""}{" "}
                  {defaultCurrency}
                  </>)}
                </Typography>
              </div>
            </div>

            {showBalanceError && (
              <FormHelperText
                style={{
                  color: "#EE463C",
                  fontStyle: "400",
                  fontSize: "12px",
                  lineHeight: "20px",
                }}
              >
                You don’t have enough balance to cover the fees, please{" "}
                <span style={{ color: "#24d182" }}>purchase</span> more ETH to
                continue your transaction
              </FormHelperText>
            )}

            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Grid item>
                <BasicButton
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginRight: 0 }}
                  title={"CONFIRM"}
                  endIcon={<ArrowForwardIcon />}
                  onClickHandler={sendNFTClick}
                  disabled={
                    !values.walletAddress ||
                    !values.totalEditions ||
                    showError ||
                    showEditionError ||
                    showBalanceError ||
                    walletReducer.gasEstimatesLoading
                  }
                ></BasicButton>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </Modal>
  );
}

export { NFTSendComponent };
