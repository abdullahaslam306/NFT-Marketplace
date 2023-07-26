import {
  Paper,
  Typography,
  Box,
  Container,
  FormControl,
  Link,
  Grid,
} from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { validateEmail, validatePassword } from "../../utils/helper";
import InputField from "../InputField/InputField";
import BasicButton from "../Button/BasicButton";
import { actions } from "../../actions";
import { encryptValue, getVersionId } from "../../utils/encryption";
import PasswordInputField from "../PasswordInputField/PasswordInputField";
import {
  TermsandConditions_URL,
  PrivacyPolicy_URL,
} from "../../utils/constants";

import { makeStyles, createStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    row: { display: "flex" },
    column: {
      flex: "50%",
      fontSize: "12px",
      fontFamily: "Roboto",
      lineHeight: "18px",
      letterSpacing: "0.15px",
    },
  })
);

export const useOutlinedInputStyles = makeStyles((theme) => ({
  root: {
    "& $notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
  },
  background: "transparent",

  notchedOutline: {},
}));

export default function SignUpComponent({ handleformSubmitted, handleEmail }) {
  const dispatch = useDispatch();

  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false,
    isValidEmail: true,
    isValidPassword: true,
    showPwdValidators: false,
  });
  const commonReducer = useSelector(
    (state) => (state && state.commonReducer) || {}
  );
  const loading = commonReducer.loading;

  const [passwordValidators, setPasswordValidators] = React.useState({
    isContainLowerCase: false,
    isContainUpperCase: false,
    isContainSpecialChar: false,
    isContainMinimumLength: false,
    isContainNumber: false,
  });

  function validatePassword(password) {
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let isLengthValid = password.length > 7;
    let lc = /[a-z]/.test(password);
    let uc = /[A-Z]/.test(password);
    let sc = format.test(password);
    let number = /\d/.test(password);

    setPasswordValidators({
      isContainLowerCase: lc,
      isContainUpperCase: uc,
      isContainSpecialChar: sc,
      isContainMinimumLength: isLengthValid,
      isContainNumber: number,
    });

    return isLengthValid && lc && uc && sc && number;
  }

  const handleChangePassword = (event, isValid) => {
    setValues({
      ...values,
      password: event.target.value,
      showValidation: event.target.value ? true : false,
      showPwdValidators: true,
      isValidPassword: isValid,
    });
  };

  const handleChange = (prop) => (event) => {
    if (prop === "email") {
      let e = validateEmail(event.target.value);
      if (event.target.value === "") {
        e = true;
      }
      // handleEmail(event.target.value);
      setValues({
        ...values,
        [prop]: event.target.value,
        isValidEmail: e,
        showPwdValidators: false,
      });
    } else if (prop === "password") {
      let e = validatePassword(event.target.value);
      if (event.target.value === "") {
        e = true;
      }
      setValues({
        ...values,
        [prop]: event.target.value,
        showPwdValidators: true,
        isValidPassword: e,
      });
    }
  };

  const handleSignupButtonClicked = (event) => {
    event.preventDefault();
    dispatch(actions.commonActions.setLoading(true));
    dispatch(actions.commonActions.setLoading(true));
    handleformSubmitted(true);
    handleEmail(values.email);
    const payload = {
      email: values.email,
      password: encryptValue(values.password),
      version: getVersionId(),
    };
    dispatch(actions.authActions.signUp(payload));
  };

  return (
    <>
      {/* {loading && (
        <LoadingIndicator isModal={true} title={"Creating your account..."} />
      )} */}
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
            mb: 3,
            minWidth: { sm: "100%", md: "432px" },
            maxWidth: "432px",
          }}
          className="backgroundfirefoxAuth"
        >
          <Container sx={{ p: "0!important" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h4" sx={{ mb: "30px" }}>
                Sign Up
              </Typography>
              <Typography sx={{ fontWeight: "500", mb: "30px" }}>
                Type in your email in the field below and let us create your new
                account
              </Typography>
              <Box component="form">
                <Box sx={{ mb: "16px" }}>
                  <InputField
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
                        <span>
                          {`Invalid email address. Valid email can only contain
                          latin letters, numbers, "@", ".", "-", and "_".`}
                        </span>
                      ) : null
                    }
                  />
                </Box>
                <Box sx={{ mb: "16px" }}>
                  <FormControl variant="outlined" fullWidth>
                    <PasswordInputField
                      value={values.password}
                      onChange={handleChangePassword}
                      label={"Password"}
                      fullWidth={true}
                      showValidation={values.showValidation}
                    />
                  </FormControl>
                </Box>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <BasicButton
                    variant="contained"
                    color="primary"
                    onClickHandler={handleSignupButtonClicked}
                    disabled={!values.isValidPassword}
                    loading={loading}
                    title={"Sign Up"}
                    sx={{ margin: 0, width: "100%" }}
                  />
                </Grid>

                <Typography variant="body2" sx={{ mt: "16px" }}>
                  By clicking SIGN UP, I have read and agree to Blocommerce’s
                  <Link href={TermsandConditions_URL}>
                    {" "}
                    Terms of Use
                  </Link> and{" "}
                  <Link href={PrivacyPolicy_URL}>Privacy Policy</Link>.
                </Typography>
                <Box
                  style={{
                    margin: "16px 0",
                    borderTop: "1px solid rgba(255, 255, 255, 0.23)",
                  }}
                ></Box>
                <Grid container sx={{ py: "9px" }} justifyContent="center">
                  <Grid item xs>
                    <Typography sx={{ fontSize: "12px", fontWeight: "400" }}>
                      Already have an account?
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        fontSize: "15px",
                        fontWeight: "500",
                        px: "24px",
                      }}
                    >
                      <Link href={"/login/"}>Sign in</Link>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Paper>
      </Box>
    </>
  );
}
