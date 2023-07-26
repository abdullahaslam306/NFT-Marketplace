import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    marginTop: (theme) => theme.spacing(4.1),
    [(theme) => theme.breakpoints.only("md")]: {
      width: "60%",
    },
    [(theme) => theme.breakpoints.down("sm")]: {
      width: "75%",
    },
    [(theme) => theme.breakpoints.down("xs")]: {
      width: "75%",
      paddingLeft: "2px",
      marginTop: (theme) => theme.spacing(3.1),
    },
    background: "transparent",
    zIndex: 1000,
    "& .MuiAppBar-colorDefault": {
      backgroundColor: "transparent !important",
      boxShadow: "none",
    },
    "& .Mui-selected": {
      borderBottom: `3px solid ${(theme) => theme.palette.primary.dark}`,
    },
    "& .MuiTabScrollButton-root": {
      color: (theme) => theme.palette.text.primary,
      [(theme) => theme.breakpoints.down("xs")]: {
        display: "auto",
      },
    },
    "& .MuiBox-root": {
      [(theme) => theme.breakpoints.down("xs")]: {
        padding: "0 !important",
      },
    },
  },
  labels: {
    textTransform: "uppercase",
    fontSize: "14px",
    fontWeight: "400",
    letterSpacing: "0.15px",
  },
  container: {},
}));
