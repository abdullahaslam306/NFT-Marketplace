import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Link,
  Paper,
  Typography,
  Container,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import OTPComponent from "../OTPComponent/OTPComponent";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { actions } from "../../actions";
import SignInComponent from "../SignInComponent/SignInComponent";
import { encryptValue, getVersionId } from "../../utils/encryption";
import { useTheme } from "@emotion/react";
import PasswordInputField from "../PasswordInputField/PasswordInputField";
import BasicButton from "../Button/BasicButton";

export default function ForgotPwdCodeVerificationComponent({ email = "" }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    otp: "",
    password: "",
    isSubmitted: false,
    showValidation: false,
  });
  const [seconds, setSeconds] = React.useState(60);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const commonReducer = useSelector((state) => state.commonReducer || {});
  const loading = commonReducer.loading;

  const auth = useSelector((state) => state.authReducer || {});

  const handleChange = (event, isValid) => {
    setValues({
      ...values,
      password: event.target.value,
      showValidation: event.target.value ? true : false,
      showPwdValidators: true,
      isValidPassword: isValid,
    });
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

  const handleOtpChange = (otp) => {
    setValues({
      ...values,
      otp: otp,
    });
  };

  const handleResetPwdClicked = (event) => {
    setValues({
      ...values,
      isSubmitted: true,
    });
    dispatch(actions.commonActions.setLoading(true));
    if (values.otp && values.password) {
      const payload = {
        transactionUid: auth.transId,
        emailCode: values.otp,
        password: encryptValue(values.password),
        version: getVersionId(),
      };
      dispatch(actions.authActions.forgotPwdSubmit(payload));
    }
  };
  const handleNewCodeClicked = () => {
    dispatch(actions.authActions.forgotPwd(email));
    setSeconds(60);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            p: { xs: "24px 8px", md: "48px" },
            minWidth: { sm: "100%", md: "450px" },
            maxWidth: "450px",
          }}
          elevation={2}
          className="backgroundfirefoxAuth"
        >
          <Typography variant="h4" sx={{ mb: "8px" }}>
            We have sent a 6-digit verification code to your email.
          </Typography>
          <Typography variant="body1">
            Please enter the 6-digit code we have sent to {email.substr(0, 3)}
            ******
          </Typography>
          <Box
            sx={{
              display: "-webkit-flex",
              display: "-ms-flexbox",
              display: "flex",
              justifyContent: "center",
              mt: "16px",
            }}
          >
            <OTPComponent
              otp={values.otp}
              hasErrored={false}
              setOtpFn={handleOtpChange}
            />
          </Box>

          <Typography
            variant="h4"
            style={{ marginTop: "16px", marginBottom: "16px" }}
          >
            Create a new password
          </Typography>
          <PasswordInputField
            value={values.password}
            onChange={handleChange}
            label={"Password"}
            fullWidth={true}
            showValidation={values.showValidation}
          />
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ my: "16px" }}
          >
            <BasicButton
              variant="contained"
              color="primary"
              onClickHandler={handleResetPwdClicked}
              disabled={
                !values.otp ||
                values.otp === "" ||
                values.otp.length < 6 ||
                !values.isValidPassword
              }
              title="RESET PASSWORD"
              loading={loading}
              sx={{ width: "100%", m: 0 }}
            ></BasicButton>
          </Grid>
          <Typography variant="body2">
            It may take a minute to receive your code.{" "}
            {seconds !== 0 &&
              "you should be able to send a new code in " +
                seconds +
                " seconds"}
            {seconds === 0 && (
              <Link onClick={handleNewCodeClicked}>Receive a new code.</Link>
            )}
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
