import React from "react";
import OtpInput from "react-otp-input";
import { useTheme } from "@mui/styles";
import { useMediaQuery } from "@mui/material";

export default function OTPComponent({
  otp,
  hasErrored,
  setOtpFn = (otp) => {},
  autoFocus = true,
}) {
  const handleOtpChange = (otpVal) => {
    if (setOtpFn) {
      setOtpFn(otpVal);
    }
  };
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <OtpInput
      value={otp}
      onChange={handleOtpChange}
      containerStyle={{
        display: "-webkit-flex",
        display: "-ms-flexbox",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
      isInputNum={true}
      inputStyle={{
        height: "41px",
        width: "41px",
        background: "rgba(56, 63, 78, 0.5)",
        color: "#C6CAD2",
        fontWeight: 900,
        fontSize: "34px",
        boxShadow: "none",
        borderStyle: "hidden",
        borderBottom: "1px solid #FFFFFF3B",
        padding: 0,
      }}
      className="otp-component"
      data-testid="otp component"
      focusStyle={{
        color: "#B6AEF6",
        outline: "none",
      }}
      errorStyle={{
        boxShadow: "none",
        borderStyle: "hidden",
        maxWidth: "70%",
        color: "#EE463C",
        borderBottom: "1px solid #EE463C",
      }}
      shouldAutoFocus={autoFocus}
      hasErrored={hasErrored}
      numInputs={6}
      separator={<span style={{ width: "0" }}></span>}
    />
  );
}
