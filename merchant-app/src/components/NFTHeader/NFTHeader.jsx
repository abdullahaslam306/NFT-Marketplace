import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@mui/styles";
import {
  LogoutIcon,
  MobileHeaderIcon,
  DesktopHeaderIcon,
  LazyMintIcon,
} from "../../BloIcons/index";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { actions } from "../../actions";
import { Box, Button, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import LockAndMintModal from "../../components/LockAndMintModal/LockAndMintModal";
import LazyMintModal from "../../components/LazyMintModal/LazyMintModal";
import SuccessModal from "../successModal/index";
import {
  NFT_LAZYMINT_CONGRALATIONS,
  NFT_LAZYMINT_CONGRALATIONS_SUBTEXT,
  NFT_LOCKMINT_CONGRALATIONS_SUBTEXT,
  NFT_LOCKMINT_CONGRALATIONS,
} from "../../utils/constants";
import { useRouter } from "next/router";
import CustomModal from "../Modal/Modal";
import { ethereumIcon } from "../../BloIcons/EthereumIcon";
import { useEffect } from "react";
import {
  updateSectionService,
  addSectionService,
} from "../../services/nftServices";
const useStyles = makeStyles({
  containerHeader: {
    height: "65px",
    background: "#383F4E",
    display: "flex",
    alignItems: "center",
  },
  logoHeader: {
    font: "900 25px/25px  Roboto",
    fontVariant: "all-small-caps",
    letterSpacing: "1px",
    color: "#fff",
    padding: "20px 90px",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "350px ",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
});

function NFTHeader() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});
  let loading = nftReducer.loading || false;
  const [clickType, setClickType] = React.useState("");
  const [responseCode, setResponseCode] = React.useState(false);

  const { nftID } = router.query;

  useEffect(() => {
    dispatch(actions.profileActions.getUserProfile());
  }, []);

  const handleAddUpdateSectionAPI = async () => {
    let sectionLength = nftReducer.sectionList?.length;
    let sectionList = nftReducer.sectionList;
    for (var i = 0; i < sectionLength; i++) {
      if (sectionList[i]?.attributes?.content) {
        const payload = {
          content: sectionList[i]?.attributes?.content,
        };
        if (
          sectionList[i]?.attributes?.content !==
          "<h5>My Stories (Title Example)</h5><p> In this section, you can add customized content to tell your own stories and additional details related to your NFT, so that your potential NFT buyers can have a richer understanding of your NFT.</p>"
        )
          if (sectionList[i]?.id) {
            await updateSectionService(payload, nftID, sectionList[i]?.id);
            // dispatch(
            //   actions.nftActions.updateSectionAction(
            //     false,
            //     payload,
            //     nftID,
            //     sectionList[i]?.id
            //   )
            // );
          } else {
            await addSectionService(payload, nftID);
            // dispatch(
            //   actions.nftActions.addSectionAction(false, payload, nftID)
            // );
          }
      }
    }
  };

  const saveToDraftHandler = (type) => {
    dispatch(actions.nftActions.setFieldTouched(false));
    if (nftReducer?.nftEditData?.description) {
    } else {
      delete nftReducer?.nftEditData?.description;
    }
    let splitValue = window?.location.pathname.split("/");
    let nftID = splitValue[splitValue.length - 2];
    nftReducer.nftEditData.properties =
      nftReducer?.nftEditData?.properties?.filter((each) => {
        if (each.name && each.value) {
          return each;
        }
      });
    nftReducer.nftEditData.tags = nftReducer?.nftEditData?.tags?.filter(
      (each) => {
        if (each) {
          return each;
        }
      }
    );

    if (type === "LAZY_MINT") {
      if (
        (nftReducer.nftEditData &&
          nftReducer.nftEditData.assets &&
          nftReducer.nftEditData.assets.length) ||
        (nftReducer.nftInfoById &&
          nftReducer.nftInfoById.assets &&
          nftReducer.nftInfoById.assets.length)
      ) {
        nftReducer.nftEditData.status = "lazy";
        setClickType("LAZY_MINT");
        handleAddUpdateSectionAPI();
        setOpenLazyModal(false);
        setAnchorEl(null);
        dispatch(
          actions.nftActions.updateNFTAction(
            true,
            nftReducer.nftEditData,
            nftID,
            "LAZY_MINT",
            (type) => {
              if (type === true) {
                setResponseCode(true);
                setOpenLazyModal(false);
              } else {
                setResponseCode(false);
                setOpenLazyModal(true);
              }
            }
          )
        );
      } else {
        dispatch(
          actions.commonActions.displaySnackbar(
            "Please associate a multimedia asset with this NFT before proceeding with minting.",
            "error"
          )
        );
      }
    } else if (type === "LOCK_MINT") {
      if (
        (nftReducer.nftEditData &&
          nftReducer.nftEditData.assets &&
          nftReducer.nftEditData.assets.length) ||
        (nftReducer.nftInfoById &&
          nftReducer.nftInfoById.assets &&
          nftReducer.nftInfoById.assets.length)
      ) {
        setClickType("LOCK_MINT");
        handleAddUpdateSectionAPI();
        setOpenModal(false);
        setAnchorEl(null);
        nftReducer.nftEditData.status = "live";
        dispatch(
          actions.nftActions.updateNFTAction(
            true,
            nftReducer.nftEditData,
            nftID,
            "LOCK_MINT",
            (type) => {
              if (type === true) {
                setResponseCode(true);
                setOpenModal(false);
              } else {
                setResponseCode(false);
                setOpenModal(true);
              }
            }
          )
        );
      } else {
        dispatch(
          actions.commonActions.displaySnackbar(
            "Please associate a multimedia asset with this NFT before proceeding with minting.",
            "error"
          )
        );
      }
    } else {
      setClickType("SAVE_DRAFT");
      handleAddUpdateSectionAPI();
      dispatch(
        actions.nftActions.updateNFTAction(
          true,
          nftReducer.nftEditData,
          nftID,
          "SAVE_DRAFT",
          (type) => {
            if (type === true) {
              //dispatch(actions.nftActions.getNFTInfoByID(nftID));
              setResponseCode(true);
            } else {
              setResponseCode(false);
            }
          }
        )
      );
    }
  };

  const redirectToNFT = () => {
    dispatch(actions.nftActions.setShowAlert(false));
    dispatch(actions.commonActions.setModalState(false));
    dispatch(actions.nftActions.setNftData({}));
    router.push("/nfts", undefined, { shallow: true });
  };

  const handleLogoutClick = () => {
    // if (
    //   nftReducer &&
    //   nftReducer.nftEditData &&
    //   Object.keys(nftReducer.nftEditData).length
    // ) {
    //   dispatch(actions.nftActions.setShowAlert(true));
    //   dispatch(actions.commonActions.setModalState(true));
    // } else {
    //   router.push("/nfts", undefined, { shallow: true });
    // }

    if (nftReducer && nftReducer?.setFieldTouched) {
      dispatch(actions.nftActions.setShowAlert(true));
      dispatch(actions.commonActions.setModalState(true));
    } else {
      router.push("/nfts", undefined, { shallow: true });
    }
  };
  const handleAlertClose = () => {
    dispatch(actions.nftActions.setShowAlert(false));
    dispatch(actions.commonActions.setModalState(false));
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseLazyModal = () => {
    setOpenLazyModal(false);
  };
  const [openModal, setOpenModal] = React.useState(false);
  const [openLazyModal, setOpenLazyModal] = React.useState(false);

  const handleMobileView = () => {
    dispatch(actions.nftActions.setMobileview(true));
  };

  const handleWebView = () => {
    dispatch(actions.nftActions.setMobileview(false));
  };

  return (
    <>
      {nftReducer.setShowAlert && (
        <CustomModal isCloseButton={true} onClose={handleAlertClose}>
          <Box sx={{ width: "400px", m: "15px" }}>
            <Typography
              sx={{ fontSize: "20px", fontWeight: 900, mt: "40px", pl: "10px" }}
            >
              Are you sure you want to close?
            </Typography>
            <Typography
              sx={{
                width: "82%",
                color: "rgba(255, 255, 255, 0.7)",
                p: "10px",
              }}
            >{`You have unsaved changes on your NFT. Are you sure you want to close without saving?`}</Typography>
            <Box sx={{ float: "right", mt: "30px" }}>
              <Button
                onClick={handleAlertClose}
                sx={{
                  mr: "10px",
                  border: "1px solid",
                  color: "#B6AEF6",
                  borderColor: "#B6AEF6",
                  "&:hover": {
                    background: "rgba(119, 82, 224, 0.08)",
                  },
                }}
              >
                CONTINUE EDITING
              </Button>
              <Button
                onClick={redirectToNFT}
                sx={{
                  margin: 0,
                  color: "#FFF",
                  background: "#EE463C",
                  "&:hover": { background: "#A73129" },
                }}
              >
                CLOSE
              </Button>
            </Box>
          </Box>
        </CustomModal>
      )}
      {loading && (
        <LoadingIndicator
          isModal={true}
          title={
            clickType === "SAVE_DRAFT"
              ? "Saving Draft..."
              : clickType === "LAZY_MINT"
              ? "Lazy minting"
              : clickType === "LOCK_MINT"
              ? "Confirming your transaction..."
              : null
          }
        />
      )}
      {responseCode && clickType === "LAZY_MINT" ? (
        <SuccessModal
          text={NFT_LAZYMINT_CONGRALATIONS}
          open={true}
          onActionButtonClick={() =>
            router.push("/nfts", undefined, { shallow: true })
          }
          showActionButton={true}
          actionButtonText={"GO TO MY NFT WALLET"}
          subText={NFT_LAZYMINT_CONGRALATIONS_SUBTEXT}
          subTextDisplay={true}
        />
      ) : null}

      {responseCode && clickType === "LOCK_MINT" ? (
        <SuccessModal
          text={NFT_LOCKMINT_CONGRALATIONS}
          open={true}
          onActionButtonClick={() =>
            router.push("/nfts", undefined, { shallow: true })
          }
          showActionButton={true}
          actionButtonText={"GO TO MY NFT WALLET"}
          subText={NFT_LOCKMINT_CONGRALATIONS_SUBTEXT}
          subTextDisplay={true}
        />
      ) : null}

      <Grid className={`top-bar ${classes.containerHeader}`}>
        <Grid item xs={12} style={{ width: "100%" }}>
          <div className={classes.leftSection}>
            <Box
              onClick={handleLogoutClick}
              sx={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LogoutIcon />
              <span
                style={{
                  fontSize: "15px",
                  marginLeft: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.46px",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.56)",
                }}
              >
                Exit
              </span>{" "}
            </Box>
            <div className={classes.rightSection}>
              <DesktopHeaderIcon
                onClick={handleWebView}
                style={{ marginRight: "16px", cursor: "pointer" }}
                fill={nftReducer.isMobileView ? "#fff" : "#24d182"}
              />
              <MobileHeaderIcon
                onClick={handleMobileView}
                style={{ marginRight: "16px", cursor: "pointer" }}
                fill={nftReducer.isMobileView ? "#24d182" : "#fff"}
              />
              {nftReducer &&
                nftReducer.nftInfoById &&
                nftReducer.nftInfoById.status &&
                nftReducer.nftInfoById.status === "draft" && (
                  <Button
                    variant="outlined"
                    sx={{
                      mr: 0,
                      color: "#B6AEF6",
                      borderColor: "#B6AEF6",
                      "&:hover": {
                        background: "rgba(119, 82, 224, 0.08)",
                        borderColor: "#B6AEF6",
                      },
                    }}
                    onClick={() => saveToDraftHandler("SAVE_DRAFT")}
                  >
                    SAVE DRAFT
                  </Button>
                )}
              <Button
                color="primary"
                onClick={handleClick}
                variant="contained"
                sx={{ ml: "10px" }}
              >
                MINT
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    if (
                      (nftReducer.nftEditData &&
                        nftReducer.nftEditData.assets &&
                        nftReducer.nftEditData.assets.length) ||
                      (nftReducer.nftInfoById &&
                        nftReducer.nftInfoById.assets &&
                        nftReducer.nftInfoById.assets.length)
                    ) {
                      setOpenLazyModal(true);
                    } else {
                      dispatch(
                        actions.commonActions.displaySnackbar(
                          "Please associate a multimedia asset with this NFT before proceeding with minting.",
                          "error"
                        )
                      );
                    }
                  }}
                  sx={{ width: "210px" }}
                >
                  <LazyMintIcon />
                  <ListItemText style={{ marginLeft: "5%" }}>
                    Lazy mint (no gas fee)
                  </ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (
                      (nftReducer.nftEditData &&
                        nftReducer.nftEditData.assets &&
                        nftReducer.nftEditData.assets.length) ||
                      (nftReducer.nftInfoById &&
                        nftReducer.nftInfoById.assets &&
                        nftReducer.nftInfoById.assets.length)
                    ) {
                      setOpenModal(true);
                    } else {
                      dispatch(
                        actions.commonActions.displaySnackbar(
                          "Please associate a multimedia asset with this NFT before proceeding with minting.",
                          "error"
                        )
                      );
                    }
                  }}
                >
                  {ethereumIcon()}
                  <ListItemText sx={{ ml: "5px" }}>Lock and mint</ListItemText>
                </MenuItem>
              </Menu>
              <LockAndMintModal
                open={openModal}
                handleClose={handleCloseModal}
                setOpen={setOpenModal}
                handleLockmintSubmit={saveToDraftHandler}
              />
              <LazyMintModal
                open={openLazyModal}
                handleClose={handleCloseLazyModal}
                setOpen={setOpenLazyModal}
                handleLazymintSubmit={saveToDraftHandler}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default NFTHeader;
