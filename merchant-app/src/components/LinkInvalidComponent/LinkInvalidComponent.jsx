import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Link,
  Container,
  useMediaQuery,
} from "@mui/material";
import { linkExpired } from "../../utils/constants";
import CheckEmailComponent from "../CheckEmailComponent/CheckEmailComponent";
import { actions } from "../../actions";
import { useTheme } from "@mui/styles";

let { authActions } = actions;
let { updateStepper } = actions.commonActions;

export default function LinkInvalidComponent({
  title = linkExpired,
  email = "",
}) {
  const dispatch = useDispatch();
  const [seconds, setSeconds] = React.useState(60);
  const [sentLink, setsentLink] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    dispatch(updateStepper(1));
  }, []);

  function updateTime() {
    if (seconds === 0) {
      //reset
      setSeconds(0);
    } else {
      if (seconds === 0) {
        setSeconds(59);
      } else {
        setSeconds((seconds) => seconds - 1);
      }
    }
  }

  useEffect(() => {
    const token = setTimeout(updateTime, 1000);
    return function cleanUp() {
      clearTimeout(token);
    };
  });

  const handleNewCodeClicked = () => {
    dispatch(authActions.resendSignUpVerifyLink(email));
    setSeconds(60);
  };

  const handleLinkClick = () => {
    dispatch(authActions.resendSignUpVerifyLink(email));
    setsentLink(true);
  };
  return (
    <>
      {sentLink && <CheckEmailComponent />}
      {!sentLink && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: "25px",
              minWidth: { sm: "100%", md: "450px" },
              maxWidth: "450px",
            }}
            className="backgroundfirefoxAuth"
          >
            <Container>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography component="h6" variant="h6">
                  {title}
                </Typography>
                <Typography
                  style={{
                    color: "#FFF",
                    fontWeight: 400,
                    fontSize: "14px",
                    marginTop: "30px",
                  }}
                >
                  <Link style={{ cursor: "pointer" }} onClick={handleLinkClick}>
                    Send a new link{" "}
                  </Link>
                  to authenticate, it will be valid for 60 minutes.
                </Typography>
              </Box>
            </Container>
          </Paper>
        </Box>
      )}
    </>
  );
}
