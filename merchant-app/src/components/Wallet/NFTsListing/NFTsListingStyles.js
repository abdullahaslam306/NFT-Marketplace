import { createStyles, makeStyles } from "@mui/styles";

export const useSectionStyle = makeStyles((theme) =>
  createStyles({
    container: {
      width: "100%",
    },
    loading: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
    },
    imgStyle: {
      height: "320px",
      paddingLeft: "10px",
      paddingRight: "10px",
      width: "100%",
    },
    headerHover: {
      "& span": {
        "&:hover": {
          color: "#24D182",
          cursor: "pointer",
        },
      },
    },
    imgDiv: {
      display: "flex",
      paddingLeft: "15px",
      height: "40px",
      width: "95%",
      margin: "auto",
      paddingTop: "10px",
      background: "#FFFFFF17",
    },
    desktopGrid: {
      // maxWidth: "295px",
      padding: "16px 8px 0px 8px",
      [theme.breakpoints.down("sm")]: {
        padding: "4px",
      },
    },
    desktopChip: {
      borderRadius: 0,
      backgroundColor: "inherit",
      textTransform: "capitalize",
    },
    imgSize: {
      width: "100%",
      height: "100%",
      [theme.breakpoints.up("md")]: {
        width: "50%",
      },
      display: "block",
      margin: "auto",
    },
    mediaDiv: {
      cursor: "pointer",
      // height: "122px",
      // [theme.breakpoints.up("md")]: {
      //   height: "293px",
      // },
    },
    cardFooter: {
      padding: "16px 8px 16px 16px",
      [theme.breakpoints.down("sm")]: {
        padding: "8px !important",
      },
    },
  })
);

export const useNFTStyles = makeStyles((theme) =>
  createStyles({
    parent: {
      display: "flex",
    },
    container: {
      padding: 0,
    },
    column: {
      padding: "0 0px",
    },
    cardParent: {
      width: "20rem",
      cursor: "pointer",
      height: "12rem",
      transform: "translate(0%, -50%)",
      textAlign: "center",
      transition: "0.3s",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      borderRadius: "4px",
      "&:hover": {
        boxShadow: "10px 10px 37px 8px rgba(0,0,0,0.75)",
        backgroundColor: "#383F4E",
      },
    },
    addIcon: {
      transform: "scale(4.5)",
      marginTop: "3.5rem",
    },
    card: {
      backgroundColor: "#383F4E",
      borderRadius: "4px",
      margin: "auto",
      // height: "100%",
      textAlign: "center",
      // backgroundColor: "inherit",
      transition: "0.3s",
      justifyContent: "center",
      alignItems: "center",
      // "&:hover": {
      //   backgroundColor: "#383F4E",
      //   boxShadow: "10px 10px 37px 8px rgba(0,0,0,0.25)",
      // },
    },
    iconWrapper: {
      // padding: "30%",
      // paddingBottom: "14%",
      paddingTop: "15%",
      paddingBottom: "10%",
    },
    uploadFile: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginTop: "2.5rem",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    searchField: {
      width: "19rem",
      marginRight: "4rem",
    },
    loading: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
    },
    sortDropDown: {
      minWidth: "9rem",
      "& div label": {
        paddingLeft: "0.5rem",
      },
    },
    tabHeader: {
      display: "flex",
      // right: 10,
      justifyContent: "space-between",
      width: "80%",
      flexDirection: "row-reverse",
    },
    buttonsList: {
      display: "flex",
      // right: 10,
      // justifyContent: "",
      // width: "60%",
      flexDirection: "row-reverse",
    },
  })
);
