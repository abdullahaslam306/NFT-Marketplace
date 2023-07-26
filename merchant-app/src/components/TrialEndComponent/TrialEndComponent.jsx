import { Button, Box, Grid, Typography } from "@mui/material";
import { makeStyles, useTheme, createStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    contBottom: {
      paddingTop: 0,
      margin: "200px 0px 30px 0px",
      background: "#383F4E",
      borderRadius: "4px",
      width: "100%",
      float: "left",
    },
    container: {
      paddingTop: 0,
      margin: "20px 0 0 120px",
      background: "#383F4E",
      borderRadius: "4px",
      width: "65%",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    leftCont: {
      width: "70%",
      float: "left",
      padding: "15px",
    },
    rightCont: {
      float: "right",
      padding: "15px",
    },
  })
);

const TrialEndComponent = ({ days = 1, isBottom = false }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Box
      style={{ height: "auto", width: "100%" }}
      className={isBottom ? classes.contBottom : classes.container}
    >
      <div style={{ background: "#383F4E" }} className={classes.leftCont}>
        <Typography style={{ color: "#FFA726", fontWeight: 700 }}>
          Your trial will end in {days} {days > 1 ? `days` : `day`}.
        </Typography>
        <Typography>
          Upgrade to a paid account and unlock more poweful tools to help you
          succeed!
        </Typography>
      </div>
      <div style={{}} className={classes.rightCont}>
        <Grid item>
          <Button variant="contained" color="primary" className="" href="">
            {"SELECT A PLAN"}
          </Button>
        </Grid>
      </div>
    </Box>
  );
};

export default TrialEndComponent;
