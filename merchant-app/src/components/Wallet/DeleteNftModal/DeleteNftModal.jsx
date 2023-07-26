import React from "react";
import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomModalV2 from "../../Modal/ModalV2";

const deleteFileModalStyles = makeStyles(() => ({
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
    lineHeight: "1.25rem",
    letterSpacing: "0.15px",
  },
  fileName: {
    marginLeft: "0.4rem",
  },
  buttons: {
    textAlign: "right",
  },
  deletingFiles: {
    display: "grid",
    placeItems: "center",
    marginTop: "4rem",
  },
}));

const DeleteNftModal = ({ handleDeleteNft, open, deletingNft, closeModal }) => {
  const classes = deleteFileModalStyles();
  return (
    <CustomModalV2
      showCloseButton={!deletingNft}
      className={classes.modal}
      open={open}
      onClose={closeModal}
      width={"90%"}
      maxWidth={"650px"}
    >
      <div className={classes.container}>
        {deletingNft ? (
          <div className={classes.deletingFiles}>
            <CircularProgress />
            <div className={classes.subHeading}>Deleting NFT...</div>
          </div>
        ) : (
          <>
            <Typography className={classes.mainHeading}>Delete NFT?</Typography>
            <div>
              <Typography className={classes.subHeading}>
                This action will delete the NFT.
              </Typography>
              <Typography className={classes.subHeading}>
                Are you sure you want to delete?
              </Typography>
            </div>
            <div className={classes.buttons}>
              <Button onClick={closeModal} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteNft}
                variant="contained"
                color="error"
                sx={{ color: "white" }}
              >
                Delete NFT
              </Button>
            </div>
          </>
        )}
      </div>
    </CustomModalV2>
  );
};

export default DeleteNftModal;
