import React from "react";
//import Image from "next/image";
import { useSelector } from "react-redux";

// MUI IMPORTS
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  PrivacyPolicy_URL,
  TermsandConditions_URL,
} from "../../utils/constants";

export default function FooterComponent() {
  const authReducer = useSelector((state) => state.authReducer || {});
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const useStyles = makeStyles({
    "@media (min-width:768px)": {
      footerLinks: {
        borderRight: "none",
        "&::after": {
          content: '""',
          height: 12,
          borderRight: "1px solid",
          position: "absolute",
          top: 5,
          paddingRight: 14,
        },
      },
    },
  });
  const classes = useStyles();
  let path = !authReducer.isAuthenticated;

  return (
    <>
      {path ? (
        <></>
      ) : (
        <Box
          sx={
            matches
              ? {
                  py: 3,
                  px: 2,
                  width: "100%",
                  float: "left",
                  mt: "20px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.23)",
                }
              : {
                  mt: "20px",
                  padding: 0,
                  width: "100%",
                  float: "left",
                  borderTop: "1px solid rgba(255, 255, 255, 0.23)",
                }
          }
        >
          <Container
            maxWidth="sm"
            align="center"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              position: "relative",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Typography
              className={classes.footerLinks}
              sx={matches ? { px: 2, fontSize: 14 } : { width: "100%" }}
            >
              © 2022 BLOCommerce
            </Typography>
            <Link
              target="_blank"
              href={PrivacyPolicy_URL}
              className={classes.footerLinks}
              underline="none"
              color="text.primary"
              sx={
                matches ? { px: 2, fontSize: 14 } : { padding: "5px 10px 0 0" }
              }
            >
              Privacy Policy
            </Link>
            <Link
              target="_blank"
              href={TermsandConditions_URL}
              underline="none"
              color="text.primary"
              className={classes.footerLinks}
              sx={
                matches ? { px: 2, fontSize: 14 } : { padding: "5px 10px 0 0" }
              }
            >
              Terms of Service
            </Link>
            <Link
              href="mailto:hello@blocommerce.com"
              underline="none"
              color="primary"
              sx={
                matches ? { px: 2, fontSize: 14 } : { padding: "5px 10px 0 0" }
              }
            >
              Contact us
            </Link>
          </Container>
        </Box>
      )}
    </>
  );
}
