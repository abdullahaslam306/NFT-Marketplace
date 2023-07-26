import React from "react";
import Lottie from "react-lottie";
import { Paper, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomModalV2 from "../Modal/ModalV2";

import animationData from "./binAnimationData.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const successFileDeletedModalStyles = makeStyles(() => ({
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
  },
}));

const SuccessFileDeletedModal = ({ text, open }) => {
  const classes = successFileDeletedModalStyles();
  return (
    <CustomModalV2
      className={classes.modal}
      open={open}
      showCloseButton={false}
    >
      <>
        <Paper elevation={2} className={classes.box}>
          <Box>
            <Lottie options={defaultOptions} height={154} width={154} />
          </Box>
          <Typography style={{ fontWeight: 900, fontSize: "28px" }}>
            {text}
          </Typography>
        </Paper>
      </>
    </CustomModalV2>
  );
};

export default SuccessFileDeletedModal;
