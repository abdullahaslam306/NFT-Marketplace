import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import HeaderComponent from "../components/Header/Header";
import SignInComponent from "../components/SignInComponent/SignInComponent";
import { actions } from "../actions";
import { getSavedUserSession } from "../services/localStorage";
import { useRouter } from "next/router";
import { Container, Box } from "@mui/material";

function Login() {
  const commonReducer = useSelector((state) => state.commonReducer || {});
  const authReducer = useSelector((state) => state.authReducer || {});
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (typeof window != "undefined") {
      dispatch(actions.authActions.setUserSession(getSavedUserSession()));
    }
  }, []);

  useEffect(() => {
    if (
      authReducer.isAuthenticated &&
      typeof window != "undefined" &&
      !authReducer.isAuthenticatedWithNewUser
    ) {
      router.push("/dashboard", undefined, { shallow: true });
    }
  }, [authReducer.isAuthenticated]);

  return (
    <Layout
      bgImg={
        commonReducer.themeState === "dark"
          ? "/images/BackgroundV2.jpg"
          : "/images/background-light.jpg"
      }
    >
      <HeaderComponent />
      <Container maxWidth="xs">
        <SignInComponent />
      </Container>
    </Layout>
  );
}

export default Login;
