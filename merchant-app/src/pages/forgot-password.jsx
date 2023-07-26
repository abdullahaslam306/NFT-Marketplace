import React from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import HeaderComponent from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ForgotPwdComponent from "../components/ForgotPwdComponent/ForgotPwdComponent";
import { Container, Box } from "@mui/material";

function ForgotPassword() {
  const commonReducer = useSelector((state) => state.commonReducer || {});

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
        <ForgotPwdComponent />
      </Container>
      <Footer />
    </Layout>
  );
}

export default ForgotPassword;
