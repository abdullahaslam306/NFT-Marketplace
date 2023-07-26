import React from "react";

import CloseSharpIcon from "@mui/icons-material/CloseSharp";

import { Backdrop, Button, Modal, useTheme } from "@mui/material";

import { makeStyles } from "@mui/styles";
import CustomModalV2 from "../../Modal/ModalV2";

const cancelModalStyles = makeStyles(() => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "4px",
    width: "auto",
    height: "auto",
    margin: "auto",
    padding: "25px",
    maxWidth: "500px",
    textAlign: "center",
    [(theme) => theme.breakpoints.down("xs")]: {
      width: "auto",
    },
  },
  container: {
    margin: "2rem",
  },
  modalContainer: {
    position: "relative",
    // width: (hasFiles) => (hasFiles ? "65rem" : "30rem"),
    // height: "35rem",
    background: "#282B30",
    borderRadius: "0.3rem",
    transition: "0.3s !important",
    opacity: "0.8",
    padding: "3rem 4rem",
    [(theme) => theme.breakpoints.only("xs")]: {
      margin: "1.5rem",
    },
  },
  stopUploadButton: {
    background: "#F44336",
    marginLeft: "0.8rem",
  },
  description: {
    fontSize: "0.9rem",
    marginBottom: "1.5rem",
  },
  buttons: {
    float: "right",
  },
}));

const CancelFileModal = ({ cancelFileUpload, closeModal, showCancelModal }) => {
  const theme = useTheme();
  const classes = cancelModalStyles(theme);
  return (
    <CustomModalV2
      className={classes.modal}
      open={showCancelModal}
      onClose={closeModal}
    >
      <>
        <div className={classes.modalContainer}>
          <h2>Stop uploading?</h2>
          <div className={classes.description}>
            This action will stop any current file uploading process.
            <br />
            Are you sure you want to stop upload?
          </div>
          <div className={classes.buttons}>
            <Button variant="outlined" onClick={closeModal}>
              Continue Upload
            </Button>
            <Button
              variant="contained"
              className={classes.stopUploadButton}
              onClick={cancelFileUpload}
            >
              Stop Upload
            </Button>
          </div>
        </div>
      </>
    </CustomModalV2>
  );
};

export default CancelFileModal;
