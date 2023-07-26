import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, FormHelperText, Grid, Button } from "@mui/material";
import OTPComponent from "../../OTPComponent/OTPComponent";
import MailIcon from "@mui/icons-material/Mail";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BasicButton from "../../Button/BasicButton";
import { useSendNFTStyles } from "./SendNftModalStyles";
import { actions } from "../../../actions";

function SendNFTOTPComponent({ values, id }) {
  const classes = useSendNFTStyles();
  const [otpEmail, setEmailOTP] = React.useState("");
  const [otpPhone, setPhoneOTP] = React.useState("");
  const [counterPhone, setCounterPhone] = React.useState(60);
  const [counterEmail, setCounterEmail] = React.useState(60);

  React.useEffect(() => {
    const timerPhone =
      counterPhone > 0 &&
      setInterval(() => setCounterPhone(counterPhone - 1), 1000);

    const timerEmail =
      counterEmail > 0 &&
      setInterval(() => setCounterEmail(counterEmail - 1), 1000);
    return () => {
      clearInterval(timerEmail);
      clearInterval(timerPhone);
    };
  }, [counterPhone, counterEmail]);

  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profileReducer || {});

  const handleChangeEmailOtp = (otp) => {
    setEmailOTP(otp);
  };
  const handleChangePhoneOtp = (otp) => {
    setPhoneOTP(otp);
  };

  const handleResendCode = (type) => {
    const payload = {
      action: "sendNft",
      transactionUid: profile.transId,
    };

    if (type === "email") {
      setCounterEmail(60);
      payload.channel = "email";
      dispatch(actions.profileActions.resendMFA(payload));
    } else if (type === "phone") {
      setCounterPhone(60);
      payload.channel = "phone";
      dispatch(actions.profileActions.resendMFA(payload));
    }
  };

  const handleSubmitTrasferNft = () => {
    const payload = {
      to: values.walletAddress,
      editions: values.totalEditions,
      transactionUid: profile.transId,
      emailCode: otpEmail,
      phoneCode: otpPhone,
    };

    dispatch(
      actions.nftActions.transferNFTAction(true, payload, id, (res) => {})
    );
  };

  return (
    <div>
      <Typography
        variant="p"
        style={{ margin: "20px 0 10px 0" }}
        paragraph={true}
      >
        To confirm your transaction, please complete the following verification.
        It may take a minute to receive your codes
      </Typography>
      <Grid
        container
        className={classes.dflex}
        style={{ flexDirection: "column" }}
      >
        <Grid item xs className={classes.mailIcon}>
          <MailIcon sx={{ color: "#A5A6A8" }} />
        </Grid>
        <Grid item xs>
          <FormHelperText
            style={{
              color: "#FFF",
              fontStyle: "400",
              fontSize: "12px",
              lineHeight: "20px",
              margin: "10px 0px",
            }}
          >
            Please enter the 6 digit code sent to {profile?.email?.substr(0, 3)}
            ****.
            <span style={{ color: "#ebb440" }}>
              {" Check your spam folder if you can't find verification code."}
            </span>
          </FormHelperText>
        </Grid>
        <Grid item xs>
          <OTPComponent
            otp={otpEmail}
            hasErrored={false}
            setOtpFn={handleChangeEmailOtp}
          />
        </Grid>
        <Grid
          item
          sx={{
            textAlign: "right",
            fontSize: "12px",
            lineHeight: "20px",
            margin: "4px 0 16px",
          }}
        >
          {counterEmail > 0 ? (
            <div>Wait {counterEmail} seconds to send a new code</div>
          ) : (
            <Button
              variant="text"
              color="primary"
              type="submit"
              onClick={() => handleResendCode("email")}
              className={classes.sendNewCodeLink}
              sx={{ margin: "0", textTransform: "none" }}
              // endIcon={<ArrowForwardIcon />}
            >
              Send a new code
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid container style={{ flexDirection: "column" }}>
        <Grid item xs className={classes.phoneIcon}>
          <PhoneAndroidIcon sx={{ color: "#A5A6A8", height: "22px" }} />
        </Grid>
        <Grid item xs>
          {" "}
          <FormHelperText
            style={{
              color: "#FFF",
              fontStyle: "400",
              fontSize: "12px",
              lineHeight: "20px",
              margin: "10px 0px",
            }}
          >
            Please enter the 6 digit code sent to ***-****
            {profile?.phoneNumber?.substr(profile.phoneNumber.length - 3)}
          </FormHelperText>
        </Grid>
        <Grid item xs sx={{ verticalAlign: "bottom" }}>
          <OTPComponent
            otp={otpPhone}
            hasErrored={false}
            setOtpFn={handleChangePhoneOtp}
          />
        </Grid>
        <Grid
          item
          sx={{
            textAlign: "right",
            fontSize: "12px",
            lineHeight: "20px",
            margin: "4px 0 16px",
          }}
        >
          {counterPhone > 0 ? (
            <div>Wait {counterPhone} seconds to send a new code</div>
          ) : (
            <Button
              variant="text"
              color="primary"
              type="submit"
              className={classes.sendNewCodeLink}
              sx={{ margin: "0", textTransform: "none", textAlign: "right" }}
              onClick={() => handleResendCode("phone")}
            >
              Send a new code
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <BasicButton
            variant="contained"
            color="primary"
            type="submit"
            title={"confirm transaction"}
            disabled={otpEmail.length !== 6 || otpPhone.length !== 6}
            onClickHandler={handleSubmitTrasferNft}
          ></BasicButton>
        </Grid>
      </Grid>{" "}
    </div>
  );
}
export { SendNFTOTPComponent };
