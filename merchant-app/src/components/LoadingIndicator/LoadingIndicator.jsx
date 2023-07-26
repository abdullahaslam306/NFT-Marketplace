import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CircularProgress, Typography } from "@mui/material";
import CustomModal from "../Modal/Modal";
import { commonActions } from "../../actions/commonActions";

export const LoadingIndicator = ({ isModal = false, title = "" }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isModal) {
      dispatch(commonActions.setModalState(true));
    }
    return () => {
      dispatch(commonActions.setModalState(false));
    };
  }, []);

  return (
    <div sx={{ background: "transparent" }}>
      {isModal ? (
        <CustomModal isCloseButton={false}>
          <>
            <CircularProgress
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                margin: "40px auto",
              }}
              color="primary"
            />
            {title && (
              <Typography
                sx={{
                  position: "absolute",
                  bottom: "40px",
                  left: 0,
                  right: 0,
                  margin: "auto",
                  textAlign: "center",
                }}
                variant="h4"
              >
                {title}
              </Typography>
            )}
          </>
        </CustomModal>
      ) : (
        <CircularProgress
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
          }}
          color="primary"
        />
      )}
    </div>
  );
};
