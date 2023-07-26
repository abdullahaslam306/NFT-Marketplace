import React from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Link,
  Container,
} from "@mui/material";
import {
  alreadyHaveMerchantAccount,
  signIn,
  emailAlreadyRegistered,
} from "../../utils/constants";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";

export default function UserAlreadyExistComponent({
  title = alreadyHaveMerchantAccount,
  buttonTxt = signIn,
  description = emailAlreadyRegistered,
  email = "exampleemail@abc.com",
  href = "/login/",
  notRegistered = false,
  accountBlocked = true,
  showButton = true,
  link = "/register",
  userDoesNotExists = false,
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: "24px 8px", md: "48px" },
        minWidth: { sm: "100%", md: "432px" },
        maxWidth: "432px",
      }}
      className="backgroundfirefoxAuth"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          src="/images/BoxImportant.png"
          alt="important"
          width="96px"
          height="96px"
        />
      </div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ mb: "1.5rem", marginTop: "1.5rem" }}>
          {title}
        </Typography>
        {userDoesNotExists ? (
          <Typography>
            Seems like <b>{email}</b> is not in our servers,{" "}
            <Link href={link}>try another email</Link> or hit the SIGN UP button
            to create a new account
          </Typography>
        ) : !notRegistered ? (
          <Typography>
            <b>{email}</b> {description}
          </Typography>
        ) : accountBlocked ? (
          <Typography>{description}</Typography>
        ) : (
          ""
        )}
        {showButton && (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="primary"
              href={href}
              sx={{ w: "100%" }}
            >
              {buttonTxt}
            </Button>
          </Grid>
        )}
      </Box>
    </Paper>
  );
}
