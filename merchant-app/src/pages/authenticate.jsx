import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { LoadingIndicator } from "../components/LoadingIndicator/LoadingIndicator";
import StepperComponent from "../components/StepperComponent/StepperComponent";
import SignInComponent from "../components/SignInComponent/SignInComponent";
import FooterComponent from "../components/Footer/Footer";
import HeaderComponent from "../components/Header/Header";
import LinkInvalidComponent from "../components/LinkInvalidComponent/LinkInvalidComponent";

import { Container, Box } from "@mui/material";
import { actions } from "../actions";
let { authActions } = actions;

function Authenticate() {
  const dispatch = useDispatch();
  const commonReducer = useSelector(
    (state) => (state && state.commonReducer) || {}
  );
  const loading = commonReducer.loading;
  const auth = useSelector((state) => (state && state.authReducer) || {});
  const isEmailVerified = auth.isEmailVerified || false;
  const isEmailVerificationLoading = auth.isEmailVerificationLoading || false;
  const [showElement, setShowElement] = React.useState(false)
  //const { query } = useRouter();
  const router = useRouter();

  const validateEmail = (email, code) => {
    dispatch(authActions.confirmSignUp(email, code));
  };
  let query;
  if (typeof window != "undefined") {
    query = new URLSearchParams(window.location.search);
  }
  let email = query && query.get("email");
  let confirmation_code = query && query.get("confirmation_code");

  useEffect(() => {
    if (typeof window != "undefined" && email && confirmation_code) {
      dispatch(actions.commonActions.setLoading(true));
      dispatch(actions.authActions.setEmailVerificationLoading(true));
      validateEmail(email, confirmation_code);
    }
  }, []);

  useEffect(()=>{
    setTimeout(function() {
      setShowElement(true)
         }, 4000);
       },
   [])

  if (isEmailVerified && typeof window != "undefined") {
    router.push("/login", { email: email, resp: true });
  }

  return (
    <div>
      <Layout
        bgImg={
          commonReducer.themeState === "dark"
            ? "/images/BackgroundV2.jpg"
            : "/images/background-light.jpg"
        }
      >
        <HeaderComponent />

        {loading && isEmailVerificationLoading ? (
          <LoadingIndicator
            isModal={true}
            title={"Activating your account.."}
          />
        ) : showElement && !isEmailVerified ? (
          <Container>
            <Box>
              <StepperComponent />
            </Box>
            <LinkInvalidComponent email={email} />
          </Container>
          
        ) : (
          <Container>
            <SignInComponent
              email={email}
              resp={isEmailVerified}
              resetPwd={false}
              setValues={""}
            />
          </Container>
        )}
      </Layout>
    </div>
  );
}

export default Authenticate;
