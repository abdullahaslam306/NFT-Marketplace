import { createStyles, makeStyles } from "@mui/styles";

const useAssetsStyles = makeStyles(() =>
  createStyles({
    parent: {
      display: "flex",
    },
    container: {
      // paddingTop: "48px",
    },
    column: {
      padding: "0 10px",
    },
    uploadFileButtonMobile: {
      float: "right",
      marginRight: "0",
      marginTop: "0",
    },
    uploadFileButton: {
      float: "right",
      marginTop: "1.8rem",
      marginRight: "0",
    },
    card: {
      margin: "0 auto",
      textAlign: "center",
      backgroundColor: "#383F4E",
      transition: "0.3s",
      "&:hover": {
        boxShadow: "10px 10px 37px 8px rgba(0,0,0,0.75)",
      },
    },
    cardParent: {
      // display: 'block',
      // margin: 'auto',
      width: "25%",
      cursor: "pointer",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    addIcon: {
      transform: "scale(5.0)",
    },
    iconWrapper: {
      padding: "30%",
      paddingBottom: "14%",
    },
    uploadFile: {
      paddingBottom: "10%",
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    uploadFileButtonManage: {
      float: "right",
      marginTop: "0rem",
      marginRight: "1.5rem",
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.3s",
    },
    searchField: {
      width: "19rem",
      marginRight: "4rem",
    },
    sortDropDown: {
      minWidth: "9rem",
      "& div label": {
        paddingLeft: "0.5rem",
      },
    },
  })
);

export default useAssetsStyles;
