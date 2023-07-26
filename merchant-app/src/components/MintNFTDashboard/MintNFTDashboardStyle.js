import { createStyles, makeStyles } from "@mui/styles";

const commonEditorPencil = () => ({
  position: "relative",

  "&:hover": {
    border: "3px solid #5244ab",
    cursor: "pointer",
  },
  "&:hover $editPencil": {
    display: "block",
    position: "absolute",
    top: "-22px",
    right: "-3px",
    border: "2px solid #5244ab",
    backgroundColor: "#5244ab",
  },
  "&:focus": {
    border: "3px solid #5244ab",
    cursor: "pointer",
  },
  "&:focus $editPencil": {
    display: "block",
    position: "absolute",
    top: "-22px",
    right: "-3px",
    border: "2px solid #5244ab",
    backgroundColor: "#5244ab",
  },
});

const mintnftDashboardStyles = makeStyles((theme) =>
  createStyles({
    totalEdition: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "16px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      marginBottom: "10px",
      ...commonEditorPencil(),
    },
    expandText: {
      whiteSpace: "normal",
      marginTop: "-20px",
      paddingLeft: "16px",
      width: "85%",
    },
    clicked: {
      border: "3px solid #5244ab",
      cursor: "pointer",
      $editPencil: {
        display: "block",
        position: "absolute",
        top: "-22px",
        right: "-3px",
        border: "2px solid #5244ab",
        backgroundColor: "#5244ab",
      },
    },
    limitedEdition: {
      fontFamily: "Roboto",
      fontWeight: "900",
      fontSize: "24px",
      letterSpacing: "0.25px",
      color: "#FFFFFF",
      marginBottom: "10px",
      ...commonEditorPencil(),
    },
    totalEditionEdit: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "16px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      marginBottom: "10px",
    },
    limitedEditionEdit: {
      fontFamily: "Roboto",
      fontWeight: "900",
      fontSize: "20px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      marginBottom: "10px",
    },
    creatorContainer: {
      display: "flex",
      marginBottom: "10px",

      ...commonEditorPencil(),
    },

    profileImage: {
      width: "100px",
      height: "100px",
      objectFit: "contain",
      borderRadius: "50px",
    },
    creatorContainerEdit: {
      display: "flex",
      marginBottom: "10px",
    },
    creator: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "14px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      marginBottom: "10px",
      margin: 0,
      padding: 0,
    },
    creatorValue: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "14px",
      letterSpacing: "0.15px",
      color: "#00E387",
      marginBottom: "10px",

      "& p": {
        margin: 0,
        padding: 0,
      },
    },
    tagsValue: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "13px",
      lineHeight: "18px",
      letterSpacing: "0.16px",
      color: "#00E387",
      borderRadius: "50px",
      border: "1px solid #00E387",
    },
    thumbnail: {
      display: "grid",
      placeItems: "center",
      height: "100%",
      maxHeight: "27rem",
      maxWidth: "30rem",
      objectFit: "contain",
      margin: "auto",
    },
    imageSection: {
      border: "3px solid #252b37",
      background: "rgba(255, 255, 255, 0.12)",
      borderRadius: "4px",
      height: "27rem",
      width: "100%",
      "&:hover": {
        border: "3px solid #5244ab",
      },
      "&:hover :first-child": {
        display: "block",
        position: "absolute",
        top: "-10px",
        right: 0,
        border: "2px solid #5244ab",
        backgroundColor: "#5244ab",
      },
    },
    imageSectionEdit: {
      padding: "50px",
      background: "rgba(255, 255, 255, 0.12)",
      borderRadius: "4px",
    },
    editPencil: {
      display: "none",
    },
    galleryImage: {
      marginTop: "25px",
      marginBottom: "25px",
      ...commonEditorPencil(),
    },
    galleryImageEdit: {
      marginTop: "25px",
      marginBottom: "25px",
    },
    propertiesTopSection: {
      background: "#4A505E",
    },
    propertiesHeading: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "16px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      margin: 0,
      padding: 0,
    },
    propertiesHeadingValue: {
      fontfamily: "Roboto",
      fontWeight: "400",
      fontSize: "14px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
    },
    propertiesbottomSection: {
      padding: "16px 12px",
      background: "rgba(41, 46, 58, 0.51);",
    },
    propertiesValue: {
      border: "1px solid #393e49",
      display: "inline-block",
      padding: "7px",
      marginRight: "10px",
      marginBottom: "10px",
    },
    propertiesMediaType: {
      fontfamily: "Roboto",
      fontWeight: "400",
      fontSize: "13px",
      letterSpacing: "0.15px",
      color: "#B6AEF6",
      margin: 0,
      padding: 0,
    },
    propertiesMediaValue: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "16px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      margin: 0,
      padding: 0,
    },
    lockedWrapper: {
      border: "3px solid #252b37",
      ...commonEditorPencil(),
    },
    propertiesContainer: {
      border: "3px solid #252b37",
      ...commonEditorPencil(),
    },
    lockedWrapperEdit: {},
    propertiesContainerEdit: {},
    lockedTopSection: {
      padding: "16px 12px",
      background: "rgba(255, 255, 255, 0.09)",
    },
    lockedHeading: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "16px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      margin: 0,
      padding: 0,
    },
    lockedHeadingValue: {
      fontFamily: "Roboto",
      fontWeight: "400",
      fontSize: "14px",
      letterSpacing: "0.15px",
      color: "rgba(255, 255, 255, 0.7);",
    },
    lockedbottomSection: {
      padding: "20px",
      background: "rgba(41, 46, 58, 0.51)",
      fontFamily: "Roboto",
      fontWeight: "300",
      fontSize: "18px",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      "& h5": {
        margin: 0,
        padding: 0,
      },
      "& p": {
        margin: 0,
        padding: 0,
      },
    },
    titleGrow: {
      fontFamily: "Roboto",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      marginBottom: "30px",
      border: "3px solid #252b37",
      ...commonEditorPencil(),

      "& p": {
        fontWeight: "400",
        fontSize: "12px",
        margin: 0,
        padding: 0,
      },
      "& h5": {
        fontSize: "24px",
        fontWeight: "bold",
        margin: 0,
        padding: 0,
      },
    },
    titleGrowEdit: {
      fontFamily: "Roboto",
      letterSpacing: "0.15px",
      color: "#FFFFFF",
      marginBottom: "30px",

      "& p": {
        fontFamily: "Roboto",
        fontWeight: "400",
        fontSize: "12px",
        margin: 0,
        padding: 0,
      },
      "& h5": {
        fontFamily: "Roboto",
        fontSize: "24px",
        fontWeight: "bold",
        margin: 0,
        padding: 0,
      },
    },

    addSection: {
      width: "100%",
      height: "198px",
      border: "4px dashed #4a505e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "10px",
      cursor: "pointer",
      "& div": {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      },
    },
    alignItemCenter: {
      padding: "6px 0px",
      background: "rgba(255, 255, 255, 0.09)",
      display: "flex",
      justifyContent: "center",
    },
    alignItemCenterColorless: {
      padding: "60px 0px",
      display: "flex",
      justifyContent: "center",
    },
    selected: {
      backgroundColor: "transparent",
      color: "#19D5C6",
    },
    tableHeader: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      letterSpacing: "0.4px",
      color: "#FFFFFF",
    },
    blockchain: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      letterSpacing: "0.15px",
      // color: '#FFFFFF 50%'
      color: "rgba(255, 255, 255, 0.7);",
    },
    labels: {
      textTransform: "none",
      fontSize: "18px",
      fontFamily: "Roboto",
      fontWeight: 400,
      color: "#fff",
    },
    tableRow1: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      letterSpacing: "0.4px",
      color: "#00E387",
    },
    tagWrapper: {
      padding: "10px",
      ...commonEditorPencil(),
    },
    tagWrapperEdit: {
      padding: "10px",
    },
    descriptionContainer: {
      padding: "10px",

      ...commonEditorPencil(),
    },
    descriptionContainerEdit: {
      //padding: "10px",
      paddingBottom: 0,
    },

    nftTitle: {
      ...commonEditorPencil(),
    },
    assestWrapper: {
      position: "relative",
      border: "2px solid #5244ab",
      // height: "400px",
      // [theme.breakpoints.only("md")]: {
      //   height: "300px",
      // },
      // [theme.breakpoints.only("lg")]: {
      //   height: "400px",
      // },
      // [theme.breakpoints.only("xl")]: {
      //   height: "500px",
      // },
      "& $editPencil": {
        display: "block",
        position: "absolute",
        top: "-22px",
        right: "-3px",
        border: "2px solid #5244ab",
        backgroundColor: "#5244ab",
      },
    },
  })
);

export { mintnftDashboardStyles };
