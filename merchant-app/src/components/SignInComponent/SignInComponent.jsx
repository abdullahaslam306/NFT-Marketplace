import {
  Paper,
  Typography,
  Box,
  Container,
  FormControl,
  Link,
  Grid,
  TextField,
} from "@mui/material";
import StepperComponent from "../StepperComponent/StepperComponent";
import {
  emailNotRegistered,
  SIGNUP_CONGRATULATIONS_SUBTEXT,
  SIGNUP_CONGRATULATIONS,
  PrivacyPolicy_URL,
  TermsandConditions_URL,
} from "../../utils/constants";
import CheckEmailComponent from "../CheckEmailComponent/CheckEmailComponent";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { validateEmail, validatePassword } from "../../utils/helper";
import BasicButton from "../Button/BasicButton";
import { PhoneVerificationModalWrapper } from "../PhoneVerificationModalWrapper/PhoneVerificationModalWrapper";
import { actions } from "../../actions";
import UserAlreadyExistComponent from "../UserAlreadyExistComponent/UserAlreadyExistComponent";
import TwoFactorAuth from "../TwoFactorAuth/TwoFactorAuth";
import SuccessModal from "../successModal/index";
import PasswordInputField from "../PasswordInputField/PasswordInputField";
import SignInTag from "../signInTag";

let { authActions, commonActions } = actions;

export default function SignInComponent({ email = "", resp = "" }) {
  const auth = useSelector((state) => state.authReducer || {});
  const commonReducer = useSelector((state) => state.commonReducer || {});
  let loading = commonReducer.loading || false;
  const dispatch = useDispatch();
  const router = useRouter();
  let resetPwd = router.query["resetPwd"];
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    isValidEmail: true,
    isValidPassword: true,
    isEmailPwdNotFilled: false,
    showSigninTag: false,
  });

  const handleChange = (prop) => (event) => {
    let { target } = event;
    let e = true;
    if (prop === "email") {
      e = validateEmail(target["value"]);
      if (event.target.value === "") {
        e = false;
      }
      setValues({
        ...values,
        [prop]: event.target["value"],
        isValidEmail: e,
      });
    } else if (prop === "password") {
      let e = validatePassword(target["value"]);
      if (event.target.value === "") {
        e = false;
      }
      setValues({
        ...values,
        [prop]: target["value"],
        isValidPassword: e,
      });
    }
  };

  const handleSignInButtonClicked = (event) => {
    event.preventDefault();
    if (values.email && values.password) {
      dispatch(commonActions.setLoading(true));
      let user = {
        email: values.email,
        password: values.password,
      };
      setValues({ ...values, showSigninTag: true });
      dispatch(authActions.signInUserAction(user));
      setTimeout(() => {
        setValues({ ...values, showSigninTag: false });
      }, 500);
    } else {
      setValues({ ...values, isEmailPwdNotFilled: true });
    }
  };

  if (
    auth.isAuthenticated &&
    auth.isPhoneVerified &&
    typeof window != "undefined" &&
    !auth.isAuthenticatedWithNewUser
  ) {
    router.push("/dashboard", undefined, { shallow: true });
  }

  if (auth.showCheckEmail) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <StepperComponent />
        <CheckEmailComponent email={email} />
      </Box>
    );
  }
  if (
    !auth.isPhoneVerified &&
    auth.isEmailVerified &&
    !auth.emailisAuthenticated
  ) {
    return (
      <>
        {/* {loading && (
          <LoadingIndicator
            isModal={true}
            title={"Updating the phone number..."}
          />
        )} */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <StepperComponent />
          <Paper
            elevation={2}
            sx={{
              p: { xs: "24px 8px", md: "48px" },
              minWidth: { sm: "100%", md: "432px" },
              maxWidth: { sm: "100%", md: "432px" },
              margin: "auto",
            }}
            className="backgroundfirefoxAuth"
          >
            <Container sx={{ p: "0!important" }}>
              <PhoneVerificationModalWrapper />
            </Container>
          </Paper>
        </Box>
      </>
    );
  }

  if (
    auth.isPhoneVerified &&
    auth.isEmailVerified &&
    !auth.userAlreadyConfirmed &&
    !auth.emailisAuthenticated
  ) {
    setTimeout(() => {
      router.push("/dashboard", undefined, { shallow: true });
    }, 2000);

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <StepperComponent />
          <Paper
            elevation={2}
            sx={{
              p: { xs: "24px 8px", md: "25px" },
              minWidth: { sm: "100%", md: "450px" },
              maxWidth: { sm: "100%", md: "450px" },
              margin: "auto",
            }}
          >
            <SuccessModal
              text={SIGNUP_CONGRATULATIONS}
              open={true}
              onActionButtonClick={() =>
                router.push("/dashboard", undefined, { shallow: true })
              }
              showActionButton={true}
              actionButtonText={"ACCESS MY ACCOUNT"}
              subText={SIGNUP_CONGRATULATIONS_SUBTEXT}
              subTextDisplay={true}
            />
          </Paper>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* {loading && (
        <LoadingIndicator isModal={true} title={"Authenticating..."} />
      )} */}
      {values.showSigninTag && <SignInTag email={values.email} />}
      {auth.show2FA ? (
        <TwoFactorAuth values={values} loading={loading} />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {auth.showUserNotFound ? (
            <UserAlreadyExistComponent
              email={values.email}
              userDoesNotExists={true}
              buttonTxt={"SIGN UP"}
              link={"/login"}
              href={"/register"}
              title={emailNotRegistered}
            />
          ) : (
            <Paper
              elevation={2}
              sx={{
                p: { xs: "24px 8px", md: "48px" },
                minWidth: { xs: "100%", md: "432px" },
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
                  <div>
                    {resetPwd ? (
                      <div>
                        <Typography variant="h6" sx={{ mb: "16px" }}>
                          You have successfully updated your password! &nbsp;
                          <span style={{ color: "#7752E0" }}>
                            Please sign in with your new password
                          </span>
                        </Typography>
                      </div>
                    ) : auth.isEmailVerified && auth.emailisAuthenticated ? (
                      <div>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: "20px", mb: "8px" }}
                        >
                          Congratulations!
                        </Typography>
                        <Typography sx={{ fontSize: "14px", mb: "16px" }}>
                          Your account is activated. Please Sign in with your
                          credentials to continue setting up your account!
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="h4" sx={{ mb: "15px" }}>
                        Sign In
                      </Typography>
                    )}
                  </div>
                  <Box component="form">
                    <Box sx={{ mb: "16px" }}>
                      <TextField
                        fullWidth={true}
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        variant="outlined"
                        onChange={handleChange("email")}
                        value={values.email}
                        error={!values.isValidEmail}
                        helperText={
                          !values.isValidEmail && values.email ? (
                            <Typography color="error">
                              {`Invalid email address. Valid email can only
                              contain latin letters, numbers, "@", ".", "-", and
                              "_".`}
                            </Typography>
                          ) : !values.email && !values.isValidEmail ? (
                            <Typography color="error">
                              Please enter an email address to Sign in
                            </Typography>
                          ) : null
                        }
                      />
                    </Box>
                    <Box sx={{ mb: "16px" }}>
                      <FormControl variant="outlined" fullWidth>
                        {/* <InputLabel htmlFor="outlined-adornment-password">
                          Password
                        </InputLabel> */}
                        <PasswordInputField
                          value={values.password}
                          onChange={handleChange("password")}
                          label={"Password"}
                          fullWidth={true}
                        />
                        {/* <PasswordInputField
                          id="outlined-adornment-password"
                          type={values.showPassword ? "text" : "password"}
                          value={values.password}
                          label="Password"
                          fullWidth
                          disabled={loading}
                          // style={{ color: "#FFF" }}
                          placeholder=""
                          autoComplete={false}
                          onChange={handleChange("password")}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                              >
                                {values.showPassword ? (
                                  <Visibility color="active" />
                                ) : (
                                  <VisibilityOff color="active" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          error={!values.isValidPassword}
                          label="Password"
                        /> */}
                        {(values.isEmailPwdNotFilled ||
                          !values.isValidPassword) && (
                          <Box mt={"3px"} ml={"14px"} mr={"14px"}>
                            {!values.isValidPassword && values.password ? (
                              <Typography color="error">
                                Your password does not meet with the security
                                standard. Please enter your password again.
                              </Typography>
                            ) : (
                              <Typography color="error">
                                Please enter a password to sign in
                              </Typography>
                            )}
                          </Box>
                        )}
                      </FormControl>
                      <div sx={{ width: "100%", float: "left" }}>
                        <Link
                          href="/forgot-password"
                          sx={{ my: "16px", float: "right" }}
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </Box>

                    <Grid
                      sx={{ my: "16px" }}
                      container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <BasicButton
                        variant="contained"
                        color="primary"
                        type="submit"
                        title={"Sign In"}
                        onClickHandler={handleSignInButtonClicked}
                        loading={loading}
                        sx={{ margin: 0, width: "100%" }}
                        disabled={
                          loading ||
                          !values.email ||
                          !values.password ||
                          !values.isValidPassword ||
                          !values.isValidEmail
                        }
                      ></BasicButton>
                      <Typography
                        style={{
                          margin: "15px 0",
                          fontWeight: "400",
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                          color: "#ffffff",
                        }}
                      >
                        By clicking SIGN IN, I have read and agree to
                        BLOCommerce’s{" "}
                        <Link
                          target="_blank"
                          style={{ color: "#24D182", cursor: "pointer" }}
                          href={TermsandConditions_URL}
                        >
                          Terms of Use
                        </Link>{" "}
                        and{" "}
                        <Link
                          target="_blank"
                          style={{ color: "#24D182", cursor: "pointer" }}
                          href={PrivacyPolicy_URL}
                        >
                          Privacy Policy.
                        </Link>
                      </Typography>
                    </Grid>
                    <hr />
                    <Grid container sx={{ py: "9px" }} justifyContent="center">
                      <Grid item xs>
                        <Typography>Need an account?</Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          <Link href={"/register"}>SIGN UP</Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Container>
            </Paper>
          )}
        </Box>
      )}
    </>
  );
}
