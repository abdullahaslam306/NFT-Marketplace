import React from "react";
import Lottie from "react-lottie";
import { Paper, Typography, Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Modal from "../Modal/Modal";

import animationData from "./lottiesAnimationData.json";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

// Accepted props
// text: string - text to display
// open: boolean - open or close modal
// closeModal - function - close modal
// showActionButton - boolean - show action button
// onActionButtonClick - function - on action button click
// actionButtonText Text to show inside button
// subText - string - sub text content
// subTextDisplay -Boolean - Sub text to display

const successModalStyles = makeStyles(() => ({
  box: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
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
  },
}));

const SuccessModal = ({
  text,
  showActionButton,
  onActionButtonClick,
  actionButtonText,
  open,
  closeModal,
  subText,
  subTextDisplay,
  onClose,
  closeButtonEnable = false,
}) => {
  const classes = successModalStyles();
  if (open)
    return (
      <Modal
        className={classes.modal}
        //   open={open}
        //   onClose={closeModal}
        //   closeAfterTransition
        //   BackdropComponent={Backdrop}
        //   BackdropProps={{
        //     timeout: 500,
        //     style: {
        //       backdropFilter: "blur(8px)",
        //     },
        //   }}
      >
        {closeButtonEnable && (
          <IconButton
            onClick={onClose}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 999999,
              color: "#D32F2F",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <>
          <Paper elevation={2} className={classes.box}>
            <Box className={classes.container}>
              <Box>
                <Lottie options={defaultOptions} height={154} width={154} />
              </Box>
              <Typography style={{ fontWeight: 900, fontSize: "28px" }}>
                {text}
              </Typography>
              {subTextDisplay && (
                <Typography
                  style={{
                    fontWeight: 500,
                    fontSize: "14px",
                    marginTop: "15px",
                  }}
                >
                  {subText}
                </Typography>
              )}
            </Box>
            {showActionButton && (
              <Button variant="contained" onClick={onActionButtonClick}>
                {" "}
                {actionButtonText}{" "}
              </Button>
            )}
          </Paper>
        </>
      </Modal>
    );
  return <></>;
};

export default SuccessModal;
