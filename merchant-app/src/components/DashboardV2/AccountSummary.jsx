import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import dashBoardStyle from "./DashBoardStyle";

import { getNFTStats } from "src/services/nftServices";
import CircularProgress from "@mui/material/CircularProgress";

const AccountSummary = () => {
  const theme = useTheme();
  const classes = dashBoardStyle(theme);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setLoading(true);
    getNFTStats()
      .then((res) => {
        setLoading(false);
        setStats(res.attributes);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={classes.AccountSummaryContainer}>
      <div className={classes.AccountSummaryWrapper}>
        <div className={classes.AccountSummaryHeading}>Account Summary</div>
        <div
          className={classes.AccountSummaryCardWrapper}
          style={{ flexDirection: isMobile ? "column" : "row" }}
        >
          <div className={classes.AccountSummaryCard}>
            <div className={classes.AccountSummaryCardHead}>
              Total Connected wallets
            </div>
            <div className={classes.AccountSummaryCardData}>
              {loading ? (
                <CircularProgress
                  color="inherit"
                  style={{
                    width: " 20px",
                    height: " 20px",
                    color: " rgba(255, 255, 255, 0.56)",
                  }}
                />
              ) : (
                stats?.totalWallets
              )}
            </div>
          </div>
          <div className={classes.AccountSummaryCard}>
            <div className={classes.AccountSummaryCardHead}>
              Total supported smart-contractS{" "}
            </div>
            <div className={classes.AccountSummaryCardData}>
              {loading ? (
                <CircularProgress
                  color="inherit"
                  style={{
                    width: " 20px",
                    height: " 20px",
                    color: " rgba(255, 255, 255, 0.56)",
                  }}
                />
              ) : (
                stats?.totalContracts
              )}
            </div>
          </div>
          <div className={classes.AccountSummaryCard}>
            <div className={classes.AccountSummaryCardHead}>
              Total number of NFTs OWNED{" "}
            </div>
            <div className={classes.AccountSummaryCardData}>
              {loading ? (
                <CircularProgress
                  color="inherit"
                  style={{
                    width: " 20px",
                    height: " 20px",
                    color: " rgba(255, 255, 255, 0.56)",
                  }}
                />
              ) : (
                stats?.nftOwned
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
