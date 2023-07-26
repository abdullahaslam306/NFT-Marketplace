import { Backdrop, Dialog, Fade } from "@mui/material";
import React from "react";
import CropAndRotatePP from "./CropAndRotatePP";

const ProfilePictureModal = ({
  modalState,
  modalStyles,
  buttonStyle,
  file,
  closeModal,
}) => {
  return (
    <Dialog
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={modalStyles}
      open={modalState}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        className: "backgroundfirefoxParentDiv",
      }}
    >
      <CropAndRotatePP
        file={file}
        closeModal={closeModal}
        fileName={file?.files?.[0]?.name}
      />
    </Dialog>
  );
};

export default ProfilePictureModal;
