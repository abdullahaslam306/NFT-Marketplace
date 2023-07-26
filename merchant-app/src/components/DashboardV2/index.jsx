import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Typography, useMediaQuery, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AccountSummary from "./AccountSummary";
import ActivitySummary from "./ActivitySummary";

import dashBoardStyle from "./DashBoardStyle";
import ConfigureJourney from "./ConfigureJourney";
import { actions } from "../../actions";

export default function Dashboard() {
  const theme = useTheme();
  const dashBoardClasses = dashBoardStyle(theme);
  let matches = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.profileActions.getUserProfile());
  }, []);

  return (
    <div
      className={dashBoardClasses.container}
      style={{ padding: matches ? "3rem" : "16px" }}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          sx={{ padding: "12px" }}
        >
          <Typography variant="h4" className={dashBoardClasses.greetings}>
            <span className={dashBoardClasses.secondaryColor}> Welcome</span> to
            BLOCommerce!
          </Typography>
          <Typography className={dashBoardClasses.secondaryText}>
            Here’s what’s happening with your account.
          </Typography>
          <AccountSummary />

          <ActivitySummary />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={4}
          lg={4}
          xl={4}
          sx={{ padding: "12px" }}
        >
          <ConfigureJourney />
        </Grid>
      </Grid>
    </div>
  );
}
