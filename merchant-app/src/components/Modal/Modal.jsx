import React from "react";
import { Box, Modal, Button } from "@mui/material";
import { CloseSharp } from "@mui/icons-material";

function CustomModal({
  showModal = true,
  isCloseButton = false,
  onClose = () => {},
  children,
  customStyle,
}) {
  return (
    <Modal
      open={showModal}
      onClose={onClose}
      className="backgroundfirefoxParentDiv"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          maxWidth: "100%",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            minWidth: "300px",
            minHeight: "200px",
            position: "relative",
            borderRadius: "4px",
            background: "rgba(255, 255, 255, 0.09)",
            //backdropFilter: "blur(50px)",
            ...customStyle,
          }}
          className="backgroundfirefoxChildDiv"
        >
          {children}
          {isCloseButton && (
            <Button
              onClick={onClose}
              style={{
                position: "absolute",
                right: 0,
                top: "15px",
                margin: 0,
                color: "#b6aef629",
              }}
            >
              <CloseSharp color="error" fontSize="large" />
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default CustomModal;
