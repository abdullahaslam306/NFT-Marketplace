import React from "react";
import { Box, Modal, Button, Backdrop } from "@mui/material";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

export default function CustomModalV2({
  children,
  open = false,
  width,
  maxWidth,
  onClose = () => {},
  customStyles,
  showCloseButton = true,
  margin,
  mobileWidth
}) {
  return (
    <Modal
      closeAfterTransition
      className={customStyles}
      open={open}
      onClose={onClose}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: {
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
        },
        className: "backgroundfirefoxParentDiv",
      }}
      // style={{ overflowY: "scroll" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            minWidth: {width},
            ...(mobileWidth && {
              minWidth: {sm: width, xs: mobileWidth },
            }),
            maxWidth: { maxWidth },
            minHeight: "200px",
            position: "absolute",
            // top: 0,
            margin: margin ? `${margin}` : "15px",
            borderRadius: "4px",
            background: "rgba(255, 255, 255, 0.09)",
          }}
          className="backgroundfirefoxChildDiv"
        >
          {showCloseButton && (
            <Button
              onClick={onClose}
              style={{
                position: "absolute",
                right: "-5px",
                zIndex: "1",
                marginRight: "0.5rem",
              }}
            >
              <CloseSharpIcon
                sx={{
                  width: "1.7rem",
                  height: "1.7rem",
                }}
                color="error"
              />
            </Button>
          )}
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
