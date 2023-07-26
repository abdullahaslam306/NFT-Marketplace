import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomModalV2 from "../../Modal/ModalV2";

const deleteFileModalStyles = makeStyles((theme) => ({
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
  },
  container: {
    margin: "2rem",
    width: "31rem",
    [theme.breakpoints.down("sm")]: {
      width: "20rem",
      margin: "1.5rem",
    },
  },
  divider: {
    margin: "1rem 0",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  mainHeading: {
    fontWeight: "900",
    fontSize: "1.75rem",
  },
  subHeading: {
    fontWeight: "900",
    fontSize: "1.2rem",
  },
  fileName: {
    marginLeft: "0.4rem",
  },
  buttons: {
    float: "right",
  },
  deletingFiles: {
    display: "grid",
    placeItems: "center",
    marginTop: "4rem",
  },
}));

const DeleteFileModal = ({
  handleDeleteAsset,
  open,
  deletingFile,
  closeModal,
  selectedAsset: { attributes: { name } = {} } = {},
}) => {
  const classes = deleteFileModalStyles();
  return (
    <CustomModalV2
      showCloseButton={!deletingFile}
      className={classes.modal}
      open={open}
      onClose={closeModal}
    >
      <div className={classes.container}>
        {deletingFile ? (
          <div className={classes.deletingFiles}>
            <CircularProgress />
            <div className={classes.subHeading}>Deleting file...</div>
          </div>
        ) : (
          <>
            <div className={classes.mainHeading}>Delete file?</div>
            <div className={classes.subHeading}>
              You`re about to delete this file:
            </div>
            <hr className={classes.divider} />
            <p className={classes.fileName}>{name}</p>
            <hr className={classes.divider} />
            <div>Are you sure you want to delete this file?</div>
            <div className={classes.buttons}>
              <Button onClick={closeModal} variant="outlined">
                Keep File
              </Button>
              <Button
                onClick={handleDeleteAsset}
                variant="contained"
                color="error"
                sx={{ color: "white" }}
              >
                Delete File
              </Button>
            </div>
          </>
        )}
      </div>
    </CustomModalV2>
  );
};

export default DeleteFileModal;
