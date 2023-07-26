import { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import { Backdrop, Button, CircularProgress, Modal } from "@mui/material";
import {
  FILE_EXTENSIONS_THUMBNAIL_ERR,
  MAX_PROFILE_THUMBNAIL,
  MAX_PROFILE_THUMBNAIL_ERROR,
  VALID_FILE_EXTENSIONS_ASSET_MANAGEMENT,
  VALID_FILE_EXTENSIONS_THUMBNAIL,
} from "../../../utils/constants";
import { commonActions } from "../../../actions/commonActions";
import validateFileType from "../../../utils/validateFileType";
import {
  getS3CredentialsForThumbnailUplaod,
  updateAsset,
} from "../../../services/assetsService";
import { s3upload } from "../../../utils/s3Upload";
import DragAndDrop from "../../dragAndDrop/DragAndDrop";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/system";
import DragAndDropForThumbnail from "../DragAndDropThumbnail";
import CustomModalV2 from "../../Modal/ModalV2";
import { getAllAssets } from "../../../actions/assetsActions";
import BasicButton from "../../Button/BasicButton";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    position: "relative",
    width: "30rem",
    height: "32.5rem",
    background: "#282B30",
    borderRadius: "0.3rem",
    transition: "0.3s !important",
    [theme.breakpoints.down("sm")]: {
      margin: "1.5rem",
      width: "20rem",
    },
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    margin: "3rem",
    "& h1": {
      marginBottom: "2rem",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "1.5rem",
    },
  },
  dragAndDropContainer: {
    [(theme) => theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  uploadFile: {
    margin: "auto",
    marginTop: "1.5rem",
    textAlign: "center",
  },
  filesContainer: {
    display: "flex",
    flexDirection: "row",
  },
  progressBarContainer: {
    width: "100%",
    marginLeft: "2.5rem",
    [(theme) => theme.breakpoints.only("xs")]: {
      marginLeft: "0",
    },
  },
  divider: {
    borderTop: "1px solid #282B30",
  },
  fileUploadContainer: {
    maxHeight: "16rem",
    overflowY: "auto",
  },
  uploadingTitle: {
    marginTop: "0",
    marginBottom: "0.5rem",
    display: "flex",
    justifyContent: "space-between",
  },
  modalStyles: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    opacity: "0.98",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  loading: {
    marginLeft: "38%",
  },
  backgroundForImageType: {
    margin: "3.5rem 4rem 6rem 2rem",
  },
  heading: {
    fontWeight: "900",
    fontSize: "26px",
  },
}));
const DragAndDropThumbnailModal = ({
  modalState,
  selectedAsset,
  closeModal,
  handleShowSuccessModal,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const dispatch = useDispatch();
  const hiddenFileInput = useRef(null);
  const [isImage, setIsImage] = useState(
    selectedAsset?.attributes?.type === "image"
  );
  const [loading, setLoading] = useState(false);

  const handleDrop = async (selectedFiles) => {
    const validateFileRes = validateFileType(
      selectedFiles[0],
      selectedFiles[0]?.size,
      VALID_FILE_EXTENSIONS_THUMBNAIL,
      FILE_EXTENSIONS_THUMBNAIL_ERR,
      MAX_PROFILE_THUMBNAIL,
      MAX_PROFILE_THUMBNAIL_ERROR
    );
    if (validateFileRes === MAX_PROFILE_THUMBNAIL_ERROR) {
      dispatch(commonActions.displaySnackbar(MAX_PROFILE_THUMBNAIL_ERROR));
    }
    if (validateFileRes === FILE_EXTENSIONS_THUMBNAIL_ERR) {
      dispatch(commonActions.displaySnackbar(FILE_EXTENSIONS_THUMBNAIL_ERR));
    }
    if (validateFileRes === "validated") {
      try {
        setLoading(true);
        getS3CredentialsForThumbnailUplaod(selectedAsset.id).then(
          (credentials) => {
            s3upload(selectedFiles[0], credentials).then((s3Response) => {
              updateAsset(selectedAsset.id, {
                thumbnailPath: s3Response.Key,
              })
                .then(() => {
                  setLoading(false);
                  handleShowSuccessModal("Thumbnail uploaded successfully.");
                  closeModal(false);
                  dispatch(
                    getAllAssets({ displayLoader: true, refresh: true })
                  );
                })
                .catch((error) => {
                  setLoading(false);
                  closeModal(false);
                  dispatch(
                    commonActions.displaySnackbar(
                      error?.response?.data?.response || "An error occured"
                    )
                  );
                });
            });
          }
        );
      } catch (error) {
        dispatch(
          commonActions.displaySnackbar(
            error?.response?.data?.response || "An error occured"
          )
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    var style = document.createElement("style");
    style.innerHTML = `#fileUploadContainer::-webkit-scrollbar {width: 4px;
    border-radius: 3px;
    background: #383F4E;}
    #fileUploadContainer::-webkit-scrollbar-thumb {background-color: #666B77;}
    #fileUploadContainer::-webkit-scrollbar-thumb:hover {background-color: #7f8491 !important;}`;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    setIsImage(selectedAsset?.attributes?.type === "image");
  }, [selectedAsset]);

  if (isImage)
    return (
      <CustomModalV2 open={modalState} onClose={closeModal}>
        <div className={classes.backgroundForImageType}>
          <div className={classes.heading}>Thumbnail Upload</div>
          <div>You can’t upload thumbnail for image files</div>
          <BasicButton
            variant="outlined"
            onClickHandler={closeModal}
            title="continue"
            sx={{ marginRight: "-1rem", float: "right" }}
          />
        </div>
      </CustomModalV2>
    );

  return (
    <CustomModalV2 open={modalState} onClose={closeModal}>
      <div className={classes.modalContainer}>
        <input
          style={{
            opacity: "-1",
          }}
          type="file"
          id="profilePicure"
          multiple
          accept={"." + VALID_FILE_EXTENSIONS_ASSET_MANAGEMENT.join(",.")}
          onChange={(e) => handleDrop(e?.target?.files)}
          ref={hiddenFileInput}
        />
        {loading ? (
          <div className={classes.loader}>
            <CircularProgress className={classes.loading} color="primary" />
            <h2>Changing Thumbnail...</h2>
          </div>
        ) : (
          <div className={classes.modalBody}>
            <h1>Thumbnail Upload</h1>

            <div className={classes.filesContainer}>
              <div className={classes.dragAndDropContainer}>
                <DragAndDrop
                  handleDrop={handleDrop}
                  RenderProp={DragAndDropForThumbnail}
                >
                  <div className={classes.uploadFile}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => hiddenFileInput?.current?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                </DragAndDrop>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomModalV2>
  );
};

export default DragAndDropThumbnailModal;
