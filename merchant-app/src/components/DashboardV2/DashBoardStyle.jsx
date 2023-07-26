import { createStyles, makeStyles } from "@mui/styles";

const dashBoardStyle = makeStyles((theme) =>
  createStyles({
    greetings: {
      fontWeight: 900,
      fontSize: "28px",
      lineHeight: "36px",
      paddingBottom: "8px",
    },
    AccountSummaryContainer: {
      background: "#393F4E",
      borderRadius: "4px",
    },
    AccountSummarysubTitle: {
      fontWeight: "300",
      fontSize: "12px",
      [theme.breakpoints.down("sm")]: {
        display: "block",
        fontSize: "14px",
      },
    },
    ActivitySummaryWrapper: {
      // minHeight: "17rem",
      padding: "1rem",
      overflow: "hidden",
    },
    ActivitySummaryContainer: {
      marginTop: "1.5rem",
      background: "#393F4E",
      borderRadius: "4px",
    },

    AccountSummaryWrapper: {
      padding: "1rem",
    },
    AccountSummaryCard: {
      background: "#404859",
      textAlign: "center",
      padding: "1rem",
      borderRadius: "4px",
    },
    AccountSummaryCardHead: {
      fontSize: "12px",
      lineHeight: "160%",
      textAlign: "center",
      letterSpacing: "1px",
      textTransform: "uppercase",
      color: "rgba(255, 255, 255, 0.5)",
    },
    AccountSummaryCardData: {
      fontWeight: "900",
      fontSize: "28px",
      lineHeight: "123.5%",
    },
    AccountSummaryCardWrapper: {
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
    },
    AccountSummaryHeading: {
      fontWeight: "900",
      fontSize: "20px",
      paddingBottom: "1rem",
      lineHeight: "160%",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
    },
    secondaryColor: {
      color: "#732DFA",
    },
    secondaryText: {
      paddingBottom: "24px",
    },
    secondaryColorLight: {
      color: "#9A8CF2",
    },
    completedBar: {
      background: "#00E387",
      float: "left",
      width: "10%",
      height: "100%",
    },
    progressBar: {
      float: "left",
      background: " #383F4E;",
      height: "100%",
      width: "90%",
    },
    progressContainer: {
      width: "100%",
      height: "4px",
      marginTop: "15px",
      display: "flex",
      textAlign: "center",
      alignItems: "center",
      paddingBottom: "15px",
    },
    dashBoardCard: {
      display: "flex",
      caretColor: "transparent",
      flex: "1 1 auto",
      cursor: "pointer",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0px 20px",
      margin: "5px",
      height: "180px",
      backgroundColor: "#383F4E !important",
      textAlign: "center",
      color: "rgba(255, 255, 255, 0.12) !important",
      boxShadow:
        "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)",
      borderRadius: "4px",
      "& .detail": {
        opacity: 0,
        visibility: "hidden",
        height: 0,
        color: (theme) => theme.palette.text.white,
        transform: "translateY(-50%)",
        transition: "1s",
      },
      "& .title": {
        color: (theme) => theme.palette.text.white,
        padding: "5px",
      },
      "& .icons": {
        height: "50px",
        width: "50px",
      },
      "&:hover": {
        background: "#7752E0 !important",
        "&:hover .detail": {
          opacity: 1,
          height: "auto",
          visibility: "visible",
          transform: "translateY(25%)",
          fontSize: "14px",
        },
        "&:hover .icons": {
          height: "50px",
          width: "50px",
          color: (theme) => theme.palette.text.primary,
        },
      },
    },
    dashBoardCardCompleted: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0px 20px",
      margin: "5px",
      height: "180px",
      backgroundColor: "#383F4E !important",
      textAlign: "center",
      color: "#00E387 !important",
      boxShadow:
        "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)",
      borderRadius: "4px",
      "& .detail": {
        display: "none",
      },
      "& .icons": {
        height: "50px",
        width: "50px",
      },
      "&:hover": {
        "&:hover .detail": {
          display: "block",
          fontSize: "14px",
        },
      },
    },
    root: {
      width: "100%",
    },
    heading: {
      fontSize: (theme) => theme.typography.pxToRem(16),
      flexShrink: 0,
    },
    dashboardAccordion: {
      alignItems: "flex-start",
      borderRadius: "4px 4px 0px 0px",
      alignSelf: "stretch",
      backgroundColor: "#383F4E !important",
      color: "rgba(255, 255, 255, 0.12) !important",
      boxShadow:
        "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)",
      "& .detail": {
        color: (theme) => theme.palette.text.white,
      },
      "& .title": {
        color: (theme) => theme.palette.text.white,
        paddingLeft: "15px",
      },
      "& .completed": {
        color: "#00E387",
        paddingLeft: "15px",
      },
      "& .mainDetail": {
        padding: "16px",
        display: "block",
        background:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), #7752E0",
      },
      "& .icons": {
        height: "30px",
        width: "30px",
      },
      "& .Mui-expanded .icons": {
        height: "30px",
        width: "30px",
        color: (theme) => theme.palette.text.primary,
      },
      "& .mainAction": {
        justifyContent: "center",
      },
      "& .completedExpandIcon": {
        opacity: "0.38",
        color: (theme) => theme.palette.text.white,
      },
      "& .expandIcon": {
        color: (theme) => theme.palette.text.white,
      },
      "& .Mui-expanded": {
        background:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), #7752E0",
      },
    },
    dashBoardAccordianSummary: {
      opacity: "unset !important",
      "& .MuiAccordionSummary-content": {
        alignItems: "center",
      },
    },
    buttonClass: {
      boxShadow:
        "box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24)",
    },
  })
);

export default dashBoardStyle;
