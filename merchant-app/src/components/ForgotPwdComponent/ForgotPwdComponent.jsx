import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { actions } from "../../actions";
import { validateEmail } from "../../utils/helper";
import UserAlreadyExistComponent from "../UserAlreadyExistComponent/UserAlreadyExistComponent";
import ForgotPwdCodeVerificationComponent from "./ForgotPwdCodeVerificationComponent";
import { emailNotRegistered } from "../../utils/constants";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import BasicButton from "../Button/BasicButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ForgotPwdComponent(prop) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    isValidEmail: true,
    isEmailPwdNotFilled: false,
  });
  const auth = useSelector((state) => state.authReducer || {});
  const commonReducer = useSelector((state) => state.commonReducer || {});
  const loading = commonReducer.loading;

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const router = useRouter();

  const handleChange = (prop) => (event) => {
    let { target } = event;
    let e = true;
    if (prop === "email") {
      e = validateEmail(target["value"]);
    }
    setValues({ ...values, [prop]: event.target["value"], isValidEmail: e });
  };

  const handleResetPwdClick = (event) => {
    event.preventDefault();
    dispatch(actions.commonActions.setLoading(true));
    if (values.email) {
      dispatch(actions.authActions.forgotPwd(values.email));
    } else {
      setValues({ ...values, isEmailPwdNotFilled: true });
    }
  };

  useEffect(() => {
    if (auth.forgotPwdSuccess && typeof window != "undefined") {
      router.push("/login?resetPwd=true", undefined, { shallow: true });
    }
  }, [auth.forgotPwdSuccess]);

  return (
    <>
      {auth.showOTP && (
        <ForgotPwdCodeVerificationComponent email={values.email} />
      )}
      {/* {(commonReducer.loading || auth.forgotPwdSuccess) && (
        <>
          <LoadingIndicator
            isModal={true}
            title={"Resetting your password..."}
          />
        </>
      )} */}
      {!auth.showOTP && !auth.isUserNotRegistered && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            sx={{
              p: { xs: "24px 8px", md: "48px" },
              minWidth: { sm: "100%", md: "432px" },
              maxWidth: "432px",
            }}
            className="backgroundfirefoxAuth"
            elevation={2}
          >
            <Typography
              variant="h4"
              sx={{
                mb: "20px",
                display: "flex",
                alignItems: "center",
                color: "#24D182",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "15px",
              }}
              onClick={() =>
                router.push("/login", undefined, { shallow: true })
              }
            >
              <ArrowBackIcon sx={{ marginRight: "5px" }} /> BACK
            </Typography>
            <Typography variant="h4" sx={{ mb: "8px" }}>
              Forgot Password?
            </Typography>
            <Typography sx={{ mb: "16px" }}>
              We just need your registered email address to send a verification
              code to change password.
            </Typography>
            <Box component="form">
              <Box sx={{ mb: "16px" }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  variant="outlined"
                  onChange={handleChange("email")}
                  error={!values.isValidEmail}
                  helperText={
                    !values.isValidEmail ? (
                      <span color="error">
                        Invalid email address. Valid email can only contain
                        latin letters, numbers, "@", ".", "-", and "_".
                      </span>
                    ) : null
                  }
                />
              </Box>
            </Box>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ marginTop: "15px" }}
            >
              <BasicButton
                variant="contained"
                color="primary"
                type="submit"
                onClickHandler={handleResetPwdClick}
                disabled={!values.email || !values.isValidEmail}
                title={"RESET PASSWORD"}
                loading={loading}
                sx={{ width: "100%", m: 0 }}
              ></BasicButton>
            </Grid>
          </Paper>
        </Box>
      )}
      {!auth.showOTP && auth.isUserNotRegistered && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <UserAlreadyExistComponent
            email={values.email}
            notRegistered={true}
            link="/forgot-password"
            buttonTxt="SIGN UP"
            href="/register"
            userDoesNotExists={true}
            title={emailNotRegistered}
          />
        </Box>
      )}
    </>
  );
}
