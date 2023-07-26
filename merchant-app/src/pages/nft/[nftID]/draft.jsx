import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import Drawer from "../../../components/Drawer/Drawer";
import NFTHeader from "../../../components/NFTHeader/NFTHeader";
import Image from "next/image";
import {
  AdditionalSection,
  TopSection,
  Description,
} from "../../../components/MintNFTDashboard";
// import Modal from "../../../components/Modal/ModalV2";
import SelectAssetsModal from "../../../components/SelectAssetToModal/SelectAssetModal";
import { Box, Typography, Grid, Button, Backdrop, Modal } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../../actions";
import { getTempCredentialsForAsset } from "src/services/assetsService";
import { downloadS3SignedURL } from "src/utils/s3Upload";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

// const DynamicComponentDrawer = dynamic(() => import('../../../components/Drawer/Drawer'))
// const DynamicComponentAdditionalSection = dynamic(() => import('../../../components/MintNFTDashboard/AdditionalSection'))
// const DynamicComponentTopSection = dynamic(() => import('../../../components/MintNFTDashboard/TopSection'))
// const DynamicComponentDescription = dynamic(() => import('../../../components/MintNFTDashboard/Description'))

function MintNft() {
  const dispatch = useDispatch();
  const [selectedAsset, setSelectedAsset] = useState();
  const [thumbnailPath, setThumbnailPath] = useState();
  const [showDefaultThumbail, setShowDefaultThumbail] = useState(true);
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});
  const router = useRouter();
  const { nftID } = router.query;

  const hanldeRemoveAssetFromNFT = () => {
    setSelectedAsset(() => null);
    setThumbnailPath(() => null);
    setShowDefaultThumbail(() => null);
    dispatch(actions.nftActions.setNftData({ assets: [] }));
  };

  useEffect(() => {
    if (nftID) {
      dispatch(actions.nftActions.getNFTInfoByID(false, nftID));
      dispatch(actions.nftActions.getBlockChainInfoByIDAction(false, nftID));
      dispatch(
        actions.nftActions.getTransactionHistoryByIDAction(false, nftID)
      );
      dispatch(actions.nftActions.getSectionListAction(false, nftID));
    }
  }, [nftID]);

  const handleDeleteSection = (sectionID, index) => {
    if (sectionID) {
      dispatch(actions.nftActions.deleteSectionAction(false, nftID, sectionID));
    } else {
      nftReducer.sectionList.splice(index, 1);
      dispatch(actions.nftActions.setSectionData(nftReducer.sectionList));
    }
  };

  const [updateSection, setupdateSection] = useState("");
  const [updateSectionId, setupdateSectionId] = useState(null);
  const [newSectionId, setnewSectionId] = useState(null);
  const [sectionEditEnable, setSectionEditEnable] = useState(false);

  const handleAddSection = () => {
    nftReducer.sectionList.push({
      attributes: {
        content:
          "<h5>My Stories (Title Example)</h5><p> In this section, you can add customized content to tell your own stories and additional details related to your NFT, so that your potential NFT buyers can have a richer understanding of your NFT.</p>",
      },
    });
    nftReducer.textEditorDataSectionList = [
      {
        attributes: {
          content:
            "<h5>My Stories (Title Example)</h5><p> In this section, you can add customized content to tell your own stories and additional details related to your NFT, so that your potential NFT buyers can have a richer understanding of your NFT.</p>",
        },
      },
    ];

    dispatch(actions.nftActions.setSectionData(nftReducer.sectionList));
    dispatch(
      actions.nftActions.setEditedSectionData(
        nftReducer.textEditorDataSectionList
      )
    );
    dispatch(actions.nftActions.setExpandedPanel("panel9"));
    setSectionEditEnable(true);
    setupdateSectionId(nftReducer.sectionList?.length - 1);
    dispatch(actions.nftActions.setFieldTouched(true));
  };

  const handleChangeSection = (sectionContent) => {
    setupdateSection(sectionContent);
    if (
      nftReducer.sectionList &&
      nftReducer.sectionList[updateSectionId] &&
      nftReducer.sectionList[updateSectionId].attributes
    ) {
      nftReducer.sectionList[updateSectionId].attributes.content =
        sectionContent;
    }
    dispatch(actions.nftActions.setSectionData(nftReducer.sectionList));
  };

  const handleupdateSection = (id) => {
    nftReducer.textEditorDataSectionList = [
      {
        attributes: {
          content: nftReducer.sectionList[id]?.attributes?.content,
        },
      },
    ];
    dispatch(
      actions.nftActions.setEditedSectionData(
        nftReducer.textEditorDataSectionList
      )
    );
    setupdateSectionId(id);
    setSectionEditEnable(true);
  };

  useEffect(() => {
    if (nftID && nftReducer.nftInfoById?.assets?.[0]?.thumbnailPath) {
      getTempCredentialsForAsset().then((res) => {
        if (nftReducer.nftInfoById?.assets?.[0]?.thumbnailPath) {
          downloadS3SignedURL(
            res,
            nftReducer.nftInfoById?.assets?.[0].thumbnailPath,
            nftReducer.nftInfoById?.assets?.[0].bucketName
          ).then((thumbnail) => {
            setThumbnailPath(thumbnail);
          });
        }
      });
    } else {
      setThumbnailPath();
    }
  }, [nftReducer.nftInfoById?.assets]);

  // useEffect(()=>{
  //   return ()=>{
  //     dispatch(actions.nftActions.clearNFTInfoByID())
  //   }
  // },[])

  const updateSelectedAsset = (val) => {
    setShowDefaultThumbail(true);
    setSelectedAsset(val);
  };

  const closeHelpModal = () => {
    dispatch(actions.nftActions.showHelpModal(false));
  };

  return (
    <Layout>
      {nftReducer.showHelpModal && (
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
                width: "882px",
                minHeight: "200px",
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
              <Button
                onClick={closeHelpModal}
                style={{
                  position: "absolute",
                  right: "-5px",
                  zIndex: "1",
                  marginRight: "0.5rem",
                }}
              >
                <CloseSharpIcon
                  sx={{
                    width: "1.7rem",
                    height: "1.7rem",
                  }}
                  color="error"
                />
              </Button>
              <Box sx={{ pl: 2, pt: 5 }}>
                <Grid container sx={{ mt: 2, mb: 0 }}>
                  <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src="/images/art-book.png"
                        alt="important"
                        width="95px"
                        height="96px"
                      />
                    </div>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: "24px",
                        textAlign: "center",
                      }}
                    >
                      Welcome to the NFT editor
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 400,
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      Left sidebar is for editing, right window is for preview.
                      Clicking on any area on the right window will open the
                      designated area on the left sidebar editor for editing.
                    </Typography>
                    <Button
                      sx={{ mt: 2 }}
                      color="primary"
                      variant="outlined"
                      type={"submit"}
                      margin={"16px 0 0 0"}
                      onClick={closeHelpModal}
                    >
                      {" "}
                      Confirm{" "}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <img
                      src="https://blocommerce-logo.s3.amazonaws.com/Video-Minting.gif"
                      width="100%"
                      height="400px"
                    ></img>
                    {/* <Image
                  src=""
                  alt="important"
                 
                /> */}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
      <SelectAssetsModal setSelectedAsset={updateSelectedAsset} />
      <Drawer
        isNFT={true}
        selectedAsset={selectedAsset}
        thumbnailPath={thumbnailPath}
        showDefaultThumbail={showDefaultThumbail}
        handleChangeSection={handleChangeSection}
        updateSectionId={updateSectionId}
        sectionEditEnable={sectionEditEnable}
        hanldeRemoveAssetFromNFT={hanldeRemoveAssetFromNFT}
      />
      <NFTHeader selectedAsset={selectedAsset} />
      {!nftReducer.isMobileView ? (
        <div style={{ width: `calc(100% / 350px})`, marginLeft: "350px" }}>
          <div style={{ padding: "48px", minHeight: "400px" }}>
            <div className="edit-nft container">
              <div className="content">
                <TopSection
                  selectedAsset={selectedAsset}
                  thumbnailPath={thumbnailPath}
                  showDefaultThumbail={showDefaultThumbail}
                  hanldeRemoveAssetFromNFT={hanldeRemoveAssetFromNFT}
                />
                <div className="content-container-single">
                  <Description isEdit={true} tabType="upload" />
                </div>
                <div className="content-container-single">
                  <Divider sx={{ marginBottom: "20px" }} />
                </div>
                <div className="content-container-single">
                  <AdditionalSection
                    nftID={nftID}
                    handleDeleteSection={handleDeleteSection}
                    handleupdateSection={handleupdateSection}
                    handleAddSection={handleAddSection}
                    updateSectionId={updateSectionId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Box sx={{ ml: "350px" }}>
          <Box width="400px" sx={{ margin: "auto", background: "#383F4E" }}>
            <TopSection
              selectedAsset={selectedAsset}
              showDefaultThumbail={showDefaultThumbail}
              thumbnailPath={thumbnailPath}
            />
            <Box
              sx={{
                marginLeft: "24px",
                marginRight: "24px",
                paddingBottom: "24px",
              }}
            >
              <AdditionalSection
                nftID={nftID}
                handleDeleteSection={handleDeleteSection}
                handleupdateSection={handleupdateSection}
                handleAddSection={handleAddSection}
                updateSectionId={updateSectionId}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Layout>
  );
}

export default MintNft;
