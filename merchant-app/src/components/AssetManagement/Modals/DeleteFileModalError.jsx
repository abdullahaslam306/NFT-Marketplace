import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomModalV2 from "src/components/Modal/ModalV2";

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
    maxWidth: "500px",
    textAlign: "center",
  },
  container: {
    margin: "2rem 2rem 0 2rem",
    padding: "1rem",
    width: "22rem",
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
    color: "rgba(255, 255, 255, 0.7)",
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

const DeleteFileModalError = ({
  handleDeleteAsset,
  open,
  deletingFile,
  closeModal,
  selectedAsset: { attributes: { name } = {} } = {},
}) => {
  const classes = deleteFileModalStyles();
  return (
    <CustomModalV2
      showCloseButton={true}
      className={classes.modal}
      open={open}
      onClose={closeModal}
    >
      <div className={classes.container}>
        <div className={classes.mainHeading}>You can’t delete this file</div>
        <hr className={classes.divider} />
        <p className={classes.fileName}>{name}</p>
        <hr className={classes.divider} />
        <div className={classes.subHeading}>
          This asset is associated with a draft or lazy-minted NFT and cannot be
          deleted.
        </div>
        <br />
        <div className={classes.subHeading}>
          Please disassociate the asset with the NFT before deletion.
        </div>
      </div>
      <Button
        sx={{
          float: "right",
          color: "#B6AEF6",
          border: "1px solid #B6AEF6",
          marginRight: "3rem",
          marginBottom: "3rem",
        }}
        onClick={closeModal}
        variant="outlined"
      >
        Continue
      </Button>
    </CustomModalV2>
  );
};

export default DeleteFileModalError;
