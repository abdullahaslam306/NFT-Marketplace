import React, { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomModalV2 from "../../Modal/ModalV2";
import InputField from "../../InputField";
import BasicButton from "../../Button/BasicButton";
import { MetaMaskIcon } from "../../../BloIcons";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../../actions";
import { ActionType } from "../../../utils/actionTypes";
import { WALLET_NAME_UPDATED_SUCCESSFULLY } from "../../../utils/constants";

let { walletActions } = actions;

const RenameWalletModalStyles = makeStyles(() => ({
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
  mainHeading: {
    fontWeight: "900",
    fontSize: "1.75rem",
    fontFamily: "Roboto",
    fontStyle: "normal",
    lineHeight: "123.5%",
    alignItems: "center",
    textAlign: "center",
    letterSpacing: "0.25px",
    color: "#FFFFFF",
    margin: "10px 0px",
  },

  buttons: {
    textAlign: "right",
  },
}));

const RenameWalletModal = ({
  wallet,
  open,
  closeModal,
  setOpenSuccessModal,
  setSuccessMessage,
}) => {
  const dispatch = useDispatch();

  const commonReducer = useSelector((state) => state.commonReducer || {});
  let loading = commonReducer.loading || false;

  const walletState = useSelector(
    (state) => (state && state.walletReducer) || {}
  );

  const classes = RenameWalletModalStyles();

  const [name, setName] = useState(wallet?.attributes?.name || "");

  useEffect(() => {
    if (wallet) {
      setName(wallet.attributes.name);
    }
  }, [wallet]);

  useEffect(() => {
    const response = walletState.updateWalletNameResponse;
    if (
      response &&
      response.response &&
      response.response.includes("successfully")
    ) {
      handleResponse();
    }
  }, [walletState]);

  const handleResponse = () => {
    setSuccessMessage(WALLET_NAME_UPDATED_SUCCESSFULLY);
    setOpenSuccessModal(true);
    const updatedWallet = {
      ...wallet,
      attributes: { ...wallet.attributes, name: name },
    };
    dispatch({
      type: ActionType.UPDATE_WALLETS_LIST_ITEM,
      payload: updatedWallet,
    });
    dispatch({ type: ActionType.UPDATE_WALLET_NAME_RESPONSE, payload: null });
    setTimeout(() => {
      setSuccessMessage(null);
      setOpenSuccessModal(false);
    }, 4000);
    closeModal();
  };

  const handleRenameWallet = () => {
    dispatch(walletActions.updateWalletName({ id: wallet.id, name: name }));
  };

  return (
    <CustomModalV2
      showCloseButton={!loading}
      className={classes.modal}
      open={open}
      onClose={closeModal}
      width={"90%"}
      maxWidth={"428px"}
    >
      <div className={classes.container}>
        {loading ? (
          <div className={classes.mainHeading}>
            <CircularProgress />
            <div>Renaming Wallet...</div>
          </div>
        ) : (
          <>
            <Grid
              item
              alignItems={"center"}
              justifyContent={"center"}
              textAlign={"center"}
            >
              <MetaMaskIcon height={91} width={98} />
            </Grid>
            <Typography className={classes.mainHeading}>
              Change the wallet name
            </Typography>
            <InputField
              label={"Enter Wallet Name"}
              name={"walletName"}
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth={true}
              margin={"8px"}
              autofocus
            />
            <Grid
              item
              alignItems={"center"}
              justifyContent={"center"}
              textAlign={"center"}
            >
              <BasicButton
                title={"change name"}
                id={"name"}
                loading={loading}
                variant={"contained"}
                onClickHandler={handleRenameWallet}
              />
            </Grid>
          </>
        )}
      </div>
    </CustomModalV2>
  );
};

export default RenameWalletModal;
