import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import {
  Typography,
  Container,
  Grid,
  CircularProgress,
  useMediaQuery,
  Radio,
  Box,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Image from "next/image";
import { VideoCameraBack } from "@mui/icons-material";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Calendar from "@mui/icons-material/CalendarToday";
import Attachment from "@mui/icons-material/AttachFile";
import MenuIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { format } from "date-fns";
import { createStyles, makeStyles } from "@mui/styles";
import {
  getAllAssets,
  updateIsDeletingAsset,
} from "../../actions/assetsActions";
import { actions } from "../../actions";
import BasicMenu from "../Menu/Menu";
import SuccessModal from "../successModal/index";
import EditFileModal from "./Modals/EditFileModal";
import DragAndDropThumbnailModal from "./Modals/DragAndDropThumbnailModal";
import bytesToSize from "../../utils/bytesToSize";
import { useTheme } from "@mui/system";
import FileUplaodModal from "./Modals/FileUploadModal";
import {
  deleteAsset,
  getTempCredentialsForAsset,
} from "../../services/assetsService";
import { downloadS3SignedURL } from "../../utils/s3Upload";
import Audio from "../../../public/images/Audio.png";
import ThreeD from "../../../public/images/3D.png";
import Video from "../../../public/images/Video.png";
import SuccessFileDeletedModal from "../SuccessFileDeletedModal";
import DeleteFileModal from "./Modals/DeleteFileModal";
import CustomModal from "../Modal/Modal";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import DeleteFileModalError from "./Modals/DeleteFileModalError";

const useSectionStyle = makeStyles((theme) =>
  createStyles({
    container: {
      padding: 0,
    },
    buttonClass: {
      margin: "10px 5px",
      marginTop: "30px",
      ["@media (min-width:900px)"]: {
        position: "relative",
        left: "275px",
      },
    },
    imgStyle: {
      width: "100%",
      objectFit: "contain",
      height: "15rem",
      display: "flex",
      borderRadious: "5px",
      padding: "0.5rem",
      margin: "auto",
      [theme.breakpoints.down("sm")]: {
        height: "10rem",
      },
    },
    calenderIcon: {
      marginTop: "0.9rem",
      marginLeft: "1rem",
      [theme.breakpoints.down("sm")]: {
        marginLeft: "0.5rem",
      },
    },
    sizeIcon: {
      marginTop: "0.9rem",
      marginLeft: "1rem",
      [theme.breakpoints.down("sm")]: {
        marginLeft: "0.5rem",
      },
    },
    asset: {
      cursor: "pointer",
      width: "100%",
      height: "15rem",
      backgroundColor: "#383F4E",
      [theme.breakpoints.down("sm")]: {
        height: "10rem",
      },
    },
    assetName: {
      margin: "0.9rem",
      width: "13rem",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      [theme.breakpoints.down("md")]: {
        width: "10rem",
      },
      [theme.breakpoints.down("sm")]: {
        width: "5rem",
      },
    },
    menuContainer: {
      margin: "0.8rem",
      marginRight: "0.5rem",
    },
    listing: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      gap: "1rem",
      [theme.breakpoints.down("md")]: {
        gap: "0.3rem",
      },
    },
    assetSize: {
      paddingTop: "0.9rem",
      marginLeft: "0.3rem",
    },
    assetDate: {
      paddingTop: "0.9rem",
      marginLeft: "0.5rem",
    },
    card: {
      // flex: "0 0 33%",
    },
    assetParent: {
      display: "flex",
      height: "3rem",
      width: "100%",
      margin: "auto",
      background: "#4A505E",
      borderRadius: "5px 5px 0px 0px",
    },
    assetFooter: {
      display: "flex",
      height: "5rem",
      width: "100%",
      margin: "auto",
      background: "#4A505E",
      borderRadius: "5px 5px 0px 0px",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
      },
    },
    iconAndDetail: {
      display: "flex",
    },
  })
);
const useAssetsStyles = makeStyles((theme) =>
  createStyles({
    parent: {
      display: "flex",
    },
    container: {
      padding: 0,
    },
    column: {
      padding: "0 10px",
    },
    card: {
      margin: "0 auto",
      textAlign: "center",
      transition: "0.3s",
      "&:hover": {
        boxShadow: "10px 10px 37px 8px rgba(0,0,0,0.75)",
        backgroundColor: "#383F4E",
      },
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
    iconWrapper: {
      padding: "30%",
      paddingBottom: "14%",
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
  })
);
let anchorEl = null;

function Model(props) {
  const { scene } = useGLTF(props.imgUrl);
  return <primitive object={scene} />;
}

export function AssetListing({ filter, isModal, selectAssetForNFT, search }) {
  const theme = useTheme();
  const classes = useSectionStyle(theme);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const assetsManageClasses = useAssetsStyles();
  const [showAssetPreviewModal, setshowAssetPreviewModal] = useState(false);
  const [assetType, setassetType] = useState("image");
  const [assetSrc, setassetSrc] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [threedSrc, setthreedSrc] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [hoverId, sethoverId] = useState("");
  const [successModalText, setSuccessModalText] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [assetsList, setAssetsList] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletingFile, setDeletingFile] = useState(false);
  const [showEditFileModal, setShowEditFileModal] = useState(false);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [showDeleteFileErrorModal, setShowDeleteFileErrorModal] =
    useState(false);
  const [showSuccessDeleteFileModal, setShowSuccessDeleteFileModal] =
    useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedAssetForNFT, setSelectedAssetForNFT] = useState();
  const [tempCred, setTempCredentials] = useState({});
  const [showUpdateThumbnailModal, setShowUpdateThumbnailModal] =
    useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [isMute, setisMute] = useState(true);
  const [prevSearchQuery, setPrevSearchQuery] = useState("");

  const muteclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setisMute(!isMute);
  };
  const assetsListFromStore = useSelector(
    (state) => state?.assetsReducer?.assetsList || []
  );
  const isLoading = useSelector((state) => state?.assetsReducer?.loading);
  const fetchedAllAssets = useSelector(
    (state) => state?.assetsReducer?.fetchedAllAssets
  );
  const searchQuery = useSelector((state) => state?.assetsReducer?.searchQuery);

  const openOrCloseFileUploadModal = (value = true) => {
    setShowFileUploadModal(value);
  };

  useEffect(() => {
    setPageNumber(() => 0);
  }, [searchQuery]);

  const handleMenuClick = (e, asset) => {
    anchorEl = e.currentTarget;
    setSelectedAsset(asset);
    setOpen(true);
  };

  const closeModals = () => {
    setShowEditFileModal(false);
    setShowUpdateThumbnailModal(false);
    setShowDeleteFileModal(false);
    setShowDeleteFileErrorModal(false);
  };

  const handleShowSuccessModal = (text) => {
    setSuccessModalText(text);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 4000);
  };

  const observer = React.useRef();
  const lastCardElementRef = React.useCallback(
    (node) => {
      if (isLoading || fetchedAllAssets) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  const handleAssetPreview = async (event) => {
    setshowAssetPreviewModal(true);
    if (event.currentTarget && event.currentTarget.attributes.type) {
      setassetType(event.currentTarget.attributes.type.value);
    }
    setassetSrc(event.currentTarget.attributes.src.value);
    if (
      event.currentTarget &&
      event.currentTarget.attributes.type.value === "video"
    ) {
      setVideoSrc(
        await downloadS3SignedURL(
          tempCred,
          event.currentTarget.attributes.src.value
        )
      );
    }
    if (
      event.currentTarget &&
      event.currentTarget.attributes.type.value === "3d_model"
    ) {
      setthreedSrc(
        await downloadS3SignedURL(
          tempCred,
          event.currentTarget.attributes.src.value
        )
      );
    }
    if (
      event.currentTarget &&
      event.currentTarget.attributes.type.value === "audio"
    ) {
      setAudioSrc(
        await downloadS3SignedURL(
          tempCred,
          event.currentTarget.attributes.src.value
        )
      );
    }
    dispatch(actions.commonActions.setModalState(true));
  };

  const handleHover = async (event) => {
    sethoverId(event.currentTarget.attributes.assetId.value);
    if (
      event.currentTarget &&
      event.currentTarget.attributes.type.value === "video"
    ) {
      setVideoSrc(
        await downloadS3SignedURL(
          tempCred,
          event.currentTarget.attributes.src.value
        )
      );
    } else {
      sethoverId("");
    }
  };

  const handleLeaveHover = async (event) => {
    sethoverId("");
  };

  useEffect(() => {
    if (!fetchedAllAssets && prevSearchQuery === searchQuery) {
      const assetsParams = {
        displayLoader: true,
        filter,
        pageNumber,
        searchQuery,
      };
      dispatch(getAllAssets(assetsParams));
    }
    setPrevSearchQuery(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, filter, searchQuery, prevSearchQuery]);

  useEffect(() => {
    if (Object.keys(tempCred).length > 0) return;

    getTempCredentialsForAsset().then((res) => {
      setTempCredentials(res);
    });
  }, [assetsListFromStore]);

  useEffect(() => {
    if (assetsListFromStore.length === 0) {
      setAssetsList([]);
      return;
    }

    const newAssetsList = assetsListFromStore.map(async (asset) => {
      const newAsset = { ...asset };
      if (
        (asset.attributes.thumbnailPath || asset.attributes.originalPath) &&
        Object.keys(tempCred).length > 0
      ) {
        const thumbnail = await downloadS3SignedURL(
          tempCred,
          asset.attributes.thumbnailPath ||
            (asset.attributes.type === "image" && asset.attributes.originalPath)

          // asset.attributes.fileExtension === "svg"
          //   ? "svg+xml"
          //   : asset.attributes.fileExtension
        );
        newAsset.attributes.thumbnailData = thumbnail;
      }
      return newAsset;
    });
    Promise.all(newAssetsList).then((res) => {
      setAssetsList(res);
    });
  }, [assetsListFromStore, tempCred]);

  const menuProps = {
    anchorEl,
    onClose: () => setOpen(false),
    open,
    menuItems: [
      {
        label: "Update thumbnail",
        onClick: () => {
          setShowUpdateThumbnailModal(true);
          setOpen(false);
        },
      },
      {
        label: "Rename",
        onClick: () => {
          setShowEditFileModal(true);
          setOpen(false);
        },
      },
      {
        label: "Delete",
        onClick: () => {
          setShowDeleteFileModal(true);
          setOpen(false);
        },
      },
    ],
  };

  const handleDeleteAsset = async () => {
    try {
      dispatch(updateIsDeletingAsset(true));
      setDeletingFile(true);
      await deleteAsset(selectedAsset?.id);
      setShowSuccessDeleteFileModal(true);
      setShowDeleteFileModal(false);
      setDeletingFile(false);
      dispatch(getAllAssets({ displayLoader: true, refresh: true }));
      // To auto close success modal
      setTimeout(() => {
        setShowSuccessDeleteFileModal(false);
      }, 4800);
    } catch (error) {
      // dispatch(actions.commonActions.displaySnackbar(error.message));De
      if (error.response.data.responseCode === "AssetIsNftException")
        setShowDeleteFileErrorModal(true);
      setDeletingFile(false);
    }
  };

  const handleSelectedAssetForNFT = ({
    attributes: { type, thumbnailData },
    id,
  }) => {
    const assetData = {
      id,
      thumbnail: thumbnailData,
      type,
    };
    setSelectedAssetForNFT(assetData);
    selectAssetForNFT(assetData);
  };

  const handlePreviewModalClose = () => {
    setshowAssetPreviewModal(false);
    dispatch(actions.commonActions.setModalState(false));
  };

  return (
    <>
      <FileUplaodModal
        modalState={showFileUploadModal}
        modalStyles={assetsManageClasses.modal}
        closeModal={openOrCloseFileUploadModal}
      />
      {isLoading && assetsList.length === 0 ? (
        <div style={{ minHeight: "75vh" }}>
          <CircularProgress
            className={assetsManageClasses.loading}
            color="primary"
          />
        </div>
      ) : (
        <>
          {showAssetPreviewModal && assetType && assetSrc && (
            <CustomModal
              showModal={showAssetPreviewModal}
              isCloseButton={true}
              onClose={handlePreviewModalClose}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "50px",
                  height: isMobile ? "auto" : "80vh",
                  minWidth: isMobile ? "90%" : isTab ? "750px" : "900px",
                }}
              >
                {assetType === "image" && (
                  <img
                    src={assetSrc}
                    alt={"Image Not Available"}
                    style={{ maxWidth: "80%", maxHeight: "90%" }}
                  />
                )}
                {assetType === "video" && (
                  <video
                    width="100%"
                    height="auto"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    autoPlay={true}
                    controls
                    muted={false}
                  >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>
                )}
                {assetType === "audio" && (
                  <audio controls src={audioSrc} controlsList="nodownload">
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                )}
                {assetType === "3d_model" && (
                  <Canvas
                    pixelRatio={[1, 2]}
                    camera={{
                      position: [-10, 15, 15],
                      fov: 60,
                      scale: 1,
                      zoom: 5,
                    }}
                  >
                    <ambientLight intensity={1} />
                    <Suspense fallback={null}>
                      <Model imgUrl={threedSrc} />
                    </Suspense>
                    <OrbitControls />
                  </Canvas>
                )}
              </Box>
            </CustomModal>
          )}
          <Container
            style={{
              padding: "0px",
              minHeight: "80vh",
              display: assetsList?.length === 0 && "grid",
              placeItems: assetsList?.length === 0 && "center",
            }}
            className={classes.container}
          >
            <SuccessModal
              text={successModalText}
              open={showSuccessModal}
              closeModal={() => setShowSuccessModal(false)}
            />
            <EditFileModal
              modalState={showEditFileModal}
              selectedAsset={selectedAsset}
              closeModal={closeModals}
              handleShowSuccessModal={handleShowSuccessModal}
            />
            <DeleteFileModal
              open={showDeleteFileModal}
              selectedAsset={selectedAsset}
              deletingFile={deletingFile}
              closeModal={closeModals}
              handleDeleteAsset={handleDeleteAsset}
            />
            <DeleteFileModalError
              open={showDeleteFileErrorModal}
              closeModal={closeModals}
              selectedAsset={selectedAsset}
            />
            <SuccessFileDeletedModal
              open={showSuccessDeleteFileModal}
              text="File deleted successfully"
            />
            <DragAndDropThumbnailModal
              modalState={showUpdateThumbnailModal}
              selectedAsset={selectedAsset}
              closeModal={closeModals}
              handleShowSuccessModal={handleShowSuccessModal}
            />
            {assetsList?.length === 0 ? (
              <div
                className={assetsManageClasses.cardParent}
                onClick={() => openOrCloseFileUploadModal()}
              >
                <div>
                  <ControlPointIcon
                    color="primary"
                    className={assetsManageClasses.addIcon}
                  />
                </div>
                <div>
                  <h1 className={assetsManageClasses.uploadFile}>
                    Upload New Files
                  </h1>
                </div>
              </div>
            ) : (
              <Grid container className={classes.container}>
                <Grid item xs={12} md={3}></Grid>

                <div className={classes.listing}>
                  {assetsList.map((asset, index) => {
                    const {
                      attributes: { name, createdAt, size, type },
                      id,
                    } = asset;
                    const date = format(new Date(createdAt), "dd MMMM yyyy");
                    return (
                      <div
                        ref={
                          assetsList.length === index + 1
                            ? lastCardElementRef
                            : null
                        }
                        key={id}
                        style={{
                          flex: isMobile || isTab ? "0 0 49%" : "0 0 32%",
                        }}
                        className={classes.card}
                        onClick={() => {
                          if (isModal) handleSelectedAssetForNFT(asset);
                        }}
                      >
                        <div
                          className={classes.assetParent}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {isModal && (
                            <Radio checked={selectedAssetForNFT?.id === id} />
                          )}

                          <div
                            title={name}
                            className={classes.assetName}
                            // style={{ width: isMobile && "9rem" }}
                          >
                            {name}
                          </div>
                          <BasicMenu {...menuProps} />
                          <div className={classes.menuContainer}>
                            <MenuIcon
                              onClick={(e) => handleMenuClick(e, asset)}
                              sx={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                        <div
                          assetId={asset.id}
                          className={classes.asset}
                          onMouseEnter={handleHover}
                          onMouseLeave={handleLeaveHover}
                          onClick={handleAssetPreview}
                          type={asset.attributes.type}
                          extension={asset.attributes.fileExtension}
                          src={
                            type === "audio"
                              ? asset.attributes.originalPath
                              : type === "video"
                              ? asset.attributes.originalPath
                              : type === "3d_model"
                              ? asset.attributes.originalPath
                              : asset.attributes.thumbnailData
                          }
                        >
                          {hoverId &&
                          type === "video" &&
                          hoverId === asset.id ? (
                            <Box
                              sx={{
                                position: "relative",
                                height: "100%",
                              }}
                            >
                              <video
                                width="100%"
                                height="100%"
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                                autoPlay={true}
                                controls={false}
                                muted={isMute}
                              >
                                <source src={videoSrc} type="video/mp4" />
                                Your browser does not support HTML5 video.
                              </video>
                              {!isMute ? (
                                <VolumeUpIcon
                                  sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 20,
                                  }}
                                  onClick={muteclick}
                                  className="muteIcon"
                                />
                              ) : (
                                <VolumeOffIcon
                                  sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 20,
                                  }}
                                  onClick={muteclick}
                                  className="muteIcon"
                                />
                              )}
                            </Box>
                          ) : asset.attributes.thumbnailData ? (
                            <img
                              className={classes.imgStyle}
                              src={asset.attributes.thumbnailData}
                            />
                          ) : type === "audio" ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <MusicNoteIcon
                                sx={{ width: "70%", height: "70%" }}
                              />
                            </Box>
                          ) : type === "video" ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <VideoCameraBack
                                sx={{ width: "70%", height: "70%" }}
                              />
                            </Box>
                          ) : type === "3d_model" ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <Image
                                src="/images/3dmodel.svg"
                                width="70%"
                                height="70%"
                                alt="3d_model"
                              />
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 86 85"
                                fill="none"
                                style={{ width: "80%", height: "80%" }}
                              >
                                <path
                                  d="M85.375 75.4583V9.54167C85.375 4.3625 81.1375 0.125 75.9583 0.125H10.0417C4.8625 0.125 0.625 4.3625 0.625 9.54167V75.4583C0.625 80.6375 4.8625 84.875 10.0417 84.875H75.9583C81.1375 84.875 85.375 80.6375 85.375 75.4583ZM26.5208 49.5625L38.2917 63.7346L54.7708 42.5L75.9583 70.75H10.0417L26.5208 49.5625Z"
                                  fill="white"
                                  fillOpacity="0.56"
                                />
                              </svg>
                            </Box>
                          )}
                        </div>
                        {!isModal && (
                          <div
                            className={
                              isMobile
                                ? classes.assetFooter
                                : classes.assetParent
                            }
                            style={{ borderRadius: "0px 0px 5px 5px" }}
                          >
                            <span className={classes.iconAndDetail}>
                              <Calendar className={classes.calenderIcon} />
                              <Typography className={classes.assetDate}>
                                {date}
                              </Typography>
                            </span>
                            <span className={classes.iconAndDetail}>
                              <Attachment className={classes.sizeIcon} />
                              <Typography className={classes.assetSize}>
                                {bytesToSize(size)}
                              </Typography>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Grid>
            )}
            {isLoading && (
              <CircularProgress style={{ marginLeft: "50%" }} color="primary" />
            )}
          </Container>
        </>
      )}
    </>
  );
}
