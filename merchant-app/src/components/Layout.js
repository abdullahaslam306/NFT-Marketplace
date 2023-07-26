import React from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../themes/darkTheme";
import { lightTheme } from "../themes/lightTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { SEO } from "./SEO";
import { Container } from "@mui/material";
import PositionedSnackbar from "./Snackbar/Snackbar";

const darkModeTheme = createTheme(darkTheme);
const lightModeTheme = createTheme(lightTheme);

function Layout({ bgImg = "", children }) {
  const commonReducer = useSelector((state) => state.commonReducer || {});

  return (
    <ThemeProvider
      theme={
        commonReducer.themeState === "dark" ? darkModeTheme : lightModeTheme
      }
    >
      <CssBaseline />
      <Container
        sx={{
          width: "100%",
          minHeight: "100vh",
          float: "left",
          backgroundSize: "cover",
          p: "0!important",
        }}
        style={{
          filter: commonReducer.modal ? "blur(20px)" : "none",
          backgroundImage: bgImg ? `url(${bgImg})` : "",
          backgroundRepeat: "no-repeat, repeat",
          backgroundSize: "100% 100%",
        }}
      >
        <SEO />
        {children}
        {commonReducer.isSnackBarOpen && (
          <PositionedSnackbar
            message={commonReducer.snackbarMessage}
            type={commonReducer.snackBarType}
            button={commonReducer.snackBarButton}
            isOpen={true}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Layout;
