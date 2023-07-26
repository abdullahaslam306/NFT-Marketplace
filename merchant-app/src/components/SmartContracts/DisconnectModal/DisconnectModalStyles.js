import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  secondaryColor: {
    color: theme.palette.secondary.main,
    [theme.breakpoints.down("xs")]: {},
  },
  buttonContainer: {
    borderRadius: "4px",
    margin: "30px 0px",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      margin: "10px 0px",
    },
  },
  container: {
    paddingLeft: "50px",
    paddingRight: "50px",
    maxWidth: "586px",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "20px",
      paddingRight: "20px",
    },
  },
  modalContainer: {
    border: "none",
    outline: "none",
  },
  buttonClass: {
    boxShadow:
      "box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24)",
  },
  disabledText: {
    fontSize: "14px",
    marginTop: "10px",
    marginBottom: "20px",
  },
  dollars: {
    fontWeight: 900,
    fontSize: "20px",
    color: "#FFF",
    width: "100%",
    float: "left",
    margin: 0,
    paddingBottom: "20px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  },
  title: {
    position: "static",
    width: "328px",
    height: "24px",
    left: "calc(50% - 328px/2)",
    top: "50px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "24px",
    letterSpacing: "0.15px",
    color: theme.palette.text.primary,
    flex: "none",
    order: 0,
    alignSelf: "stretch",
    flexGrow: 0,
    margin: "30px 0px",
    [theme.breakpoints.down("xs")]: {
      width: "auto",
    },
  },
  box: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    borderRadius: "4px",
    width: "auto",
    height: "auto",
    maxWidth: "586px",
    caretColor: "transparent",
    [theme.breakpoints.down("xs")]: {
      width: "586px",
      height: "358px",
    },
  },
  validationWrapper: {
    marginBottom: "38px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "30px",
    },
  },

  description: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "143%",
    letterSpacing: "0.25px",
    color: theme.palette.text.primary,
    flexGrow: 0,
    margin: "30px 0px",
  },
  label: {
    height: "56px",
    width: "100%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[0],
    padding: theme.spacing(2, 4, 3),
  },
  number: {
    color: "#00E387",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: "60px",
    float: "left",
    margin: "0",
  },
  secondaryText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "34px",
    fontWeight: 900,
    margin: "26px 10px 0",
    float: "left",
  },
  row: {
    display: "flex",
    maxWidth: "586px",
    alignItems: "center",
    padding: "5px 0px",
  },
  column1: {
    flex: "25%",
    fontSize: "12px",
    fontFamily: "Roboto",
    lineHeight: "18px",
    letterSpacing: "0.15px",
  },
  column2: {
    flex: "75%",
    fontSize: "12px",
    fontFamily: "Roboto",
    lineHeight: "18px",
    letterSpacing: "0.15px",
    caretColor: "transparent",
  },
  chip: {
    color: "#00E387",
    borderColor: "#00E387",
  },
  errorLabel: {
    color: `${theme.palette.error.main} !important`,
  },
}));
