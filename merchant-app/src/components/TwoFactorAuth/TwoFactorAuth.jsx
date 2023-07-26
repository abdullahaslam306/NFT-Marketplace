import React, { useEffect } from "react";
import { Typography, Box, Paper, Button, Link } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { actions } from "../../actions";
import {
  SIGNIN_2FA_CODE_DESC,
  SIGNIN_2FA_CODE_TITLE,
} from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import OTPComponent from "../OTPComponent/OTPComponent";
import CircularProgress from "@mui/material/CircularProgress";
import BasicButton from "../Button/BasicButton";
import { useRouter } from "next/router";

let { authActions } = actions;

export default function TwoFactorAuth({ values = {}, loading }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [hideContent, setHideContent] = React.useState(false);
  const [error, setError] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const [resentLink, setResentLink] = React.useState(false);
  const [seconds, setSeconds] = React.useState(60);

  const auth = useSelector((state) => state.authReducer || {});
  const cognitoUser = useSelector(
    (state) =>
      (state.authReducer &&
        state.authReducer.cognitoUserForIntermediateAction) ||
      {}
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const phoneNumber =
    (cognitoUser &&
      cognitoUser.challengeParam &&
      cognitoUser.challengeParam.CODE_DELIVERY_DESTINATION) ||
    "";

  const handleCodeSubmit = () => {
    dispatch(actions.commonActions.setLoading(true));
    let token =
      (auth &&
        auth.cognitoUserForIntermediateAction &&
        auth.cognitoUserForIntermediateAction.signInUserSession &&
        auth.cognitoUserForIntermediateAction.signInUserSession.accessToken &&
        auth.cognitoUserForIntermediateAction.signInUserSession.accessToken
          .jwtToken) ||
      "";
    dispatch(
      authActions.confirmLogin(auth.cognitoUserForIntermediateAction, otp)
    );
  };
  const handleChange = (otp) => {
    setOTP(otp);
    setError("");
  };

  const handleNewCodeClicked = () => {
    dispatch(
      actions.authActions.signInUserAction({
        email: values.email,
        password: values.password,
      })
    );
    setSeconds(60);
  };

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

  useEffect(() => {
    if (
      auth.isAuthenticated &&
      auth.isPhoneVerified &&
      typeof window != "undefined" &&
      !auth.isAuthenticatedWithNewUser
    ) {
      router.push("/dashboard", undefined, { shallow: true });
    }
  }, [auth.isPhoneVerified, auth.isAuthenticated]);

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
          p: "48px",
          minWidth: { sm: "100%", md: "432px" },
          maxWidth: "432px",
        }}
        className="backgroundfirefoxAuth"
      >
        <Typography variant="h4">{SIGNIN_2FA_CODE_TITLE}</Typography>
        <Typography sx={{ mt: "8px" }} variant="body1">
          {SIGNIN_2FA_CODE_DESC}{" "}
          {`********${phoneNumber.substr(phoneNumber.length - 4)}`}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: "16px" }}>
          <OTPComponent otp={otp} hasErrored={false} setOtpFn={handleChange} />
        </Box>

        {error && <Typography color="error">{error}</Typography>}
        <Box sx={{ display: "flex", justifyContent: "center", mt: "30px" }}>
          <BasicButton
            color="primary"
            variant="contained"
            onClickHandler={handleCodeSubmit}
            disabled={otp.length === 6 ? false : true}
            loading={loading}
            title={"SUBMIT CODE"}
            sx={{ width: "100%", m: 0 }}
          ></BasicButton>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ mt: "16px" }}>
            It may take a minute to receive your code.{" "}
            {seconds !== 0 &&
              "you should be able to send a new code in " +
                seconds +
                " seconds"}
            {seconds === 0 && (
              <Link
                onClick={handleNewCodeClicked}
                style={{ cursor: "pointer" }}
              >
                Receive a new code.
              </Link>
            )}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
