import { Typography, Box, Link } from "@mui/material";
import { useState, useEffect } from "react";
import OTPComponent from "../OTPComponent/OTPComponent";
import BasicButton from "../Button/BasicButton";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../actions";

export default function MFAverificationScreen({ phonenumber = "" }) {
  const [otp, setotp] = useState("");
  const [seconds, setSeconds] = useState(60);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authReducer || {});
  const commonReducer = useSelector((state) => state.commonReducer || {});
  let loading = commonReducer.loading || false;
  const submitCodeClicked = () => {
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
      actions.authActions.verifyPhoneNumber(
        { number: phonenumber, code: otp },
        token
      )
    );
  };
  const handleChange = (otp) => {
    setotp(otp);
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

  const handleNewCodeClicked = () => {
    dispatch(actions.commonActions.setLoading(true));
    let token =
      (auth &&
        auth.cognitoUserForIntermediateAction &&
        auth.cognitoUserForIntermediateAction.signInUserSession &&
        auth.cognitoUserForIntermediateAction.signInUserSession.accessToken &&
        auth.cognitoUserForIntermediateAction.signInUserSession.accessToken
          .jwtToken) ||
      "";
    dispatch(actions.authActions.addPhoneNumber(phonenumber, token));
    setSeconds(60);
  };

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
    <Box>
      <Typography variant="h4">Enter 6-digit code</Typography>
      <Typography variant="body1" sx={{ marginTop: "8px", mb: "16px" }}>
        {`Almost done, now enter the 6-digit code we sent to ********${phonenumber.substr(
          phonenumber.length - 4
        )} to finish authentication.`}
      </Typography>
      <Box
        sx={{
          display: "-webkit-flex",
          display: "-ms-flexbox",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <OTPComponent otp={otp} hasErrored={false} setOtpFn={handleChange} />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: "16px" }}>
        <BasicButton
          color="primary"
          variant="contained"
          onClickHandler={submitCodeClicked}
          type={"submit"}
          disabled={otp && otp.length === 6 ? false : true}
          title={"SUBMIT CODE"}
          loading={loading}
          sx={{ width: "100%", m: "0" }}
        />
      </Box>
      <Typography variant="body2" sx={{ mt: "16px" }}>
        It may take a minute to receive your code.{" "}
        {seconds !== 0 &&
          "you should be able to send a new code in " + seconds + " seconds"}
        {seconds === 0 && (
          <Link onClick={handleNewCodeClicked}>Receive a new code.</Link>
        )}
      </Typography>
    </Box>
  );
}
