import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
// import TextEditor from "./TextEditor";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/router";
import {
  Card,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  InputLabel,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseSharp from "@mui/icons-material/CloseSharp";

import { styled, useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import AccountBalanceWalletSharpIcon from "@mui/icons-material/AccountBalanceWalletSharp";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import StoreSharpIcon from "@mui/icons-material/StoreSharp";
import ChevronRightSharpIcon from "@mui/icons-material/ChevronRightSharp";
import ChevronLeftSharpIcon from "@mui/icons-material/ChevronLeftSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { VideoCameraBack } from "@mui/icons-material";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { DarkModeMerchantLogo, DarkModeDrawerAppLogo } from "../../BloIcons";
import Image from "next/image";
import { InputFileSelect } from "../../components/InputFileSelect/InputFileSelect";
import { actions } from "../../actions";
let { commonActions, nftActions } = actions;

export default function MiniDrawer({
  isNFT = false,
  selectedAsset,
  hanldeRemoveAssetFromNFT,
  sectionEditEnable,
  handleChangeSection,
  updateSection,
  showDefaultThumbail,
  updateSectionId,
  thumbnailPath,
}) {
  const drawerWidth = isNFT ? 340 : 240;

  const openedMixin = (theme) => ({
    width: drawerWidth,
    background: theme.palette.info.main,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "auto",
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "auto",
    background: theme.palette.info.main,
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(9)} + 1px)`,
    },
  });

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  const useStyles = makeStyles(() => ({
    logo: {
      margin: "1.4rem 2rem 2rem 2rem",
      marginRight: ({ open }) => !open && "1.6rem",
    },
    sideText: {
      fontWeight: 900,
      textAlign: "center",
    },
    icon: {
      color: "#A6B0B3",
    },
    container: {
      "& div": {
        // position: "",
        marginLeft: ({ isMobileView }) => isMobileView && "-17rem",
        // transition: "0.5s",
      },
    },
    toolbar: {
      position: "fixed",
      padding: ({ theme }) => theme.spacing(0, 1),
      top: "50%",
      transition: ({ theme }) =>
        theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      right: ({ open }) => (!open ? `` : `calc(98.5% - ${drawerWidth}px)`),
      left: ({ open }) => (!open ? "2.5%" : ""),
      // [theme.breakpoints.down("md")]: {
      //   right: ({ open }) => (!open ? `` : ``),
      //   left: ({ open }) => (!open ? "3%" : ""),
      // },
      // [theme.breakpoints.down("xs")]: {
      //   right: ({ open }) => (!open ? `` : `calc(94% - ${drawerWidth}px)`),
      //   left: ({ open }) => (!open ? "7%" : ""),
      // },
      zIndex: 1300,
    },
    iconBackground: {
      background: ({ theme }) => theme.palette.info.main,
      "&:hover": {
        background: "rgba(255, 255, 255, 0.08)",
      },
    },
    chevronIcon: {
      fontSize: "20px",
      color: "white",
    },
    card: {
      background: "transparent",
      height: "108px",
      width: "198px",
      border: "1px solid rgba(255, 255, 255, 0.56)",
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px",
      bottom: "90px",
    },
    thumbnail: {
      height: "100%",
      display: "grid",
      width: "100%",
      // height: "13rem",
      objectFit: "contain",
      placeItems: "center",
    },
    activeState: {
      background: ({ theme }) => theme.palette.primary.main,
      borderRadius: "50%",
      height: "16px",
      width: "16px",
    },
    colorButton: {
      margin: "10px 0 0 0",
      color: "rgba(0, 0, 0, 0.8)",
      backgroundColor: ({ theme }) => theme.palette.primary.main,
      "&:hover": {
        backgroundColor: ({ theme }) => theme.palette.primary.main,
      },
      width: "100%",
      fontWeight: 500,
      fontSize: "13px",
      lineHeight: "22px",
      letterSpacing: "0.46px",
      textTransform: "capitalize",
    },
    closeIcon: {
      color: "#ffffff",
    },
    propertiesClose: {
      borderRadius: "0px",
      marginTop: "2px",
      margin: "0px",
      height: "53px",
      minWidth: "0px",
      padding: "8px",
      color: "rgba(255, 255, 255, 0.56);",
      borderColor: "rgba(255, 255, 255, 0.56);",
    },
    textField: {
      borderRadius: "0px",
    },
    labelTxt: {
      paddingBottom: "10px",
    },
    expandBorder: {
      border: "1px solid #3e434d",
      marginTop: "-2px",
    },
    expandText: {
      whiteSpace: "normal",
      marginTop: "-20px",
      paddingLeft: "16px",
      width: "85%",
    },
    root: {
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderRadius: 0,
        borderColor: "rgba(255, 255, 255, 0.56);",
        borderRight: "none",
      },
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderRadius: 0,
        borderColor: "rgba(255, 255, 255, 0.56);",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderRadius: 0,
        borderColor: "#24D182",
      },
    },
  }));

  const theme = useTheme();
  const isBrowser = () => typeof window !== "undefined";
  const [isMobileView, setMobileView] = useState(
    isBrowser() && window.innerWidth < 768
  );
  const nftReducer = useSelector((state) => state && state.nftReducer);
  const { userProfile } = useSelector(
    (state) => (state && state.profileReducer) || {}
  );

  const [nft_id, setnft_id] = React.useState("");

  const dispatch = useDispatch();
  const open = useSelector((state) => state?.commonReducer?.drawer);
  const classes = useStyles({ theme, open, isMobileView });
  const router = useRouter();
  const { nftID } = router.query;
  const [selectedIndex, setSelectedIndex] = useState("");

  // useEffect(() => {
  //   if (!nft_id && nftID) {
  //     setnft_id(nftID);
  //     dispatch(nftActions.getNFTInfoByID(null, nftID));
  //   }
  // }, []);

  const handleDrawerState = () => {
    dispatch(commonActions.setDrawerState(!open));
  };

  const onChangeHandler = (e) => {
    dispatch(actions.nftActions.setFieldTouched(true));
    if (e.target.name === "nft_totalEdition") {
      nftReducer.nftEditData.totalEditions = parseInt(e.target.value);
    } else if (e.target.name === "nftTitle") {
      if (e.target.value.length <= 255) {
        nftReducer.nftEditData.title = e.target.value;
      } else {
        dispatch(
          actions.commonActions.displaySnackbar(
            "Max chars allowed is 255 for title",
            "error"
          )
        );
      }
    } /* else if (e.target.name === 'nftExternalLink') {
      nftReducer.nftEditData.externalLink = e.target.value;
    } */
    dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
  };

  const onChangeProperties = (e, i) => {
    dispatch(actions.nftActions.setFieldTouched(true));
    if (
      nftReducer &&
      nftReducer.nftEditData &&
      nftReducer.nftEditData.properties &&
      nftReducer.nftEditData.properties.length
    ) {
      if (e.target.name === "name") {
        nftReducer.nftEditData.properties[i].name = e.target.value;
      } else {
        nftReducer.nftEditData.properties[i].value = e.target.value;
      }
    } else {
      nftReducer.nftEditData.properties =
        nftReducer.nftInfoById.properties || [];
      if (e.target.name === "name") {
        nftReducer.nftEditData.properties[i].name = e.target.value;
      } else {
        nftReducer.nftEditData.properties[i].value = e.target.value;
      }
    }
    setSelectedIndex(e.target.id);

    // if (e.target.name === "name") {
    //   nftReducer.nftEditData.properties[i].name = e.target.value;
    // } else {
    //   nftReducer.nftEditData.properties[i].value = e.target.value;
    // }

    dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
  };

  const onChangeTags = (e, i) => {
    dispatch(actions.nftActions.setFieldTouched(true));
    if (
      nftReducer &&
      nftReducer.nftEditData &&
      nftReducer.nftEditData.tags &&
      nftReducer.nftEditData.tags.length
    ) {
      nftReducer.nftEditData.tags[i] = e.target.value;
    } else {
      nftReducer.nftEditData.tags = nftReducer.nftInfoById.tags || [];
      nftReducer.nftEditData.tags[i] = e.target.value;
    }
    setSelectedIndex(e.target.id);
    dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
  };

  const addRemoveTags = (type, index) => {
    if (type === "add") {
      if (
        !nftReducer.nftEditData ||
        !nftReducer.nftEditData.tags ||
        !nftReducer.nftEditData.tags.length
      ) {
        nftReducer.nftEditData.tags = nftReducer.nftInfoById.tags || [];
      }
      nftReducer.nftEditData.tags.push("");
    } else if (type === "remove") {
      nftReducer.nftEditData?.tags.splice(index, 1);
    }
    dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
  };

  const addRemoveProperties = (type, index) => {
    if (type === "add") {
      if (
        !nftReducer.nftEditData ||
        !nftReducer.nftEditData.properties ||
        !nftReducer.nftEditData.properties.length
      ) {
        nftReducer.nftEditData.properties =
          nftReducer.nftInfoById.properties || [];
      }
      nftReducer.nftEditData.properties.push({ name: "", value: "" });
    } else if (type === "remove") {
      nftReducer.nftEditData?.properties.splice(index, 1);
    }
    dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
  };

  const drawerItems = [
    {
      icon: <SettingsSharpIcon className={classes.icon} />,
      text: "Admin",
      url: "/login",
      onClick: () => {},
    },
    {
      icon: <AccountBalanceWalletSharpIcon className={classes.icon} />,
      text: "Assets",
      onClick: () => {},
    },
    {
      icon: <StoreSharpIcon className={classes.icon} />,
      text: "Commerce",
      onClick: () => {},
    },
  ];

  const handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      dispatch(actions.nftActions.setExpandedPanel(panel));
    }
    let ele = document.getElementsByClassName("clicked");
    for (let m = 0; m < ele.length; m++) {
      ele[m].classList.remove("clicked");
    }
    if (panel === "panel2") {
      document.getElementById("totalEditionRightSide").classList.add("clicked");
    } else if (panel === "panel1") {
      document.getElementById("titleRight").classList.add("clicked");
    } else if (panel === "panel8") {
      document.getElementById("tagsRight").classList.add("clicked");
    } else if (panel === "panel7") {
      document.getElementById("propertiesRight").classList.add("clicked");
    } else if (panel === "panel6") {
      nftReducer.textEditorData = nftReducer.nftInfoById.description;
      document.getElementById("descRight").classList.add("clicked");
    } else if (panel === "panelExternalLink") {
      document.getElementById("externalLinkRight").classList.add("clicked");
    }
  };

  const handleExit = () => {
    if (
      nftReducer &&
      nftReducer.nftEditData &&
      Object.keys(nftReducer.nftEditData).length
    ) {
      dispatch(actions.nftActions.setShowAlert(true));
      dispatch(actions.commonActions.setModalState(true));
    } else {
      router.push("/dashboard", undefined, { shallow: true });
    }
  };

  const handleLogoClick = () => {
    router.push("/dashboard", undefined, { shallow: true });
  };

  return (
    <Box sx={{ display: "flex" }} id="drawerSideBar">
      <CssBaseline />
      <Drawer className={classes.container} variant="permanent" open={open}>
        {isNFT ? (
          <Box
            onclick={handleExit}
            sx={{
              margin: "15px 10px",
              display: "flex",
              justifyContent: "start",
              pl: "5px",
              cursor: "pointer",
            }}
            className="left-bar"
          >
            <Image
              width="124px"
              height="26px"
              alt="Blocommerce"
              src="/images/BLOCommerce_White.png"
            />
          </Box>
        ) : (
          <DrawerHeader>
            <div
              className={classes.logo}
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            >
              {open ? DarkModeMerchantLogo() : DarkModeDrawerAppLogo()}
            </div>
          </DrawerHeader>
        )}
        {isNFT && (
          <div>
            <Accordion
              expanded={nftReducer.expandedPanel === "panel1"}
              onChange={handleChange("panel1")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                marginBottom: "16px",
                marginTop: "7px",
                borderRadius: 0,
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel1a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  NFT title
                </Typography>
              </AccordionSummary>
              <hr className={classes.expandBorder} />
              <AccordionDetails>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { m: 0.25, width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    name={"nftTitle"}
                    autoFocus={true}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") {
                        // Do code here
                        ev.preventDefault();
                      }
                    }}
                    value={
                      nftReducer &&
                      nftReducer.nftEditData &&
                      nftReducer.nftEditData.title
                    }
                    onChange={onChangeHandler}
                    id="nftTitle"
                    placeholder={
                      nftReducer &&
                      nftReducer.nftInfoById &&
                      nftReducer.nftInfoById.title
                    }
                    variant="outlined"
                  />
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* <Accordion
              expanded={nftReducer.expandedPanel === "panelExternalLink"}
              onChange={handleChange("panelExternalLink")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                marginBottom: "16px",
                marginTop: "7px",
                borderRadius: 0,
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panelExternalLinkHeader"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  External link
                </Typography>
              </AccordionSummary>
              <hr className={classes.expandBorder} />
              <AccordionDetails>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { m: 0.25, width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="nftExternalLink"
                    placeholder="Enter external url here"
                    variant="outlined"
                    name="nftExternalLink"
                    autoFocus={true}
                    value={nftReducer?.nftEditData?.externalLink || ''}
                    disabled={userProfile?.username !== nftReducer?.nftInfoById?.owner?.username}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") {
                        // Do code here
                        ev.preventDefault();
                      }
                    }}
                    onChange={onChangeHandler}
                  />
                </Box>
              </AccordionDetails>
            </Accordion> */}

            <Accordion
              expanded={nftReducer.expandedPanel === "panel2"}
              onChange={handleChange("panel2")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                marginBottom: "16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel2a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Total editions
                </Typography>
              </AccordionSummary>
              <p className={classes.expandText}>Subtitle goes here</p>
              <hr className={classes.expandBorder} />
              <AccordionDetails>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { m: 0.25, width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    sx={{
                      "&:focus": {
                        borderColor: "#24D182",
                      },
                    }}
                    onKeyPress={(ev) => {
                      if (ev.key === "Enter") {
                        // Do code here
                        ev.preventDefault();
                      }
                    }}
                    value={
                      (nftReducer &&
                        nftReducer.nftEditData &&
                        nftReducer.nftEditData.totalEditions) ||
                      (nftReducer &&
                        nftReducer.nftInfoById &&
                        nftReducer.nftInfoById.totalEditions)
                    }
                    type={"number"}
                    autoFocus={true}
                    onChange={onChangeHandler}
                    id="nft_totalEdition"
                    name="nft_totalEdition"
                    placeholder="100"
                    variant="outlined"
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={nftReducer.expandedPanel === "panel3"}
              onChange={handleChange("panel3")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                marginBottom: "16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel3a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Upload your main asset for this NFT
                </Typography>
              </AccordionSummary>
              <hr className={classes.expandBorder} />
              <AccordionDetails>
                <Typography>
                  {thumbnailPath ||
                  selectedAsset?.type ||
                  (showDefaultThumbail &&
                    nftReducer.nftInfoById?.assets?.[0]?.type) ? (
                    <>
                      <span
                        style={{
                          background: "rgba(56, 63, 78, 0.8)",
                          width: "90.5%",
                          position: "absolute",
                          right: "1rem",
                        }}
                      >
                        <Button
                          onClick={hanldeRemoveAssetFromNFT}
                          style={{
                            float: "right",
                            marginTop: "0",
                            marginBottom: "0",
                            marginRight: "0",
                          }}
                        >
                          <CloseSharpIcon
                            sx={{
                              width: "1.5rem",
                              height: "1.5rem",
                            }}
                            color="error"
                          />
                        </Button>
                      </span>
                      {thumbnailPath || selectedAsset?.thumbnail ? (
                        <img
                          className={classes.thumbnail}
                          src={thumbnailPath || selectedAsset?.thumbnail}
                          alt="thumnail"
                        />
                      ) : (
                        <>
                          {selectedAsset?.type === "video" ||
                          nftReducer.nftInfoById?.assets?.[0]?.type ===
                            "video" ? (
                            <Image
                              src="/images/Videothumbnail.png"
                              width="290px"
                              height="290px"
                              alt="video"
                            />
                          ) : (
                            <>
                              {selectedAsset?.type === "3d_model" ||
                              nftReducer.nftInfoById?.assets?.[0]?.type ===
                                "3d_model" ? (
                                <Image
                                  src="/images/3Dthumbnail.png"
                                  width="290px"
                                  height="290px"
                                  alt="3d_model"
                                />
                              ) : (
                                <>
                                  {selectedAsset?.type === "audio" ||
                                  nftReducer.nftInfoById?.assets?.[0]?.type ===
                                    "audio" ? (
                                    <Image
                                      src="/images/Audiothumbnail.png"
                                      width="290px"
                                      height="290px"
                                      alt="audio"
                                    />
                                  ) : (
                                    <Image
                                      src="/images/thumbnailnft.png"
                                      width="290px"
                                      height="290px"
                                      alt="3d_model"
                                    />
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <InputFileSelect />
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={nftReducer.expandedPanel === "panel6"}
              onChange={handleChange("panel6")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                marginBottom: "16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel6a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Description
                </Typography>
              </AccordionSummary>
              <p className={classes.expandText}>
                The description will be included on the item’s detail page
                underneath its image. Markdown syntax is supported.{" "}
              </p>
              <hr className={classes.expandBorder} />
              <AccordionDetails>
                <TextEditor
                  value={
                    nftReducer.textEditorData
                  }
                  type="Description"
                />
                <Button
                  className={classes.colorButton}
                  variant="contained"
                  onClick={() => {
                    dispatch(actions.nftActions.setFieldTouched(true));
                    nftReducer.nftEditData.description =
                      nftReducer.textEditorData;

                    dispatch(
                      actions.nftActions.setNftData(nftReducer.nftEditData)
                    );
                  }}
                >
                  APPLY
                </Button>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={nftReducer.expandedPanel === "panel7"}
              onChange={handleChange("panel7")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                marginBottom: "16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel7a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Properties
                </Typography>
              </AccordionSummary>
              <p className={classes.expandText}>
                Textual properties that describe your unique NFT
              </p>
              <hr className={classes.expandBorder} />
              <AccordionDetails>
                <Box
                  component="form"
                  sx={{ "& .MuiTextField-root": { m: 0.25, width: "100%" } }}
                  noValidate
                  autoComplete="off"
                >
                  {/* {showPropInput && (
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <div>
                        <InputLabel
                          className={classes.labelTxt}
                          htmlFor="formatted-text-mask-input"
                        >
                          Type
                        </InputLabel>
                        <TextField
                          value=""
                          onChange={onChangeProperties}
                          className={classes.root}
                          id="type"
                          variant="outlined"
                        />
                      </div>
                      <div>
                        <InputLabel
                          className={classes.labelTxt}
                          htmlFor="formatted-text-mask-input"
                        >
                          Name
                        </InputLabel>
                        <TextField
                          value=""
                          onChange={onChangeProperties}
                          className={classes.root}
                          id="nft_name"
                          variant="outlined"
                        />
                      </div>
                      <div>
                        <Button
                          className={classes.propertiesClose}
                          variant="outlined"
                        >
                          X
                        </Button>
                      </div>
                    </Box>
                  )} */}
                  {nftReducer?.nftEditData?.properties?.length ? (
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <div
                        style={{
                          color: "#FFF",
                          fontSize: "14px",
                          minWidth: "130px",
                        }}
                      >
                        Type
                      </div>
                      <div
                        style={{
                          color: "#FFF",
                          fontSize: "14px",
                          minWidth: "130px",
                        }}
                      >
                        Name
                      </div>
                    </Box>
                  ) : (
                    ""
                  )}
                  {nftReducer?.nftEditData?.properties?.length ? (
                    nftReducer?.nftEditData?.properties?.map((item, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: "15px",
                          }}
                        >
                          <div>
                            {/* <InputLabel
                              className={classes.labelTxt}
                              htmlFor="formatted-text-mask-input"
                            >
                              Type
                            </InputLabel> */}
                            <TextField
                              value={item.name}
                              onChange={(e) => onChangeProperties(e, index)}
                              className={classes.root}
                              id={"type" + index}
                              autoFocus={
                                "type" + index === selectedIndex ? true : false
                              }
                              variant="outlined"
                              name="name"
                            />
                          </div>
                          <div>
                            {/* <InputLabel
                              className={classes.labelTxt}
                              htmlFor="formatted-text-mask-input"
                            >
                              Name
                            </InputLabel> */}
                            <TextField
                              value={item.value}
                              onChange={(e) => onChangeProperties(e, index)}
                              className={classes.root}
                              id={"name" + index}
                              autoFocus={
                                "name" + index === selectedIndex ? true : false
                              }
                              variant="outlined"
                              name="value"
                            />
                          </div>
                          <div>
                            <Button
                              className={classes.propertiesClose}
                              variant="outlined"
                              onClick={() =>
                                addRemoveProperties("remove", index)
                              }
                            >
                              X
                            </Button>
                          </div>
                        </Box>
                      );
                    })
                  ) : (
                    <></>
                  )}

                  <Button
                    className={classes.colorButton}
                    variant="contained"
                    // onClick={handlePropBtnClick}
                    onClick={() => addRemoveProperties("add", null)}
                  >
                    ADD NEW PROPERTY
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={nftReducer.expandedPanel === "panel8"}
              onChange={handleChange("panel8")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                marginBottom: "16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel8a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Tags
                </Typography>
              </AccordionSummary>
              <p className={classes.expandText}>
                Textual tags to increase the discoverability of your NFT
              </p>
              <hr className={classes.expandBorder} />
              <AccordionDetails>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: "20px 0", width: "100%" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {/* {showTagInput && (
                      <TextField
                        id="nft_tag"
                        label="Enter a Tag"
                        variant="outlined"
                        InputProps={{ endAdornment: <CloseButton /> }}
                      />
                    )} */}
                    {nftReducer &&
                    nftReducer.nftEditData &&
                    nftReducer.nftEditData.tags &&
                    nftReducer.nftEditData.tags?.length ? (
                      nftReducer.nftEditData.tags.map((item, index) => {
                        return (
                          <TextField
                            key={index}
                            onKeyPress={(ev) => {
                              if (ev.key === "Enter") {
                                // Do code here
                                ev.preventDefault();
                              }
                            }}
                            value={item}
                            id={"tags" + index}
                            label="Enter a Tag"
                            variant="outlined"
                            onChange={(e) => onChangeTags(e, index)}
                            sx={{ marginBottom: "0px !important" }}
                            autoFocus={
                              "tags" + index === selectedIndex ? true : false
                            }
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() => addRemoveTags("remove", index)}
                                >
                                  <CloseSharp className={classes.closeIcon} />
                                </IconButton>
                              ),
                            }}
                          />
                        );
                      })
                    ) : (
                      <></>
                    )}

                    {((nftReducer && !nftReducer?.nftEditData?.tags) ||
                      !nftReducer?.nftEditData?.tags?.length) &&
                    nftReducer.nftInfoById &&
                    nftReducer.nftInfoById.tags &&
                    nftReducer.nftInfoById.tags.length ? (
                      nftReducer?.nftInfoById?.tags?.map((item, index) => {
                        return (
                          <TextField
                            key={index}
                            value={item}
                            id={"tags" + index}
                            label="Enter a Tag"
                            variant="outlined"
                            onChange={(e) => onChangeTags(e, index)}
                            sx={{ marginBottom: "0px !important" }}
                            autoFocus={
                              "tags" + index === selectedIndex ? true : false
                            }
                            InputProps={{
                              endAdornment: (
                                <IconButton
                                  onClick={() => addRemoveTags("remove", index)}
                                >
                                  <CloseSharp className={classes.closeIcon} />
                                </IconButton>
                              ),
                            }}
                          />
                        );
                      })
                    ) : (
                      <></>
                    )}

                    <Button
                      className={classes.colorButton}
                      variant="contained"
                      onClick={() => addRemoveTags("add", null)}
                    >
                      ADD NEW TAGS
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
            {sectionEditEnable && (
              <Accordion
                expanded={nftReducer.expandedPanel === "panel9"}
                onChange={handleChange("panel9")}
                style={{
                  background: "rgba(255, 255, 255, 0.09)",
                  marginBottom: "16px",
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                  id="panel8a-header"
                >
                  <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                    Section
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextEditor
                    type="Section"
                    value={
                      nftReducer.sectionList[updateSectionId]?.attributes
                        ?.content
                    }
                    updateSectionId={updateSectionId}
                  />
                  <Button
                    className={classes.colorButton}
                    variant="contained"
                    onClick={() => {
                      dispatch(actions.nftActions.setFieldTouched(true));
                      nftReducer.sectionList[
                        updateSectionId
                      ].attributes.content =
                        nftReducer.textEditorDataSectionList[0].attributes.content;

                      dispatch(
                        actions.nftActions.setSectionData(
                          nftReducer.sectionList
                        )
                      );
                    }}
                  >
                    APPLY
                  </Button>
                </AccordionDetails>
              </Accordion>
            )}
          </div>
        )}

        {!isNFT && (
          <List>
            {drawerItems.map(({ icon, url, text, onClick }) => (
              <ListItem
                selected={process.browser && window?.location?.pathname === url}
                button
                key={text}
                onClick={onClick}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  style={{
                    color:
                      process.browser &&
                      window?.location?.pathname === url &&
                      theme.palette.primary.main,
                  }}
                  primary={text}
                />
              </ListItem>
            ))}
          </List>
        )}
        {open && !isNFT && (
          <Container>
            <Card className={classes.card}>
              <Grid container>
                <Grid item sm={2}>
                  <Box className={classes.activeState}></Box>
                </Grid>
                <Grid item sm={2}>
                  <Box>{"Ethereum Main Network"}</Box>
                </Grid>
              </Grid>
            </Card>
          </Container>
        )}
      </Drawer>
      {!isNFT && (
        <div className={classes.toolbar}>
          <IconButton
            onClick={handleDrawerState}
            className={classes.iconBackground}
          >
            {!open ? (
              <ChevronRightSharpIcon className={classes.chevronIcon} />
            ) : (
              <ChevronLeftSharpIcon className={classes.chevronIcon} />
            )}
          </IconButton>
        </div>
      )}
    </Box>
  );
}

// import { actions } from "../../actions";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  compatibilityMode: false,
});

function TextEditor({ type, value, updateSectionId }) {
  const dispatch = useDispatch();
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { color: [] },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
        "link",
      ],
    ],
    clipboard: { matchVisual: false },
  };

  const onfunChange = (content, delta, source, editor) => {
    if (type === "Description") {
      // nftReducer.nftEditData.description = content;
      nftReducer.textEditorData = content;

      // debounce(() => {
      //   dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
      // }, 3000);
    } else if (
      nftReducer.sectionList &&
      nftReducer.sectionList[updateSectionId] &&
      nftReducer.sectionList[updateSectionId].attributes
    ) {
      // nftReducer.sectionList[updateSectionId].attributes.content = content;
      nftReducer.textEditorDataSectionList[0].attributes.content = content;

      // debounce(() => {
      //   dispatch(actions.nftActions.setSectionData(nftReducer.sectionList));
      // }, 3000);
    }
  };

  const emailInputRef = React.useRef(null);

  let timer;
  function debounce(fn, delay) {
    return (() => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(), delay);
    })();
  }

  return (
    <ReactQuill
      theme="snow"
      value={
        type === "Description"
          ? nftReducer.textEditorData
          : nftReducer.textEditorDataSectionList?.[0]?.attributes.content
      }
      onChange={onfunChange}
      modules={modules}
      ref={emailInputRef}
    />
  );
}
// export default TextEditor;
