import React, { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import CustomModalV2 from "../../Modal/ModalV2";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../../utils/actionTypes";
import { actions } from "../../../actions";

const disconnectModalStyles = makeStyles(() => ({
  box: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "4px",
    width: "auto",
    height: "auto",
    margin: "auto",
    padding: "25px",
    maxWidth: "550px",
    textAlign: "center",
  },
  container: {
    margin: "2rem",
  },
  divider: {
    margin: "1rem 0",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  mainHeading: {
    fontWeight: "900",
    fontSize: "1.25rem",
    lineHeight: "2rem",
    letterSpacing: "0.15px",
  },
  subHeading: {
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "143%",
    letterSpacing: "0.15px",
    color: "rgba(255, 255, 255, 0.7)",
  },
  fileName: {
    marginLeft: "0.4rem",
  },
  buttons: {
    textAlign: "right",
    padding: "32px 0 10px 0px",
  },
  deletingFiles: {
    display: "grid",
    placeItems: "center",
    marginTop: "4rem",
  },
}));

const DisconnectModal = ({ smartContract, open, closeModal }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { commonReducer, smartContractReducer } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (smartContractReducer && smartContractReducer.deletedSuccessfully) {
      dispatch({
        type: ActionType.UPDATE_SMART_CONTRACT_LIST,
        payload: { action: "delete", id: smartContract.id },
      });
      closeModal();
    }
  }, [smartContractReducer]);

  const handleDeleteSmartContract = () => {
    dispatch(
      actions.smartContractActions.deleteSmartContract({ id: smartContract.id })
    );
  };

  const classes = disconnectModalStyles();

  return (
    <CustomModalV2
      showCloseButton={!commonReducer?.loading}
      className={classes.modal}
      open={open}
      onClose={closeModal}
      width={"75%"}
      maxWidth={"550px"}
    >
      <div className={classes.container}>
        {commonReducer?.loading ? (
          <div className={classes.deletingFiles}>
            <CircularProgress />
            <h2>Your smart contract is being disconnected </h2>
          </div>
        ) : (
          <>
            <Typography
              className={classes.mainHeading}
              style={{ margin: "16px 0px" }}
            >
              Disconnect smart contract?
            </Typography>
            <div>
              <Typography className={classes.subHeading}>
                This action may remove existing NFTs from your account.
              </Typography>
              <Typography className={classes.subHeading}>
                Are you sure you want to disconnect your smart contract?
              </Typography>
            </div>
            <div className={classes.buttons}>
              <Button
                onClick={closeModal}
                variant="outlined"
                color="secondary"
                sx={matches ? { margin: "8px" } : { margin: "2px" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSmartContract}
                variant="contained"
                color="error"
                sx={{
                  color: "white !important",
                  margin: matches ? "8px" : "2px",
                }}
              >
                Disconnect
              </Button>
            </div>
          </>
        )}
      </div>
    </CustomModalV2>
  );
};

export default DisconnectModal;
