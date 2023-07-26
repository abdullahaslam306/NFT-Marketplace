import React, { useEffect, useRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import { Grid, Button, Backdrop, Modal } from "@mui/material";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HeaderComponent from "../Header/Header";
import Cryptocurrencies from "../Cryptocurrencies/Cryptocurrencies";
import WalletManagement from "../WalletManagement/WalletManagement";
import MobileDrawer from "./MobileDrawer";
import { actions } from "../../actions";
import ChevronLeftSharpIcon from "@mui/icons-material/ChevronLeftSharp";
import { useSelector, useDispatch } from "react-redux";
import CircleIcon from "@mui/icons-material/Circle";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";
import Dashboard from "../DashboardV2";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import AssetManagement from "../AssetManagement/AssetManagement";
import PortfolioManagement from "../NFTProtflioComponent/PortfolioManagement";
import Wallet from "../Wallet/Wallet";
import FooterComponent from "../Footer/Footer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import ShowChart from "@mui/icons-material/ShowChart";
import PlaylistAddCheckSharpIcon from "@mui/icons-material/PlaylistAddCheckSharp";
import { Settings, Palette } from "@mui/icons-material";
import { EtherIcon, EtherIconRounded, NoteIcon } from "../../BloIcons";
import { useRouter } from "next/router";
import NFTSales from "../NFTSales/NFTSales";
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PaletteIcon from '@mui/icons-material/Palette';
import Lottie from "react-lottie";
import animationData from "../successModal/lottiesAnimationData.json";
import MapIcon from '@mui/icons-material/Map';


const drawerWidth = 240;

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: "#383F4E",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

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

export default function MiniDrawer() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const commonReducer = useSelector((state) => state.commonReducer || {});
  const [open, setOpen] = React.useState(true);
  const [openSubmenuAdmin, setOpenSubmenuAdmin] = React.useState(false);
  const [openSubmenuWallet, setOpenSubmenuWallet] = React.useState(false);
  const [openSubmenuApps, setOpenSubmenuApps] = React.useState(true);
  const [openSubmenuNFT, setOpenSubmenuNFT] = React.useState(true);
  const [openHelpModal, setOpenHelpModal] = React.useState(false);
  const [showJoyride, setShowJoyride] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const headRef = React.createRef();
  const auth = useSelector((state) => state.authReducer || {});
  const steps = [
    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={2} sx={{ textAlign: "left",pl: "0!important" }}>
          <AccountBalanceWalletIcon sx={{ fontSize: "75px", ml: "-10px", mt: "30px", color: "rgba(255, 255, 255, 0.56)" }} />
        </Grid>
        <Grid item xs={10} sx={{ textAlign: "left",pl:"10px!important"  }}>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "8px" }}>1 of 3</Typography>
          <Typography sx={{ fontSize: "24px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "8px" }}>Connect your external wallets</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "16px" }}>Connect your external wallets via Metamask and index all your crypto & NFT assets in a single dashboard. </Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400" }}>Don’t worry, BLOCommerce does not store your private key and is not able to transfer any of your crypto & NFT assets.</Typography>
        </Grid>
      </Grid></Box>,
      placement: 'left',
      spotlightClicks: false,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: "#my-first-step",
      hideCloseButton: true,
      disableBeacon: true,
      locale: { skip: <strong aria-label="skip" className="skip-btn" >SKIP TOUR</strong>, next: <span aria-label="continue"  >Continue</span> }
    },
    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={2} sx={{ textAlign: "left",pl: "0!important" }}>
          <AnalyticsIcon sx={{ fontSize: "75px", ml: "-10px", mt: "30px", color: "rgba(255, 255, 255, 0.56)" }} />
        </Grid>
        <Grid item xs={10} sx={{ textAlign: "left",pl:"10px!important"  }}>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "8px" }}>2 of 3</Typography>
          <Typography sx={{ fontSize: "24px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "8px" }}>Analyze your NFT trading activities</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "16px" }}>Check out trading insights like transactions, earnings, spendings and more, for your NFT activities across multiple wallets and smart-contracts.</Typography>
        </Grid>
      </Grid></Box>,
      placement: matches? 'right' : 'bottom',
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: "#my-second-step",
      hideCloseButton: true,
      hideBackButton: true,
      spotlightClicks: false,
      disableBeacon: true,
      locale: { skip: <strong aria-label="skip" className="skip-btn" >SKIP TOUR</strong>, next: <span aria-label="continue"  >Continue</span> }
    },
    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={2} sx={{ textAlign: "left",pl: "0!important" }}>
          <PaletteIcon sx={{ fontSize: "75px", ml: "-10px", mt: "30px", color: "rgba(255, 255, 255, 0.56)" }} />
        </Grid>
        <Grid item xs={10} sx={{ textAlign: "left", pl:"10px!important" }}>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "8px" }}>3 of 3</Typography>
          <Typography sx={{ fontSize: "24px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "8px" }}>Create your first NFT</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "16px" }}>Start creating your first NFT on BLOCommerce with intuitive user interface, and list it for sale on Opensea and other marketplaces to start earning!</Typography>
        </Grid>
      </Grid></Box>,
      placement: matches? 'left' : 'top',
      hideCloseButton: true,
      hideBackButton: true,
      spotlightClicks: false,
      disableBeacon: true,
      locale: { skip: <strong aria-label="skip" className="skip-btn" >SKIP TOUR</strong>, next: <span aria-label="continue"  >Continue</span> },
      target: "#my-third-step",
    },

    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={5} sx={{ textAlign: "left", pl: "0!important" }}>
          <Lottie options={defaultOptions} height={154} width={154} />
        </Grid>
        <Grid item xs={7} sx={{ textAlign: "left",pl:"10px!important"  }}>
          <Typography sx={{ fontSize: "24px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "8px" }}>Well done!</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "16px" }}>Now continue your journey on BLOCommerce by following these links</Typography>
        </Grid>
      </Grid></Box>,
      placement: matches? 'right' : 'top',
      hideCloseButton: true,
      hideBackButton: true,
      spotlightClicks: false,
      disableBeacon: true,
      locale: { last: <strong aria-label="last" >CLOSE</strong> },
      target: "#my-fourth-step",
    },


  ];

  const stepsMobile = [
    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={2} sx={{ textAlign: "left",pl: "0!important" }}>
          <AccountBalanceWalletIcon sx={{ fontSize: "75px", ml: "-10px", mt: "30px", color: "rgba(255, 255, 255, 0.56)" }} />
        </Grid>
        <Grid item xs={10} sx={{ textAlign: "left",pl:"10px!important"  }}>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "8px" }}>1 of 3</Typography>
          <Typography sx={{ fontSize: "24px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "8px" }}>Connect your external wallets</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "16px" }}>Connect your external wallets via Metamask and index all your crypto & NFT assets in a single dashboard. </Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400" }}>Don’t worry, BLOCommerce does not store your private key and is not able to transfer any of your crypto & NFT assets.</Typography>
        </Grid>
      </Grid></Box>,
      placement: 'top',
      spotlightClicks: false,
      styles: {
        options: {
          zIndex: 10000,
        },
      },
      target: "#my-first-step",
      hideCloseButton: true,
      disableBeacon: true,
      locale: { skip: <strong aria-label="skip" className="skip-btn" >SKIP TOUR</strong>, next: <span aria-label="continue"  >Continue</span> }
    },
    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={2} sx={{ textAlign: "left",pl: "0!important" }}>
          <AnalyticsIcon sx={{ fontSize: "75px", ml: "-10px", mt: "30px", color: "rgba(255, 255, 255, 0.56)" }} />
        </Grid>
        <Grid item xs={10} sx={{ textAlign: "left",pl:"10px!important"  }}>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "4px" }}>2 of 3</Typography>
          <Typography sx={{ fontSize: "18px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "4px" }}>Analyze your NFT trading activities</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "8px" }}>Check out trading insights like transactions, earnings, spendings and more, for your NFT activities across multiple wallets and smart-contracts.</Typography>
        </Grid>
      </Grid></Box>,
      placement: 'bottom',
      styles: {
        options: {
          zIndex: 10000,
          padding: '10px 10px',
        },
      },
      target: "#my-second-step",
      hideCloseButton: true,
      hideBackButton: true,
      spotlightClicks: false,
      disableBeacon: true,
      locale: { skip: <strong aria-label="skip" className="skip-btn" >SKIP TOUR</strong>, next: <span aria-label="continue"  >Continue</span> }
    },
    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={2} sx={{ textAlign: "left",pl: "0!important" }}>
          <PaletteIcon sx={{ fontSize: "75px", ml: "-10px", mt: "30px", color: "rgba(255, 255, 255, 0.56)" }} />
        </Grid>
        <Grid item xs={10} sx={{ textAlign: "left", pl:"10px!important" }}>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "8px" }}>3 of 3</Typography>
          <Typography sx={{ fontSize: "24px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "8px" }}>Create your first NFT</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "16px" }}>Start creating your first NFT on BLOCommerce with intuitive user interface, and list it for sale on Opensea and other marketplaces to start earning!</Typography>
        </Grid>
      </Grid></Box>,
      placement: 'bottom',
      hideCloseButton: true,
      hideBackButton: true,
      spotlightClicks: false,
      disableBeacon: true,
      locale: { skip: <strong aria-label="skip" className="skip-btn" >SKIP TOUR</strong>, next: <span aria-label="continue"  >Continue</span> },
      target: "#my-third-step-mobile",
    },

    {
      content: <Box> <Grid container spacing={2}>
        <Grid item xs={5} sx={{ textAlign: "left", pl: "0!important" }}>
          <Lottie options={defaultOptions} height={154} width={154} />
        </Grid>
        <Grid item xs={7} sx={{ textAlign: "left",pl:"10px!important"  }}>
          <Typography sx={{ fontSize: "24px", color: "rgba(255, 255, 255, 1)", fontWeight: "900", mb: "8px" }}>Well done!</Typography>
          <Typography sx={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "400", mb: "16px" }}>Now continue your journey on BLOCommerce by following these links</Typography>
        </Grid>
      </Grid></Box>,
      placement: matches? 'right' : 'top',
      hideCloseButton: true,
      hideBackButton: true,
      spotlightClicks: false,
      disableBeacon: true,
      locale: { last: <strong aria-label="last" >CLOSE</strong> },
      target: "#my-fourth-step-mobile",
    },


  ];


  const handleDrawerState = (drawerName) => {
    dispatch(actions.commonActions.setDrawerState(drawerName));
    if (isMobile) handleDrawerClose();
  };

  const closeHelpModal = () => {
    setOpenHelpModal(false)
    dispatch(actions.authActions.setFirstTimeUserFalse())
    router.push("/dashboard");

  }

  const startJourneyModal = () => {
    dispatch(actions.commonActions.setDrawerState("wallet-settings"));
    dispatch(actions.authActions.setFirstTimeUserFalse())
    setShowJoyride(true)
    setOpenHelpModal(false)

  }

  useEffect(() => {
    if (auth?.isAuthenticatedWithNewUser) {
      setOpenHelpModal(true)
    }
  }, [auth?.isAuthenticatedWithNewUser])

  const drawerItems = [
    {
      icon: <DashboardIcon color="active" />,
      text: "Dashboard",
      link: "dashboard",
      checked: openSubmenuAdmin,
      onClick: () => {
        handleDrawerState("dashboard");
      },
    },
    {
      icon: <EtherIconRounded color="active" />,
      text: "Cryptocurrencies",
      link: "cryptocurrencies",
      onClick: () => {
        handleDrawerState("cryptocurrencies");
      },
    },
    {
      icon: <Palette color="active" />,
      text: "NFTs",
      link: "nfts",
      checked: openSubmenuNFT,
      onClick: () => {
        setOpenSubmenuNFT(!openSubmenuNFT);
      },
      subItems: [
        {
          icon: <NoteIcon />,
          text: "NFT Management",
          link: "nfts",
          onClick: () => {
            handleDrawerState("nfts");
          },
        },
        {
          icon: <PlaylistAddCheckSharpIcon color="active" />,
          text: "NFT Sales Planning",
          link: "nft-sales",
          onClick: () => {
            handleDrawerState("nft-sales");
          },
        },
        {
          icon: <ShowChart color="active" />,
          text: "NFT Portfolio Analysis",
          link: "NFTPortfolioAnalysis",
          checked: openSubmenuWallet,
          onClick: () => {
            handleDrawerState("NFTPortfolioAnalysis");
          },
          class: "my-second-step",
        },
      ],
    },
    {
      icon: <PhotoLibraryIcon color="active" />,
      text: "Multimedia Assets",
      link: "assets",
      checked: openSubmenuWallet,
      onClick: () => {
        handleDrawerState("assets");
      },
    },
    {
      icon: <Settings color="active" />,
      text: "Wallet Settings",
      link: "wallet-settings",
      onClick: () => {
        handleDrawerState("wallet-settings");
      },
    },
  ];

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  const closeDrawer = () => {
    setOpen(true);
  };

  const handleClick = () => {
    router.push("/dashboard");
    dispatch(actions.commonActions.setDrawerState("dashboard"));
  };

  const handleJoyrideCallback = (CallBackProps) => {
    const { action, index, type, status, lifecycle } = CallBackProps;
    if (stepIndex === 0 && type === "step:after") {     
      if (!matches) {
        setOpen(false);
      }
      setStepIndex(1)
      dispatch(actions.commonActions.setDrawerState("NFTPortfolioAnalysis"));
    } else if (stepIndex === 1 && type === "step:after") {
      dispatch(actions.commonActions.setDrawerState("nfts"));
      setTimeout(() => {
        setStepIndex(2)
      }, 1000);
    }
    else if (stepIndex === 2 && type === "step:after") {
      dispatch(actions.commonActions.setDrawerState("dashboard"));
      setStepIndex(3)
    } else if (stepIndex === 3 && type === "step:after") {
      setShowJoyride(false)
    }

    if (action === "skip") {
      setOpenHelpModal(false)
      dispatch(actions.authActions.setFirstTimeUserFalse())
      router.push("/dashboard");
    }


  };




  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        ref={headRef}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#383F4E",
        }}
      >
        <Toolbar
          sx={{
            mx: { sm: "16px" },
            p: { sm: "0!important" },
            minHeight: { sm: "76px!important" },
          }}
        >
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              color: "#fff",
              mr: { sm: "24px!important" },
            }}
          >
            {(isMobile && !open) || (!isMobile && open) ? (
              <ChevronLeftSharpIcon id="DrawerIcon" sx={{ fontSize: "25px" }} />
            ) : (
              <MenuIcon id="DrawerIcon" sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <Box
            sx={{
              display: "flex",
              width: "100%",
            }}
          >
            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={handleClick}
            >
              <Image
                width="160px"
                height="34px"
                alt="Blocommerce"
                src="/images/BLOCommerce_White.png"
              />
            </Box>
          </Box>
          <HeaderComponent />
        </Toolbar>
      </AppBar>
      {matches ? (
        <Drawer variant="permanent" open={open}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <List sx={{ mt: 10 }}>
              {drawerItems.map((menuItem, index) => (
                <Box key={index}>
                  <ListItemButton
                    key={menuItem.text}
                    sx={{
                      background:
                        (commonReducer.drawer === menuItem.link ||
                          menuItem?.subItems?.find?.(
                            (item) => item.link === commonReducer.drawer
                          )) &&
                        "rgb(0 227 135 / 8%)",
                      "&:hover": {
                        background: "#FFFFFF14",
                      },
                    }}
                    className={menuItem.class}
                    onClick={menuItem.onClick}
                  >
                    <ListItemIcon>{menuItem.icon}</ListItemIcon>
                    <ListItemText primary={menuItem.text} />

                    {menuItem?.subItems?.length > 0 && menuItem.checked ? (
                      <ExpandLess />
                    ) : (
                      menuItem?.subItems?.length > 0 && <ExpandMore />
                    )}
                  </ListItemButton>

                  <Collapse in={menuItem.checked} timeout="auto" unmountOnExit>
                    {menuItem?.subItems?.map((subItem, index) => (
                      <List component="div" disablePadding key={index}>
                        <ListItemButton
                          sx={{
                            pl: open ? 4 : 2,
                            background:
                              commonReducer.drawer === subItem.link &&
                              "rgb(0 227 135 / 8%)",
                            "&:hover": {
                              background: "#FFFFFF14",
                            },
                          }}
                          onClick={subItem.onClick}
                          id={subItem.class}
                        >
                          <ListItemIcon
                            sx={{
                              color: "rgba(255, 255, 255, 0.56)",
                              fontSize: { sm: "10px" },
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.text}
                            sx={{ fontSize: { sm: "12px" } }}
                          />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>
                </Box>
              ))}
            </List>

            {open ? (
              <Box
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.23)",
                  margin: "0 20px 0 20px",
                  padding: "8px",
                  borderRadius: "4px",
                  display: "flex",
                  marginBottom: "30px",
                  alignItems: "center",
                  // bottom: "10%",
                  // position: "absolute",
                }}
              >
                <EtherIcon color="primary" />
                <Box
                  sx={{
                    flexWrap: "wrap",
                    flexDirection: "column",
                    display: "flex",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "16px", color: "#FFF", ml: "15px" }}
                    component="div"
                  >
                    Ethereum Main
                  </Typography>
                  <Typography
                    sx={{ fontSize: "16px", color: "#FFF", ml: "15px" }}
                    component="div"
                  >
                    Network
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.23)",
                  margin: "0 10px 0 10px",
                  padding: "10px",
                  borderRadius: "4px",
                  display: "flex",
                  marginBottom: "30px",
                  "& svg": {
                    margin: "auto",
                  },
                }}
              >
                <EtherIcon color="primary" />
              </Box>
            )}
          </div>
        </Drawer>
      ) : (
        <MobileDrawer
          open={!open}
          drawerItems={drawerItems}
          handleDrawerClose={closeDrawer}
          headRef={headRef}
        />
      )}
      <Box
        component="main"
        sx={
          commonReducer.drawer === "wallet-settings"
            ? {
              flexGrow: 1,
              mt: "64px!important",
              overflowX: "hidden",
            }
            : {
              flexGrow: 1,
              mt: "64px!important",

              //padding: matches ? "3rem" : "16px",
            }
        }
        style={matches ? { width: `calc(100% - 240px )` } : { width: "100%" }}
      >
        {/* <DrawerHeader /> */}
        {commonReducer.drawer === "dashboard" && <Dashboard />}
        {commonReducer.drawer === "cryptocurrencies" && <Cryptocurrencies />}
        {commonReducer.drawer === "wallet-settings" && <WalletManagement />}
        {commonReducer.drawer === "profile-setting" && <ProfileInfo />}
        {commonReducer.drawer === "assets" && <AssetManagement />}
        {commonReducer.drawer === "NFTPortfolioAnalysis" && (
          <PortfolioManagement />
        )}
        {commonReducer.drawer === "nfts" && <Wallet />}
        {commonReducer.drawer === "nft-sales" && <NFTSales />}
        {showJoyride && matches &&
          <Joyride continuous={true}
            steps={steps}
            run={showJoyride}
            showSkipButton={true}
            callback={handleJoyrideCallback}
            stepIndex={stepIndex}
            styles={{
              options: {
                arrowColor: 'rgba(255, 255, 255, 0.09)',
                primaryColor: '#000',
                textColor: '#fff',
                width: "479px",
                zIndex: 10000,
              }
            }} />
        }
{showJoyride && !matches &&
          <Joyride continuous={true}
            steps={stepsMobile}
            run={showJoyride}
            showSkipButton={true}
            callback={handleJoyrideCallback}
            stepIndex={stepIndex}
            scrollToSteps={true}
            disableScrolling={false}
            styles={{
              options: {
                arrowColor: 'rgba(255, 255, 255, 0.09)',
                primaryColor: '#000',
                textColor: '#fff',
                width: "375px",
                zIndex: 10000,
              }
            }} />
        }

        {openHelpModal &&
          <Modal
            closeAfterTransition
            open={true}
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
              className: "backgroundfirefoxParentDiv",
            }}
          // style={{ overflowY: "scroll" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Box
                sx={{
                  width: matches ? "480px" : "100%",
                  minHeight: "208px",
                  position: "absolute",
                  // top: 0,
                  margin: "15px",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.09)",
                  backdropFilter: "blur(50px)",
                  webkitBackdropFilter: "blur(50px)",
                }}
                className="backgroundfirefoxChildDiv"
              >
                <Box sx={{ p: "24px" }}>
                  <Grid container sx={{}}>
                    <Grid xs={7} lg={8} sx={{ textAlign: "left" }}>
                      <Typography sx={{ fontWeight: 400, fontSize: "16px", textAlign: "left", color: "rgba(255, 255, 255, 0.7)" }}>
                        Welcome!
                      </Typography>
                      <Typography sx={{ fontWeight: 900, fontSize: "24px", textAlign: "left" }}>
                        Let’s start with a quick tour to the platform
                      </Typography>

                    </Grid>
                    <Grid xs={5} lg={4}  sx={{ textAlign: matches ? "center" : "center" }}>
                      <MapIcon sx={{ fontSize: "75px", mt: "30px", color: "rgba(255, 255, 255, 0.56)" }} />
                    </Grid>
                  </Grid>
                  <Box sx={{ display: "flex" }}>
                    <Button
                      sx={{ mt: 2, m: "20px 20px 20px 0!important" }}
                      color="primary"
                      variant="contained"
                      type={"submit"}
                      onClick={startJourneyModal}
                    > Get started </Button>
                    <Button
                      sx={{ mt: 2, m: "20px 20px 20px 0!important" }}
                      color="primary"
                      variant="outlined"
                      type={"submit"}
                      margin={'20px 0 0 0'}
                      onClick={closeHelpModal}
                    > skip tour </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Modal>
        }
        <FooterComponent />
      </Box>
    </Box>
  );
}
