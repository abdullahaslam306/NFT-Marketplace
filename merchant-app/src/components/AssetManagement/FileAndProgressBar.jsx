import React, { useState } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CancelFileModal from "./Modals/CancelFileModal";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  container: {
    marginTop: "1rem",
  },
  icon: {
    float: "right",
    "& svg": {
      transform: "scale(0.8)",
    },
  },
  wrapper: {
    // width: "500px",
    marginTop: "1rem",
    marginBottom: "0.5em",
    width: "98%",
  },

  progressBar: {
    width: "100%",
    backgroundColor: "#228165",
    borderRadius: "3px",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, .2)",
  },

  progressBarFill: {
    display: "block",
    height: "3px",
    backgroundColor: "#00E387",
    borderRadius: "3px",
    transition: "width 500ms ease-in-out",
  },
  fileName: {
    fontSize: "0.9rem",
    fontWeight: 600,
  },
  successIcon: {
    color: "#00e387",
  },
  cancelIcon: {
    cursor: "pointer",
  },
});

const FileAndProgressBar = ({ file, progress = 0 }) => {
  const { status: fileStatus = {} } = file;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const classes = useStyles();

  const cancelFileUpload = () => {
    file.cancelled = true;
    setShowCancelModal(false);
  };

  const hanldeCloseModal = () => {
    setShowCancelModal(false);
  };

  return (
    <div className={classes.container}>
      <CancelFileModal
        closeModal={hanldeCloseModal}
        showCancelModal={showCancelModal}
        cancelFileUpload={cancelFileUpload}
      />
      <span className={classes.fileName}>{file?.name}</span>
      {!fileStatus.error && (
        <span className={classes.icon}>
          {progress == "100" ? (
            <CheckCircleIcon className={classes.successIcon} />
          ) : (
            <CancelIcon
              className={classes.cancelIcon}
              onClick={() => {
                setShowCancelModal(true);
              }}
            />
          )}
        </span>
      )}

      <div className={classes.wrapper}>
        <div
          className={classes.progressBar}
          style={{
            backgroundColor: fileStatus.error && "rgb(238, 70, 60, 0.5)",
          }}
        >
          <span
            className={classes.progressBarFill}
            style={{
              width: progress + "%",
              backgroundColor: fileStatus.error && "#EE463C",
            }}
          ></span>
        </div>
      </div>

      <div>
        {fileStatus.error ? (
          <span>
            <span>{fileStatus.message}</span>
          </span>
        ) : progress == "100" ? (
          <span>Finished</span>
        ) : (
          <span>{progress}% done</span>
        )}
      </div>
    </div>
  );
};

export default FileAndProgressBar;
