import { LinearProgress } from "@mui/material";
import { createStyles, withStyles } from "@mui/styles";

const ProgressBar = withStyles(() =>
  createStyles({
    root: {
      height: 4,
      borderRadius: 3,
    },
    bar: {
      borderRadius: 3,
      backgroundColor: "#12F1AE",
    },
  })
)(LinearProgress);

export default ProgressBar;
