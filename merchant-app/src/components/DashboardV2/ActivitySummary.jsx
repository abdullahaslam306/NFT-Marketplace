import React from "react";

import { useTheme } from "@mui/material/styles";

import dashBoardStyle from "./DashBoardStyle";

import TransactionsGraph from "./Graph/Transactions";
import SpendingsGraph from "./Graph/Spendings";
import EarningsGraph from "./Graph/Earnings";

const ActivitySummary = () => {
  const theme = useTheme();
  const classes = dashBoardStyle(theme);
  return (
    <div className={classes.ActivitySummaryContainer}>
      <div className={classes.ActivitySummaryWrapper}>
        <div
          className={classes.AccountSummaryHeading}
          // style={{ padding: "1.5rem 0 0 2rem" }}
        >
          NFT Activity Summary{" "}
          <span className={classes.AccountSummarysubTitle}>
            (last 12 months)
          </span>
        </div>
        <TransactionsGraph />
        <div
          style={{
            float: "left",
            width: "100%",
            marginTop: "0.5rem",
          }}
        >
          <SpendingsGraph />
          <EarningsGraph />
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;
