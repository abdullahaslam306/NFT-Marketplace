import { makeStyles } from "@mui/styles";

export const useSendNFTStyles = makeStyles((theme) => {
  return {
    container: {
      paddingLeft: "50px",
      paddingRight: "50px",
      maxWidth: "550px",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: "20px",
        paddingRight: "20px",
      },
    },
    mailIcon: {
      height: "16px",
    },
    messageWalletAddress: {
      color: "#ebb440",
      marginLeft: "2px",
    },
    divider: {
      margin: "10px 0",
      [theme.breakpoints.down("sm")]: {
        margin: "7px 0",
      },
    },
    gasfeesWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sendNewCodeLink: {
      cursor: "pointer",
      color: "#B6AEF6",
      padding: 0,
    },
    mobileViewSendNFT: {
      margin: "0px 0 5px 0",
      fontWeight: "400",
      fontSize: "14px",
    },
  };
});
