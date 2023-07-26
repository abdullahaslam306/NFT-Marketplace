import React, { useState } from "react";

import { Button, Grid, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import { AssetListing } from "./AssetListing";
import { AssetsTab } from "./AssetsTab";
import FileUplaodModal from "./Modals/FileUploadModal";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  updateFetchedAllAssets,
  updateGetAssetsSuccess,
  updateSearchAssetQuery,
} from "src/actions/assetsActions";
import useAssetsStyles from "./AssetmanagmentStyles";
import { useDispatch } from "react-redux";
import AssetUploadTag from "../assetUploadTag";
import { useSelector } from "react-redux";

const AssetManagement = ({ isModal, heading, handleSelectedAssetForNFT }) => {
  const assetsManageClasses = useAssetsStyles();
  const [assetUploadTag, setAssetUploadTag] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const router = useRouter();
  const profileReducer = useSelector(
    (state) => (state && state.profileReducer) || {}
  );
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);

  const tabs = [
    {
      index: 0,
      component: (
        <AssetListing
          isModal={isModal}
          selectAssetForNFT={handleSelectedAssetForNFT}
        />
      ),
      label: "All Categories",
    },
    {
      index: 1,
      component: (
        <AssetListing
          isModal={isModal}
          selectAssetForNFT={handleSelectedAssetForNFT}
          filter="image"
        />
      ),
      label: "Images",
    },
    {
      index: 2,
      component: (
        <AssetListing
          isModal={isModal}
          selectAssetForNFT={handleSelectedAssetForNFT}
          filter="video"
        />
      ),
      label: "Videos",
    },
    {
      index: 3,
      component: (
        <AssetListing
          isModal={isModal}
          selectAssetForNFT={handleSelectedAssetForNFT}
          filter="audio"
        />
      ),
      label: "Audio",
    },
    {
      index: 4,
      component: <AssetListing filter="3d_model" />,
      label: "3D Models",
    },
  ];

  const openOrCloseFileUploadModal = (value = true) => {
    setAssetUploadTag(true);
    setShowFileUploadModal(value);
    setTimeout(() => {
      setAssetUploadTag(false);
    });
  };

  useEffect(() => {
    return () => {
      dispatch(updateSearchAssetQuery(""));
      dispatch(updateGetAssetsSuccess([]));
      dispatch(updateFetchedAllAssets(false));
    };
  }, []);

  return (
    <>
      {assetUploadTag && (
        <AssetUploadTag email={profileReducer.userProfile?.email || ""} />
      )}
      <FileUplaodModal
        modalState={showFileUploadModal}
        modalStyles={assetsManageClasses.modal}
        closeModal={openOrCloseFileUploadModal}
      />
      <Grid
        container
        className={assetsManageClasses.container}
        sx={{ padding: matches ? "3rem" : "16px" }}
      >
        <Grid
          sx={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            justifyContent: "space-between",
          }}
          item
          xs={12}
          md={12}
        >
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 900,
              pb: "20px",
            }}
          >
            {heading ?? isMobile ? "Assets" : "Multimedia Assets"}
          </Typography>
          {isMobile && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => openOrCloseFileUploadModal()}
              className={assetsManageClasses.uploadFileButtonMobile}
            >
              Upload File
            </Button>
          )}
          {!isMobile && (
            <>
              {isModal ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => openOrCloseFileUploadModal()}
                  className={assetsManageClasses.uploadFileButtonManage}
                >
                  Upload new files
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    marginTop: 0,
                    marginRight:
                      window.screen.width === 1920
                        ? "1.5rem"
                        : window.screen.width === 1440
                        ? "0.9rem"
                        : "0",
                  }}
                  onClick={() => openOrCloseFileUploadModal()}
                  className={assetsManageClasses.uploadFileButton}
                >
                  Upload File
                </Button>
              )}
            </>
          )}
        </Grid>
        <>
          <AssetsTab isModal={isModal} tabPanels={tabs} tabType="Wallet" />
        </>
      </Grid>
    </>
  );
};

export default AssetManagement;
