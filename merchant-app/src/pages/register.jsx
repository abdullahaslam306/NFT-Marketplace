import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import HeaderComponent from "../components/Header/Header";
import StepperComponent from "../components/StepperComponent/StepperComponent";
import SignUpComponent from "../components/SignUpComponent/SignUpComponent";
import CheckEmailComponent from "../components/CheckEmailComponent/CheckEmailComponent";
import UserAlreadyExistComponent from "../components/UserAlreadyExistComponent/UserAlreadyExistComponent";
import { Container, Box } from "@mui/material";
import { LoadingIndicator } from "../components/LoadingIndicator/LoadingIndicator";
import SignupTag from "src/components/signupTag";
import { getSavedUserSession } from "../services/localStorage";
import { useRouter } from "next/router";
import { actions } from "../actions";

function Register() {
  const commonReducer = useSelector(
    (state) => (state && state.commonReducer) || {}
  );
  const loading = commonReducer.loading;
  const auth = useSelector((state) => state.authReducer || {});
  const router = useRouter();
  const [formSubmitted, setFormsubmitted] = useState(false);
  const [email, setemail] = useState("");
  const handleformSubmitted = (data) => {
    setFormsubmitted(data);
  };

  const handleEmail = (email) => {
    setemail(email);
  };

  let emailExists = auth.isEmailAlreadyExists;
  let isMerchant = auth.isMerchant;
  let isCustomer = false;
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window != "undefined") {
      dispatch(actions.authActions.setUserSession(getSavedUserSession()));
    }
  }, []);

  useEffect(() => {
    if (
      auth.isAuthenticated &&
      typeof window != "undefined" &&
      !auth.isAuthenticatedWithNewUser
    ) {
      router.push("/dashboard", undefined, { shallow: true });
    }
  }, [auth.isAuthenticated, auth.isAuthenticatedWithNewUser, router]);

  return (
    <Layout
      bgImg={
        commonReducer.themeState === "dark"
          ? "/images/BackgroundV2.jpg"
          : "/images/background-light.jpg"
      }
    >
      <>
        <HeaderComponent />
        {loading && (
          <LoadingIndicator isModal={true} title={"Creating your account..."} />
        )}
        {(auth.signUpResponse && !emailExists) || auth.showCheckEmail ? (
          <>
            <SignupTag auth={auth} />
            <Container maxWidth="xs">
              <StepperComponent />
              <CheckEmailComponent email={email} />
            </Container>
          </>
        ) : !formSubmitted ? (
          <Container maxWidth="xs">
            <StepperComponent />
            <SignUpComponent
              handleformSubmitted={handleformSubmitted}
              handleEmail={handleEmail}
            />
          </Container>
        ) : emailExists && isMerchant ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <UserAlreadyExistComponent email={email} />
          </Box>
        ) : emailExists && isCustomer ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <UserAlreadyExistComponent />
          </Box>
        ) : (
          ""
        )}
      </>
    </Layout>
  );
}

export default Register;
