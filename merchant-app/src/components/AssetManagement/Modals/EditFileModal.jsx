import { useState } from "react";
import { useDispatch } from "react-redux";

import { commonActions } from "../../../actions/commonActions";
import {
  Backdrop,
  Button,
  CircularProgress,
  InputAdornment,
  Modal,
  TextField,
} from "@mui/material";
import { updateAsset } from "../../../services/assetsService";
import { getAllAssets } from "../../../actions/assetsActions";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  modalContainer: {
    position: "relative",
    width: "35rem",
    height: "23rem",
    background: "#282B30",
    borderRadius: "0.3rem",
  },
  modalStyles: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    opacity: "0.98",
  },
  divider: {
    borderTop: "1px solid #282B30",
    margin: "1rem 2px",
  },
  buttonWrapper: {
    display: "flex",
    marginTop: "2rem",
    justifyContent: "flex-end",
  },
  heading: {},
  fileName: {
    fontSize: "1rem",
  },
  renameButton: {
    marginLeft: "0",
    marginRight: "0",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    margin: "3rem",
    marginTop: "3.3rem",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  loading: {
    marginLeft: "30%",
  },
}));

const EditFileModal = ({
  modalState,
  closeModal,
  selectedAsset,
  handleShowSuccessModal,
}) => {
  const classes = useStyles();
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    attributes: { name = "", fileExtension = "" } = {},
    id: assetId = "",
  } = selectedAsset;

  const handleRename = async () => {
    if (fileName === "") {
      return;
    }
    const newFileName = `${fileName}.${fileExtension}`;
    setLoading(true);
    try {
      await updateAsset(assetId, { name: newFileName });
    } catch (error) {
      dispatch(
        commonActions.displaySnackbar(
          error?.response?.data?.message || "An error occured!"
        )
      );
    }
    setFileName("");
    handleShowSuccessModal("Your file was renamed successfully.");
    closeModal(false);
    setLoading(false);
    dispatch(getAllAssets({ displayLoader: true, refresh: true }));
  };
  return (
    <Modal
      open={modalState}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: {
          background: "rgba(0,0,0,0.8)",
        },
      }}
      className={classes.modalStyles}
    >
      <div className={classes.modalContainer}>
        {/* <Button
            onClick={() => closeModal(false)}
            style={{ position: "absolute", right: 0, top: "15px", zIndex: 1 }}
          >
            <CloseSharpIcon color="error" />
          </Button> */}
        {loading ? (
          <div className={classes.loader}>
            <CircularProgress className={classes.loading} color="primary" />
            <h2>Renaming file...</h2>
          </div>
        ) : (
          <div className={classes.modalBody}>
            <h1 className={classes.heading}>Rename your file</h1>
            <div className={classes.fileName}>{name}</div>
            <hr className={classes.divider} />

            <TextField
              fullWidth
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              label="Enter the new file name"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment style={{ color: "white" }} position="end">
                    .{fileExtension}
                  </InputAdornment>
                ),
              }}
            />

            <div className={classes.buttonWrapper}>
              <Button variant="outlined" onClick={() => closeModal(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={fileName === ""}
                className={classes.renameButton}
                onClick={handleRename}
              >
                Rename
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditFileModal;
