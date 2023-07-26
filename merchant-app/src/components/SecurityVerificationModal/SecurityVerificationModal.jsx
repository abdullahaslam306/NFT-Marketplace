import { useState, useEffect } from "react";
import { Typography, Link, Button, Grid, Box } from "@mui/material";
import PasswordInputField from "../PasswordInputField/PasswordInputField";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { actions } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
import { transaction_verification_text } from "../../utils/constants";
import MailIcon from "@mui/icons-material/Mail";
import { validatePassword } from "../../utils/helper";
import CustomModal from "../Modal/Modal";
import OTPComponent from "../OTPComponent/OTPComponent";
import { makeStyles, createStyles } from "@mui/styles";
import ErrorOutlineSharpIcon from "@mui/icons-material/ErrorOutlineSharp";

export const useStyles = makeStyles((theme) =>
  createStyles({
    modelWrapper: {
      maxWidth: "326px",
    },
    title: {
      fontWeight: 500,
      lineHeight: "24px",
    },
    subTitle: {
      lineHeight: "20px",
      marginBottom: "16px",
    },
    mailIcon: {
      height: "16px",
      marginBottom: "4px",
    },
    digitCodeText: {
      fontSize: "12px",
      marginBottom: "4px",
      lineHeigth: "20px",
      fontWeight: 700,
    },
    sendNewCodeText: {
      textAlign: "right",
      fontSize: "12px",
      lineHeight: "20px",
      margin: "4px 0 16px",
    },
    sendNewCodeLink: {
      cursor: "pointer",
      color: "#B6AEF6",
    },
    phoneIcon: {
      height: "22px",
    },
    createPasswordText: {
      marginBottom: "16px",
      fontWeight: 500,
      fontSize: "20px",
      lineHeight: "24px",
    },
    resetPasswordText: {
      margin: "16px 0 0 0",
      minWidth: "196px",
    },
  })
);

export default function SecurityVerificationModal({
  showModal = false,
  handlefn,
  handleEmailOTPFn,
  handlePhoneOTPFn,
  emailotp,
  phoneotp,
  phone = "",
  title = "Security Verification",
  subtitle = transaction_verification_text,
  handleConfirmTransaction,
  btnText = "CONFIRM TRANSACTION",
  password = "",
  resendCodeClicked = (event) => {},
  isPwd = false,
  handlePwdChange = (event) => {},
}) {
  const [modalState, setModalState] = useState(showModal);
  const profile = useSelector((state) => state.profileReducer || {});
  const walletReducer = useSelector((state) => state.walletReducer || {});
  const dispatch = useDispatch();
  const [resendEmailCode, setEmailResendCode] = useState({
    emailClicked: false,
    emailTime: 0,
  });
  const [resendPhoneCode, setPhoneResendCode] = useState({
    phoneClicked: false,
    phoneTime: 0,
  });

  useEffect(() => {
    setModalState(showModal);
  }, []);

  useEffect(() => {
    dispatch(actions.commonActions.setModalState(true));
    if (resendEmailCode.emailTime > 0) {
      setTimeout(
        () =>
          setEmailResendCode({
            ...resendEmailCode,
            emailTime: resendEmailCode.emailTime - 1,
          }),
        1000
      );
    } else {
      setEmailResendCode({ emailTime: 0, emailClicked: false });
    }
  }, [resendEmailCode.emailTime]);

  useEffect(() => {
    if (resendPhoneCode.phoneTime > 0) {
      setTimeout(
        () =>
          setPhoneResendCode({
            ...resendPhoneCode,
            phoneTime: resendPhoneCode.phoneTime - 1,
          }),
        1000
      );
    } else {
      setPhoneResendCode({ phoneTime: 0, phoneClicked: false });
    }
  }, [resendPhoneCode.phoneTime]);

  const resendCodeButtonClicked = (type) => () => {
    if (type === "email") {
      setEmailResendCode({ emailClicked: true, emailTime: 60 });
    } else if (type === "phone") {
      setPhoneResendCode({ phoneClicked: true, phoneTime: 60 });
    }
    resendCodeClicked(type);
  };

  const classes = useStyles();

  return (
    <CustomModal isCloseButton={true} showModal={true} onClose={handlefn}>
      <Box
        sx={{
          padding: "72px 50px 48px",
          maxWidth: { sm: "100%", md: "450px" },
        }}
      >
        <div className={classes.modelWrapper}>
          <Typography variant="h4" className={classes.title}>
            {title}
          </Typography>
          <Typography
            sx={{ mt: "8px", mb: "8px" }}
            className={classes.subTitle}
          >
            {subtitle}
          </Typography>
          <Grid container style={{ flexDirection: "column" }}>
            <Grid item xs className={classes.mailIcon}>
              <MailIcon sx={{ color: "#A5A6A8" }} />
            </Grid>
            <Typography className={classes.digitCodeText}>
              Please enter the 6-digit code we have sent to{" "}
              {profile &&
                profile.userProfile &&
                profile.userProfile.email &&
                profile.userProfile.email.substr(0, 3)}
              ******
            </Typography>
          </Grid>
          <OTPComponent
            otp={emailotp}
            setOtpFn={handleEmailOTPFn}
            hasErrored={""}
            sx={{ width: "100%" }}
          />
          <Grid item xs className={classes.sendNewCodeText}>
            {resendEmailCode.emailClicked ? (
              <p style={{ margin: "0px" }}>
                wait for {resendEmailCode.emailTime} seconds
              </p>
            ) : (
              <Link
                className={classes.sendNewCodeLink}
                onClick={resendCodeButtonClicked("email")}
              >
                Send a new code
              </Link>
            )}
          </Grid>
          <Grid
            container
            style={{
              flexDirection: "column",
              marginBottom: "4px",
            }}
          >
            <Grid item xs className={classes.phoneIcon}>
              <PhoneAndroidIcon sx={{ color: "#A5A6A8", height: "22px" }} />
            </Grid>
            <Typography className={classes.digitCodeText}>
              Please enter the 6-digit code we have sent to ******
              {phone
                ? phone.substr(phone.length - 4, 4)
                : profile &&
                  profile.userProfile &&
                  profile.userProfile.phone &&
                  profile.userProfile.phone.substr(
                    profile.userProfile.phone.length - 4,
                    4
                  )}
              .
            </Typography>
          </Grid>
          <OTPComponent
            otp={phoneotp}
            setOtpFn={handlePhoneOTPFn}
            hasErrored={""}
            sx={{ width: "100%" }}
          />
          <Grid item xs className={classes.sendNewCodeText}>
            {resendPhoneCode.phoneClicked ? (
              <p style={{ margin: "0px" }}>
                wait for {resendPhoneCode.phoneTime} seconds
              </p>
            ) : (
              <Link
                className={classes.sendNewCodeLink}
                onClick={resendCodeButtonClicked("phone")}
              >
                Send a new code
              </Link>
            )}
          </Grid>
          {isPwd && (
            <>
              <Typography variant="h6" className={classes.createPasswordText}>
                Create a new password
              </Typography>
              <PasswordInputField
                label={"New Password"}
                value={password}
                onChange={handlePwdChange}
                fullWidth={true}
                showValidation={password ? true : false}
              />
            </>
          )}
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Button
                onClick={handleConfirmTransaction}
                color="primary"
                variant="contained"
                sx={{ width: "100%" }}
                disabled={
                  !(emailotp.length > 5 && phoneotp.length > 5) ||
                  (isPwd && !validatePassword(password))
                }
                className={classes.resetPasswordText}
              >
                {btnText}
              </Button>
            </Grid>
            {walletReducer.sendEtherFailure && (
              <Grid
                item
                style={{
                  display: "flex",
                  marginTop: "20px",
                  background: "#383F4E",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                <ErrorOutlineSharpIcon color="error" />
                <Typography sx={{ ml: "12px", color: "#DFA6A5" }}>
                  Invalid verification code.
                </Typography>
              </Grid>
            )}
          </Grid>
        </div>
      </Box>
    </CustomModal>
  );
}
