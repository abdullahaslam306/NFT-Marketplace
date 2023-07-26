import { useTheme } from "@mui/styles";
import { Grid, useMediaQuery, Typography } from "@mui/material";

export default function NFTSales() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <Grid container sx={{ padding: matches ? "3rem" : "16px" }}>
        <Grid
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            justifyContent: "space-between",
          }}
          item
          xs={12}
          md={12}
        >
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 900,
              pb: "20px",
            }}
          >
            NFT Sales Planning
          </Typography>
        </Grid>
      </Grid>
      <Typography
        sx={{
          fontSize: "60px",
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.5)",
          mt: "100px",
        }}
      >
        Coming Soon..
      </Typography>
      <Typography
        sx={{
          textAlign: "left",
          color: "rgba(255, 255, 255, 0.5)",
          width: "60%",
          margin: "auto",
          fontSize: "16px",
          mb: "200px",
        }}
      >
        In the next release we will enable NFTs minted on BLOCommerce platform
        to be listed on leading marketplaces such as Opensea.
      </Typography>
    </>
  );
}
