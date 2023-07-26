import { LinearProgress } from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";

export const BorderLinearProgress = withStyles(() =>
  createStyles({
    root: {
      height: 4,
      borderRadius: 3,
    },
    bar: {
      borderRadius: 3,
    },
  })
)(LinearProgress);
