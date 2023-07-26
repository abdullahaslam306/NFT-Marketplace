import React from "react";

import { useMediaQuery, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { ProtfolioContent } from "./PortfolioContent";

const tabs = [
  {
    index: 0,
    label: "Select Wallet",
  },
  {
    index: 1,
    label: "All Wallet",
  },
  {
    index: 2,
    label: "Blocomerce wallet",
  },
  {
    index: 3,
    label: "Metamask wallet #1",
  },
];

const PortfolioManagement = ({ heading }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <>
      <Grid
        container
        sx={{ padding: matches ? "3.28rem 3.28rem 3.28rem 3rem" : "16px" }}
      >
        <Grid item xs={12} md={12}>
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.75rem",
              pb: "20px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
              paddingBottom: "22px",
            }}
          >
            {heading ?? "NFT Portfolio Analysis"}
          </Typography>
        </Grid>
        <>
          <ProtfolioContent tabPanels={tabs} />
        </>
      </Grid>
    </>
  );
};

export default PortfolioManagement;
