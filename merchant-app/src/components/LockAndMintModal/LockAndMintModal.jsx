import * as React from "react";
import { useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  Grid,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import Modal from "../Modal/ModalV2";
import BasicButton from "../Button/BasicButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { actions } from "../../actions";
import { useDispatch, useSelector } from "react-redux";

export default function LockAndMintModal({
  open,
  handleClose,
  setOpen,
  handleLockmintSubmit,
}) {
  const dispatch = useDispatch();

  const [showBalanceError, setShowBalanceError] = React.useState(false);
  const walletReducer = useSelector(
    (state) => (state && state.walletReducer) || {}
  );
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});
  const profile = useSelector((state) => (state && state.profileReducer) || {});
  let defaultCurrency = "USD";
  if (profile && profile.userProfile && profile.userProfile.defaultCurrency) {
    defaultCurrency = profile.userProfile.defaultCurrency;
  }

  // dispatch(displaySnackbar(insufficientFunds, "error", purchaseEth));
  useEffect(() => {
    if (open) {
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
        let editions =
          (nftReducer &&
            nftReducer.nftEditData &&
            nftReducer.nftEditData.totalEditions) ||
          nftReducer.nftInfoById.totalEditions;
        dispatch(
          actions.walletActions.gasEstimate(
            defaultCurrency,
            "mintNft",
            editions,
            "",
            nftReducer.nftInfoById.id
          )
        );
        dispatch(actions.walletActions.getRates());
        let { ethBalance, gasEstimate } = walletReducer;
        if (
          ethBalance &&
          gasEstimate &&
          ethBalance.Eth < gasEstimate.response.EstimateInETH
        ) {
          setShowBalanceError(true);
        }
      };
      fn();
      // const interval = setInterval(() => fn(), 10000);
      // return () => {
      //   clearInterval(interval);
      // };
    }
  }, [open]);

  return (
    <>
      <Modal open={open} onClose={handleClose} width={550}>
        <Box sx={{ p: 5 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: "28px", fontWeight: "900", mb: 2 }}
          >
            MINT NFT
          </Typography>
          <Divider />
          <Grid container spacing={2} sx={{ mt: 4, mb: 5 }}>
            <Grid item xs={6} justifyContent="flex-start" alignItems="center">
              <Typography sx={{ fontWeight: 400, fontSize: "16px" }}>
                Smart Contract Gas Fee <br /> (max)
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{ textAlign: "end", fontWeight: 400, fontSize: "16px" }}
              >
                {walletReducer.gasEstimatesLoading ? (
                  <CircularProgress sx={{ color: "#B6B6B7" }} size={26} />
                ) : (
                  <>
                {walletReducer.gasEstimate &&
                  walletReducer.gasEstimate.response &&
                  parseFloat(
                    walletReducer.gasEstimate.response.EstimateInETH
                  ).toFixed(6)}{" "}
                ETH
                </>
                )}
              </Typography>
              <Typography
                sx={{
                  textAlign: "end",
                  color: "rgba(255, 255, 255, 0.5);",
                  fontSize: "14px",
                }}
              >
                {walletReducer.gasEstimatesLoading ? (
                  <CircularProgress sx={{ color: "#B6B6B7" }} size={26} />
                ) : (
                  <>
                    {walletReducer.gasEstimate &&
                      walletReducer.gasEstimate.response &&
                      walletReducer.gasEstimate.response.Fiat.toFixed(2)}{" "}
                    {defaultCurrency}
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>

          {showBalanceError && (
            <Grid container sx={{ mt: 4, mb: 5 }}>
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
            </Grid>
          )}

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <BasicButton
              color="primary"
              variant="contained"
              type={"submit"}
              title={"CONFIRM"}
              disabled={showBalanceError || walletReducer.gasEstimatesLoading}
              endIcon={<ArrowForwardIcon />}
              margin={0}
              onClickHandler={() => handleLockmintSubmit("LOCK_MINT")}
            />
          </Grid>
        </Box>
      </Modal>
      {/* <SuccessModal
        text={successModalText}
        open={!showSuccessModal}
        closeModal={() => setShowSuccessModal(false)}
      /> */}
    </>
  );
}
