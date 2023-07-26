import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Grid, Typography } from "@mui/material";
import { BorderLinearProgress } from "../BorderLinearProgress/BorderLinearProgress";
import {
  sixDigitCode,
  activate2fa,
  authUrAcc,
  signUp,
} from "../../utils/constants";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    margin: "0 0",
    maxWidth: "432px",
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: "center",
    color: "black",
    backgroundColor: "#FFF",
    height: "25px",
    width: "25px",
    background: "azure",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px 5px 0 0",
    padding: "1px",
  },
  activepaper: {
    // padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "#00e387",
    height: "25px",
    width: "25px",
    background: "azure",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1px",
  },
  greyedpaper: {
    // padding: theme.spacing(2),
    color: "#FFFFFF",
    textAlign: "center",
    backgroundColor: "#6D7481",
    height: "25px",
    width: "25px",
    background: "azure",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1px",
  },
  title: {
    top: "50px",
    margin: "16px 0px",
    fontStyle: "normal",
    fontWeight: 500,
    textAlign: "left",
    fontSize: "16px",
  },
  //   instructions: {
  //     marginTop: theme.spacing(1),
  //     marginBottom: theme.spacing(1),
  //   },
}));

function NumericIconComponent({ stepperStep }) {
  const steps = [1, 2, 3, 4];
  const activeStep = [1, 2, 3, 3, 4];
  const classes = useStyles();
  const ActiveStep = stepperStep;

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ pt: "19px" }}
    >
      {steps.map((i, index) => (
        <span
          key={index}
          className={
            activeStep[ActiveStep] === i
              ? classes.activepaper
              : i > ActiveStep
              ? classes.greyedpaper
              : classes.paper
          }
        >
          {i}
        </span>
      ))}
    </Grid>
  );
}

export default function StepperComponent() {
  const stepperClasses = useStyles();

  const root = useSelector((state) => state.commonReducer);
  const { stepperStep } = root;

  const progress = [1, 35, 65, 80, 100];
  const title = [signUp, authUrAcc, activate2fa, sixDigitCode, "Done"];
  return (
    <div className={stepperClasses.root} style={{ margin: "24px auto" }}>
      <Typography className={stepperClasses.title}>
        {title[stepperStep]}
      </Typography>
      <BorderLinearProgress
        variant="determinate"
        value={progress[stepperStep]}
      />
      <NumericIconComponent stepperStep={stepperStep} />
    </div>
  );
}
