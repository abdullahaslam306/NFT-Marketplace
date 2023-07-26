import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

import AWS from "aws-sdk";

import FileAndProgressBar from "../FileAndProgressBar";
import DragAndDrop from "../../dragAndDrop/DragAndDrop";
import DragAndDropForAsset from "../dragAndDropAsset";
import validateFileType from "../../../utils/validateFileType";
import { commonActions } from "../../../actions/commonActions";
import { getAllAssets } from "../../../actions/assetsActions";
import CustomModalV2 from "../../Modal/ModalV2";
import {
  createAsset,
  deleteAsset,
  getS3CredentialsForAssetUplaoding,
  updateAsset,
} from "../../../services/assetsService";

import { makeStyles } from "@mui/styles";

import { Button, Fade, useMediaQuery, useTheme } from "@mui/material";
import {
  FILE_EXTENSIONS_ASSET_MANAGEMENT_ERR,
  MAX_ASSET_MANAGEMENT_FILE_SIZE,
  MAX_ASSET_MANAGEMENT_FILE_SIZE_ERROR,
  VALID_FILE_EXTENSIONS_ASSET_MANAGEMENT,
} from "../../../utils/constants";
import { ActionType } from "../../../utils/actionTypes";

const useStyles = makeStyles(() => ({
  modalContainer: {
    position: "relative",
    width: (stylesParams) =>
      stylesParams.isMobile
        ? "22rem"
        : stylesParams.hasFiles
        ? "65rem"
        : "30rem",
    height: "35rem",
    background: "#282B30",
    borderRadius: "0.3rem",
    transition: "0.3s !important",
    [(stylesParams) => stylesParams.theme.breakpoints.only("xs")]: {
      margin: "1.5rem",
    },
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    margin: "3rem",
    "& h1": {
      marginBottom: "2rem",
    },
  },
  dragAndDropContainer: {
    display: (stylesParams) =>
      stylesParams.isMobile && stylesParams.hasFiles ? "none" : "block",
  },
  uploadFile: {
    margin: "auto",
    marginLeft: (stylesParams) => stylesParams.hasFiles && "2rem",
    marginTop: "1.5rem",
    textAlign: "center",
  },
  filesContainer: {
    display: "flex",
    flexDirection: "row",
  },
  progressBarContainer: {
    width: "100%",
    marginLeft: (stylesParams) => (stylesParams.isMobile ? "0" : "2.5rem"),
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
    fontSize: "20px",
  },
}));
const FileUplaodModal = ({ modalState, modalStyles, closeModal }) => {
  const [files, setFiles] = useState([]);
  const hiddenFileInput = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const stylesParams = { theme, hasFiles: !!files.length, isMobile };
  const classes = useStyles(stylesParams);
  const dispatch = useDispatch();

  const handleDrop = async (selectedFiles) => {
    const doesFileExist = !!files.length;
    let fileList = [...files];
    for (let i = 0; i < selectedFiles.length; i++) {
      if (!selectedFiles[i].name) return;

      const validateFileRes = validateFileType(
        selectedFiles[i],
        selectedFiles[i].size,
        VALID_FILE_EXTENSIONS_ASSET_MANAGEMENT,
        FILE_EXTENSIONS_ASSET_MANAGEMENT_ERR,
        MAX_ASSET_MANAGEMENT_FILE_SIZE,
        MAX_ASSET_MANAGEMENT_FILE_SIZE_ERROR
      );
      if (validateFileRes === MAX_ASSET_MANAGEMENT_FILE_SIZE_ERROR) {
        selectedFiles[i].status = {
          error: true,
          message: MAX_ASSET_MANAGEMENT_FILE_SIZE_ERROR,
        };
      }
      if (validateFileRes === FILE_EXTENSIONS_ASSET_MANAGEMENT_ERR) {
        selectedFiles[i].status = {
          error: true,
          message: FILE_EXTENSIONS_ASSET_MANAGEMENT_ERR,
        };
      }

      if (validateFileRes === "validated") {
        selectedFiles[i].status = {
          error: false,
          uploaded: false,
          message: "",
        };
      }
      fileList.push(selectedFiles[i]);
    }
    setFiles(() => fileList);

    setTimeout(() => {
      if (doesFileExist) {
        let fileListNode = document.getElementById("fileUploadContainer");
        fileListNode?.lastChild?.scrollIntoView({
          block: "end",
          behavior: "smooth",
        });
      }
    }, 0);

    for (let i = 0; i < selectedFiles.length; i++) {
      const { name, size, type } = selectedFiles[i];
      const payload = {
        type:
          type.split("/")[0] ||
          (["glb"].includes(name.split(".").pop()) ? "3d_model" : ""),
        name,
        extension: name.split(".").pop(),
        size,
      };
      handleFileUpload(payload, selectedFiles[i]);
    }
  };

  const handleFileUpload = async (payload, selectedFiles) => {
    try {
      createAsset(payload).then(async (assetUId) => {
        selectedFiles["assetUId"] = assetUId;
        selectedFiles["progress"] = 0;

        getS3CredentialsForAssetUplaoding(assetUId).then((credentials) => {
          s3UploadAssets(selectedFiles, credentials, assetUId).then((res) => {
            if (!selectedFiles.cancelled) {
              updateAsset(assetUId, {
                originalPath: res.data.Key,
              }).then(() => {
                dispatch({ type: ActionType.GET_ASSETS_SUCCESS, payload: [] });
                dispatch(getAllAssets({ displayLoader: true, refresh: true }));
              });
            }
          });
        });
      });
    } catch (error) {
      dispatch(
        commonActions.displaySnackbar(
          error?.response?.data?.message || "An error occured!"
        )
      );
    }
  };
  const handleCloseModal = () => {
    setFiles([]);
    closeModal(false);
  };

  async function s3UploadAssets(file, s3Credentials, assetUId) {
    try {
      const filePath = s3Credentials?.s3?.prefix + "/" + file.name;
      const { accessKeyId, secretAccessKey, sessionToken } =
        s3Credentials?.credentials;
      AWS.config.update({
        region: "us-east-1",
        accessKeyId,
        secretAccessKey,
        sessionToken,
      });

      var s3 = new AWS.S3({
        params: { Bucket: s3Credentials?.s3?.bucketName },
      });
      const res = await s3
        .upload({
          Key: filePath,
          Body: file,
          ContentType: file.type,
        })
        .on("httpUploadProgress", function (progress) {
          try {
            var uploaded = Number(
              (progress.loaded * 100) / progress.total
            ).toFixed(0);

            setFiles((fileList) => {
              const newFileList = [...fileList];
              const index = newFileList.findIndex(
                (f) => f.assetUId === assetUId
              );
              if (index !== -1 && newFileList[index].cancelled === true) {
                newFileList[index].status = {
                  error: true,
                  uploaded: false,
                  message: "Cancelled",
                };
              } else {
                if (index !== -1) newFileList[index].progress = uploaded;
                if (index !== -1 && uploaded == "100") {
                  newFileList[index].status = {
                    error: false,
                    uploaded: true,
                    message: "Finished",
                  };
                }
              }
              return newFileList;
            });
          } catch (error) {
            dispatch(
              commonActions.displaySnackbar(
                error?.response?.data?.message || "An error occured!"
              )
            );
          }
        })
        .promise();

      if (file.cancelled) {
        await deleteAsset(file.assetUId);
      }

      return { data: res, fileName: file.name, error: null, assetUId };
    } catch (error) {
      setFiles((fileList) => {
        const newFileList = [...fileList];
        const index = newFileList.findIndex((f) => f.assetUId === assetUId);
        if (index !== -1) {
          newFileList[index].status = {
            error: true,
            uploaded: false,
            message: "Upload failed, please reupload.",
          };
        }
        return newFileList;
      });
      return { data: null, error, assetUId };
    }
  }

  return (
    <CustomModalV2
      open={modalState}
      onClose={handleCloseModal}
      customStyles={classes.modal}
    >
      <div
        className={classes.modalContainer}
        style={{
          height: isMobile ? "34rem" : "35rem",
        }}
      >
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
        <div
          style={{
            margin: isMobile ? "2.5rem" : "3rem",
          }}
          className={classes.modalBody}
        >
          <h1 style={{ marginBottom: isMobile ? "1rem" : "2rem" }}>
            File Upload
          </h1>

          <div className={classes.filesContainer}>
            <div className={classes.dragAndDropContainer}>
              <DragAndDrop
                handleDrop={handleDrop}
                RenderProp={DragAndDropForAsset}
              >
                <div
                  className={classes.uploadFile}
                  style={{ marginTop: isMobile ? "1rem" : "1.5rem" }}
                >
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
            {files.length > 0 && (
              <div className={classes.progressBarContainer}>
                <h2 className={classes.uploadingTitle}>
                  {files.every(
                    (file) => file.cancelled === true || file.progress == 100
                  ) ? (
                    <>
                      <span>Finished</span>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          marginTop: "0",
                          marginRight: "0",
                          marginBottom: "8px",
                        }}
                        onClick={handleCloseModal}
                      >
                        Complete
                      </Button>
                    </>
                  ) : (
                    "Uploading..."
                  )}
                </h2>
                <hr className={classes.divider} />
                <div
                  id="fileUploadContainer"
                  className={classes.fileUploadContainer}
                >
                  {files.map((file, i) => (
                    <FileAndProgressBar
                      key={i}
                      progress={file.progress}
                      file={file}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomModalV2>
  );
};

export default React.memo(FileUplaodModal);
