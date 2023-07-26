import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Link,
  Container,
} from "@mui/material";
import {
  resendLinkEmailNotPresentError,
  authenticateYourAccount,
  checkEmailMessage,
  waitForSomeTime,
  sendANewLink,
  resentLinkTitle,
  resentLinkDescription,
  resentLinkSubDesc,
} from "../../utils/constants";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { actions } from "../../actions";
let { displaySnackbar } = actions.commonActions;

export default function CheckEmailComponent({ email = email }) {
  const [seconds, setSeconds] = React.useState(60);
  const auth = useSelector((state) => state.authReducer || {});
  const commonReducer = useSelector((state) => state.commonReducer || {});
  let loading = commonReducer.loading || false;
  let resetLink = auth.showRestLink;
  const dispatch = useDispatch();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const confirmResendNewLink = () => {
    if (email) {
      dispatch(actions.commonActions.setLoading(true));
      dispatch(actions.authActions.resendSignUpVerifyLink(email));
    } else {
      dispatch(displaySnackbar(resendLinkEmailNotPresentError));
    }
  };
  React.useEffect(() => {
    if (!resetLink) return;
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(0);
    }
  }, [resetLink, seconds]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: { xs: "24px 8px", md: "48px" },
          minWidth: { sm: "100%", md: "432px" },
          maxWidth: "432px",
          marginBottom: "200px",
        }}
        className="backgroundfirefoxAuth"
      >
        <Container maxWidth="xs" sx={{ p: "0!important" }}>
          {loading ? (
            <LoadingIndicator isModal={true} />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/images/FindEmail.png"
                  alt="important"
                  width="96px"
                  height="96px"
                />
              </div>
              <Typography
                variant="h4"
                sx={{ mb: "1.5rem", marginTop: "1.5rem" }}
              >
                {resetLink ? resentLinkTitle : authenticateYourAccount}
              </Typography>
              <Typography>
                {resetLink ? resentLinkDescription : checkEmailMessage}
              </Typography>
              <Typography sx={{ marginTop: "1.5rem" }}>
                {resetLink
                  ? resentLinkSubDesc + " " + `for ${seconds} seconds`
                  : waitForSomeTime}{" "}
                {seconds === 0 && resetLink ? (
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={confirmResendNewLink}
                  >
                    {sendANewLink}
                  </Link>
                ) : null}
                {seconds > 0 && !resetLink ? (
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={confirmResendNewLink}
                  >
                    {sendANewLink}
                  </Link>
                ) : null}
                .
              </Typography>
            </Box>
          )}
        </Container>
      </Paper>
    </Box>
  );
}
