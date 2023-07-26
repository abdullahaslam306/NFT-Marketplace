import { createStyles, makeStyles } from "@mui/styles";
const PreviewNFTStyle = makeStyles((theme) => {
  return createStyles({
    imageWrapper: {
      cursor: "pointer",
      width: "100%",
      height: "425px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255, 255, 255, 0.09)",
      border: "1px solid inherit",
      marginBottom: 0,
      [theme.breakpoints?.down("sm")]: {
        marginBottom: "24px",
        height: "300px",
      },
      [theme.breakpoints?.between("sm", "md")]: {
        height: "350px",
      },
      [theme.breakpoints?.between("md", "lg")]: {
        height: "390px",
      },
      // [theme.breakpoints.up("md")]: {
      //   height: "320px",
      // },
      // [theme.breakpoints.up("lg")]: {
      //   height: "400px",
      // },
      // [theme.breakpoints.up("xl")]: {
      //   height: "500px",
      // },
    },

    noImage: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
    },
    titleSection: {
      fontWeight: "500",
      fontFamily: "inherit",
      fontSize: "0.9rem",
      letterspacing: "0.15px",
      margin: "0 0 5px 0",
      [theme.breakpoints?.down("sm")]: {
        margin: "0 0 8px 0",
      },
      color: "#ffffff",
      "& span": {
        color: "#B6AEF6",
      },
    },
    limitedEdition: {
      fontWeight: "900",
      fontSize: "1.5rem",
      letterspacing: "0.15px",
      fontFamily: "inherit",
      margin: "0 0 5px 0",
      [theme.breakpoints?.down("sm")]: {
        margin: "0 0 8px 0",
      },
      color: "#ffffff",
    },
    description: {
      fontWeight: "300",
      fontSize: "1.1rem",
      letterspacing: "0.15px",
      fontFamily: "inherit",
      margin: 0,
      padding: "15px",
      "& p": {
        fontSize: "16px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 200,
      },
      "& h1": {
        margin: 0,
        padding: 0,
        fontSize: "80px",
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h2": {
        fontSize: "60px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h3": {
        fontSize: "38px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h4": {
        fontSize: "28px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h5": {
        fontSize: "24px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h6": {
        fontSize: "20px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& ul": {
        margin: 0,
      },
    },
    creatorSection: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& p": {
        fontWeight: "500",
        fontSize: "0.9rem",
        letterspacing: "0.15px",
        color: "#FFFFFF",
        fontFamily: "inherit",
      },
      "& div": {
        "& p": {
          flexDirection: "column",
          fontWeight: "500",
          fontSize: "0.9rem",
          color: "#B6AEF6;",
        },
      },
    },
    tagsSection: {
      display: "flex",
      marginRight: "10px",
      marginTop:'5px',
      "& p": {
        margin: "0 0 12px 0",
      },
      "& div": {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        "& h4": {
          margin: "0 10px 0 0",
          fontSize: "0.8rem",
          fontWeight: "500",
          color: "#B6AEF6",
          textTransform: "capitalize",
        },
      },
    },
  });
});

const propertiesStyle = makeStyles((theme) =>
  createStyles({
    cardWrapper: {
      display: "flex",
      padding: "5px",
      flexDirection: "column",
      border: "1.5px solid #383f4e",
      justifyContent: "center",
      margin: "15px 0px 0px 15px",
      alignItems: "center",
      flex: "0 1 15%",
      "& p": {
        fontWeight: " 400",
        fontSize: "0.8rem",
        lineHeight: " 18px",
        letterSpacing: " 0.16px",
        color: " #B6AEF6",
        margin: "0px",
      },
      "& h4": {
        fontWeight: " 400",
        fontSize: "1rem",
        letterSpacing: " 0.16px",
        color: " #fff",
        margin: "0px",
      },
    },
    sectionWrapper: {
      display: "flex",
      padding: "5px",
      flexDirection: "column",
      border: "1.5px solid #383f4e",
      justifyContent: "center",
      alignItems: "center",
      "& p": {
        fontWeight: " 200",
        fontSize: "1rem",
        lineHeight: "31px",
        letterSpacing: " 0.16px",
        color: " #ffffff",
        margin: "0px",
        lineBreak: "anywhere",
      },
      "& h4": {
        fontWeight: " 400",
        fontSize: "1.5rem",
        letterSpacing: " 0.16px",
        color: " #fff",
        margin: "0px",
      },
    },
    addSectionDefault: {
      "& p": {
        fontSize: "16px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 200,
      },
      "& h1": {
        margin: 0,
        padding: 0,
        fontSize: "80px",
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h2": {
        fontSize: "60px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h3": {
        fontSize: "38px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h4": {
        fontSize: "28px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h5": {
        fontSize: "24px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& h6": {
        fontSize: "20px",
        margin: 0,
        padding: 0,
        fontFamily: `Roboto`,
        fontWeight: 400,
      },
      "& ul": {
        margin: 0,
      },
    },
  })
);

export { PreviewNFTStyle, propertiesStyle };
