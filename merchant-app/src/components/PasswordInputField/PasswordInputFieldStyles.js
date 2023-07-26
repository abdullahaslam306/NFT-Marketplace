import { makeStyles, createStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    row: { display: "flex" },
    column: {
      flex: "50%",
      fontSize: "12px",
      fontFamily: "Roboto",
      lineHeight: "18px",
      letterSpacing: "0.15px",
    },
    inputLabel: {
      color: "#FFFFFFB2",
    },
  })
);

export const useOutlinedInputStyles = makeStyles((theme) => ({
  root: {
    "& $notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.7)",
    },
  },
  background: "transparent",

  notchedOutline: {},
}));
