import { createStyles, makeStyles } from "@mui/styles";

export const useProfileComponentStyle = makeStyles(() =>
  createStyles({
    greetings: {
      lineHeight: "36px",
      paddingBottom: "20px",
    },
    container: {
      width: "90%",
    },
    secondaryColor: {
      color: (theme) => theme.palette.secondary.main,
    },
    topRow: {
      marginTop: "20px",
      float: "left",
      width: "100%",
    },
    btnclr: {
      float: "right",
      margin: "0px",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    box: {
      background: "rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: "4px",
      width: "auto",
      height: "auto",
      [(theme) => theme.breakpoints.down("xs")]: {
        width: "auto",
        height: "358px",
      },
    },
  })
);
