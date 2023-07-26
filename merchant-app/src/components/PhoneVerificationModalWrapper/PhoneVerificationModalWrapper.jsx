import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { useRouter } from "next/router";
import { removehiphenSpaces } from "../../utils/helper";
import { actions } from "../../actions";
import BasicButton from "../Button/BasicButton";
import { getIso2CodeCountryList } from "../../utils/getISOcountryList";
import MFAverificationScreen from "../MFAverificationScreen/MFAverificationScreen";
import Image from "next/image";

let { getCountries } = actions.profileActions;
let { displaySnackbar, updateStepper } = actions.commonActions;

export const PhoneVerificationModalWrapper = () => {
  const [phone, setPhone] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.authReducer || {});
  const commonReducer = useSelector((state) => state.commonReducer || {});
  let loading = commonReducer.loading || false;
  function handleOnChange(value) {
    let reg = new RegExp(/^\+?\d*$/);
    const newStr = removehiphenSpaces(value.toString());
    if (!reg.test(newStr)) {
      dispatch(displaySnackbar("Invalid Phone number!", "error"));
    }
    setPhone(newStr);
  }

  const profile = useSelector((state) => state.profileReduer || {});
  const countries =
    profile && profile.countriesList && profile.countriesList.length
      ? profile.countriesList
      : [];

  const protectButtonClicked = () => {
    dispatch(actions.commonActions.setLoading(true));
    let token =
      (auth &&
        auth.cognitoUserForIntermediateAction &&
        auth.cognitoUserForIntermediateAction.signInUserSession &&
        auth.cognitoUserForIntermediateAction.signInUserSession.accessToken &&
        auth.cognitoUserForIntermediateAction.signInUserSession.accessToken
          .jwtToken) ||
      "";
    //dispatch(setPhoneNumber(phone));
    dispatch(actions.authActions.addPhoneNumber(phone, token));
  };

  useEffect(() => {
    dispatch(updateStepper(2));
    dispatch(getCountries());
    if (
      (auth.isPhoneVerified && phone) ||
      (!auth.isPhoneVerified && auth.phone)
    ) {
      dispatch(updateStepper(3));
    }
  }, []);

  if (auth.phone) {
    return <MFAverificationScreen phonenumber={phone} />;
  }

  return (
    <div>
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src="/images/Android.png"
            alt="important"
            width="96px"
            height="96px"
          />
        </div>
        <Typography variant="h4" sx={{ mb: "1.5rem", marginTop: "1.5rem" }}>
          Well done!{" "}
          <span color="secondary" style={{ color: "#7752e0" }}>
            Now help us protect your account
          </span>
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Your security is our priority! Please enter your phone number to
          activate two-factor authentication.
        </Typography>
        <Box sx={{ mb: "1.5rem", marginTop: "1.5rem" }}>
          <MuiPhoneNumber
            disableAreaCodes={true}
            onlyCountries={getIso2CodeCountryList(countries)}
            defaultCountry={"us"}
            autoFormat={true}
            variant="outlined"
            value={phone}
            onChange={handleOnChange}
            fullWidth
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: "16px" }}>
          <BasicButton
            color="primary"
            variant="contained"
            onClickHandler={protectButtonClicked}
            type={"submit"}
            disabled={phone ? false : true}
            title={"PROTECT MY ACCOUNT"}
            loading={loading}
            sx={{ width: "100%", margin: "0" }}
          />
        </Box>
      </>
    </div>
  );
};
