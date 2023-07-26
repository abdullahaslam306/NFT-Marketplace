import { makeStyles, createStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: "transparent",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    backdrop: {
      margin: "auto",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      backdropFilter: "blur(25px)",
      WebkitBackdropFilter: "blur(25px)",
    },
    title: {
      marginTop: "10px",
    },
    uploadPictureLabel: {
      fontSize: "16px",
      color: "#00e387",
      cursor: "pointer",
      marginTop: "1rem",
      display: "flex",
      justifyContent: "center",
      [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
      },
    },
    profileImageContainer: {
      display: "flex",
    },
    profileImage: {
      margin: "0 auto",
      // marginLeft: "-17%", //centers the image
      height: "100%",
      width: "12rem",
      display: "grid",
      placeItems: "center",
      clipPath: "circle()",
      [theme.breakpoints.down("sm")]: {
        width: "6rem",
        margin: "0 auto ",
      },
    },
  })
);
