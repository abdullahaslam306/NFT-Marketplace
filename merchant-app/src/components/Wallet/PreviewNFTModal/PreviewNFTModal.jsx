import React, { useEffect, useState, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  Box,
  Button,
  Grid,
  Tabs,
  Tab,
  useMediaQuery,
  Link,
} from "@mui/material";
import Image from "next/image";
import { downloadS3SignedURL } from "../../../utils/s3Upload";
import { CollabaratorProfile } from "../../MintNFTDashboard/CollabaratorProfile";
import CustomModal from "../../Modal/Modal";
import { styled } from "@mui/material/styles";
import { actions } from "../../../actions";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import Divider from "@mui/material/Divider";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { PreviewNFTStyle, propertiesStyle } from "./PreviewNFTStyle";
import { TabPanel, a11yProps } from "./Tabs";
import { TrasactionHistory } from "./TrasactionHistory";
import { BlockChainInfo } from "./BlockChainInfo";
import { PropertiesSection } from "./Properties";
import { LoadingIndicator } from "../../LoadingIndicator/LoadingIndicator";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DialogContent from "@mui/material/DialogContent";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { useTheme } from "@mui/system";
import { AccordionComponent } from "./AccordionComponent";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { VideoCameraBack } from "@mui/icons-material";
import ShareComponent from "../../ShareComponent/ShareComponent";
import NFTPreviewTag from "src/components/nftPreviewTag";
import { getTempCredentialsForNft } from "src/services/nftServices";
import { openUrl } from "src/utils/helper";

const BootstrapDialog = styled(Dialog)(({ theme, MobileView }) => {
  return {
    "& .MuiDialogContent-root": {
      overflowY: "unset",
      padding: MobileView ? 0 : "20px 24px",
      background: "#252b37",
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      boxShadow: "none",
      backdropFilter: "none",
      background: "transparent",
      overflowY: "unset",
    },
    "& .MuiBackdrop-root": {
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(50px)",
      WebkitBackdropFilter: "blur(50px)",
    },
  };
});

function PreviewNFTModal({ open, onClose, nftId }) {
  const theme = useTheme();
  const classes = PreviewNFTStyle();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const propertiesclass = propertiesStyle();
  let hostname = "";
  let hostnameLive = "";

  const {
    assets,
    description,
    owner,
    properties,
    tags,
    title,
    totalEditions,
    status,
    smartContracts,
    signature,
    externalLink,
  } = useSelector((state) => state.nftReducer?.nftInfoById || {});

  const {
    loadingPreview,
    loadingSection,
    loadingBlockInfo,
    loadingTrasaction,
    sectionList,
    blockChainInfo,
    trasactionHistory,
  } = useSelector((state) => state.nftReducer || {});
  const [value, setValue] = useState(0);
  const [tempCred, setTempCredentials] = useState({});
  const [thumbnailPath, setthumbnailPath] = useState("");
  const dispatch = useDispatch();
  const [showAssetPreviewModal, setshowAssetPreviewModal] = useState(false);
  const [assetType, setassetType] = useState("image");
  const [assetSrc, setassetSrc] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [threedSrc, setthreedSrc] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [hoverId, sethoverId] = useState("");
  const [isMute, setisMute] = useState(true);

  const muteclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setisMute(!isMute);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleHover = async (event) => {
    sethoverId(event.currentTarget?.attributes?.assetid?.value);
    if (
      event.currentTarget?.attributes?.bucketname?.value &&
      event.currentTarget &&
      event.currentTarget?.attributes?.type?.value === "video"
    ) {
      setVideoSrc(
        await downloadS3SignedURL(
          tempCred,
          event.currentTarget.attributes.src.value,
          event.currentTarget?.attributes?.bucketname?.value
        )
      );
    } else if (
      event.currentTarget &&
      event.currentTarget?.attributes?.type?.value === "video"
    ) {
      setVideoSrc(event.currentTarget?.attributes?.src?.value);
    } else {
      sethoverId("");
    }
  };

  const handleLeaveHover = async (event) => {
    sethoverId("");
  };

  if (typeof window !== "undefined") {
    hostname = `https://${window.location.hostname}/token/${smartContracts?.address}/${signature}`;
  }

  if (typeof window !== "undefined") {
    hostnameLive = `https://${window.location.hostname}/token/${smartContracts?.address}/${blockChainInfo?.attributes?.tokenId}`;
  }
  if (assets && assets[0] && !assets[0].bucketName && !thumbnailPath) {
    setthumbnailPath(
      assets[0].thumbnailPath?.replace("ipfs:/", "https://ipfs.io/ipfs")
    );
  }
  if (assets && assets[0] && assets[0].originalPath) {
    assets[0].originalPath = assets[0].originalPath.replace(
      "ipfs:/",
      "https://ipfs.io/ipfs"
    );
    if (
      assets[0].originalPath?.indexOf("jpg") > 0 ||
      assets[0].originalPath?.indexOf("jpeg") > 0 ||
      assets[0].originalPath?.indexOf("png") > 0 ||
      assets[0].originalPath?.indexOf("gif") > 0 ||
      assets[0].originalPath?.indexOf("svg") > 0
    ) {
      assets[0].type = "image";
    } else if (
      assets[0].originalPath?.indexOf("mp4") > 0 ||
      assets[0].originalPath?.indexOf("mov") > 0 ||
      assets[0].originalPath?.indexOf("webm") > 0 ||
      assets[0].originalPath?.indexOf("wav") > 0
    ) {
      assets[0].type = "video";
    } else if (assets[0].originalPath.indexOf("mp3") > 0) {
      assets[0].type = "audio";
    } else if (assets[0].originalPath.indexOf("glb")) {
      assets[0].type = "3d_model";
    } else {
      assets[0].type = "image";
    }
  }

  useEffect(() => {
    getTempCredentialsForNft().then((res) => {
      setTempCredentials(res);
      if (assets && assets[0] && !assets[0].bucketName) {
        setthumbnailPath(
          assets[0].thumbnailPath.replace("ipfs:/", "https://ipfs.io/ipfs")
        );
        assets[0].originalPath = assets[0].originalPath.replace(
          "ipfs:/",
          "https://ipfs.io/ipfs"
        );
        if (
          assets[0].originalPath.indexOf("jpg") > 0 ||
          assets[0].originalPath.indexOf("jpeg") > 0 ||
          assets[0].originalPath.indexOf("png") > 0 ||
          assets[0].originalPath.indexOf("gif") > 0 ||
          assets[0].originalPath.indexOf("svg") > 0
        ) {
          assets[0].type = "image";
        } else if (
          assets[0].originalPath.indexOf("mp4") > 0 ||
          assets[0].originalPath.indexOf("mov") > 0 ||
          assets[0].originalPath.indexOf("webm") > 0 ||
          assets[0].originalPath.indexOf("wav") > 0
        ) {
          assets[0].type = "video";
        } else if (assets[0].originalPath.indexOf("mp3") > 0) {
          assets[0].type = "audio";
        } else if (assets[0].originalPath.indexOf("glb")) {
          assets[0].type = "3d_model";
        } else {
          assets[0].type = "image";
        }
      } else {
        if (assets?.length && assets[0].thumbnailPath) {
          downloadS3SignedURL(
            res,
            assets[0].thumbnailPath,
            assets[0].bucketName
          ).then((thumbnail) => {
            setthumbnailPath(thumbnail);
          });
        } else if (assets?.length && assets[0].originalPath) {
          downloadS3SignedURL(
            res,
            assets[0].originalPath,
            assets[0].bucketName
          ).then((thumbnail) => {
            setthumbnailPath(thumbnail);
          });
        } else {
          setthumbnailPath("");
        }
      }
    });
  }, [assets]);

  const handlePreviewModalClose = () => {
    setshowAssetPreviewModal(false);
    dispatch(actions.commonActions.setModalState(false));
  };

  const regex = /(<([^>]+)>)/gi;

  const handleAssetPreview = async (event) => {
    setshowAssetPreviewModal(true);
    if (event.currentTarget && event.currentTarget.attributes?.type) {
      setassetType(event.currentTarget.attributes?.type?.value);
    }
    if (!event.currentTarget?.attributes?.bucketname?.value) {
      if (
        event.currentTarget &&
        event.currentTarget.attributes?.type?.value === "image"
      ) {
        setassetSrc(event.currentTarget.attributes?.originalPath);
      } else if (
        event.currentTarget &&
        event.currentTarget?.attributes?.type?.value === "video"
      ) {
        setVideoSrc(event.currentTarget?.attributes?.src?.value);
      } else if (
        event.currentTarget &&
        event.currentTarget.attributes?.type?.value === "3d_model"
      ) {
        setthreedSrc(event.currentTarget?.attributes?.src?.value);
      } else if (
        event.currentTarget &&
        event.currentTarget.attributes?.type?.value === "audio"
      ) {
        setAudioSrc(event.currentTarget?.attributes?.src?.value);
      }
    } else {
      if (
        event.currentTarget &&
        event.currentTarget?.attributes?.type?.value === "video"
      ) {
        setVideoSrc(
          await downloadS3SignedURL(
            tempCred,
            event.currentTarget?.attributes?.src?.value,
            event.currentTarget?.attributes?.bucketname?.value
          )
        );
      } else if (
        event.currentTarget &&
        event.currentTarget.attributes?.type?.value === "3d_model"
      ) {
        setthreedSrc(
          await downloadS3SignedURL(
            tempCred,
            event.currentTarget?.attributes?.src?.value,
            event.currentTarget?.attributes?.bucketname?.value
          )
        );
      } else if (
        event.currentTarget &&
        event.currentTarget.attributes?.type?.value === "audio"
      ) {
        setAudioSrc(
          await downloadS3SignedURL(
            tempCred,
            event.currentTarget?.attributes?.src?.value,
            event.currentTarget?.attributes?.bucketname?.value
          )
        );
      } else if (
        event.currentTarget &&
        event.currentTarget.attributes?.type?.value === "image"
      ) {
        setassetSrc(
          await downloadS3SignedURL(
            tempCred,
            event.currentTarget?.attributes?.src?.value,
            event.currentTarget?.attributes?.bucketname?.value
          )
        );
      }
    }
    dispatch(actions.commonActions.setModalState(true));
  };

  const tabsValue = [
    {
      index: 0,
      value: (
        <AccordionComponent title={"Description"}>
          {description ? (
            <p
              className={classes.description}
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            ></p>
          ) : (
            <Typography className={classes.description}>
              This NFT has no description yet.
            </Typography>
          )}
        </AccordionComponent>
      ),
    },
    {
      index: 1,
      value: (
        <AccordionComponent title={"Blockchain Info"}>
          <BlockChainInfo info={blockChainInfo} />
        </AccordionComponent>
      ),
    },
    {
      index: 2,
      value: (
        <AccordionComponent title={"Transaction history"}>
          <TrasactionHistory trasactionHistory={trasactionHistory} />
        </AccordionComponent>
      ),
    },
  ];

  if (
    loadingPreview ||
    loadingSection ||
    loadingBlockInfo ||
    loadingTrasaction
  ) {
    return <LoadingIndicator isModal={true} title="Loading NFT preview" />;
  }

  function Model(props) {
    const { scene } = useGLTF(props.imgUrl);
    return <primitive object={scene} />;
  }

  const externalLinkElement = () => (
    <Link
      style={{ cursor: "pointer" }}
      onClick={() => openUrl(externalLink || "N/A")}
    >
      <Grid container>
        <Grid item>
          <Typography sx={{ color: theme.palette.primary.main }}>
            {externalLink || "N/A"}
          </Typography>
        </Grid>
      </Grid>
    </Link>
  );

  return (
    <>
      <NFTPreviewTag id={nftId} />
      {showAssetPreviewModal && assetType ? (
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
      ) : (
        <BootstrapDialog
          maxWidth="lg"
          fullWidth={true}
          open={open}
          onClose={onClose}
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            // backdropFilter: "blur(50px)",
            overflowY: "scroll",
          }}
          //MobileView={isMobile}
        >
          <Button
            onClick={onClose}
            style={{
              position: "absolute",
              right: isMobile ? "-41px" : "-15px",
              zIndex: "1",
              top: isMobile ? "-45px" : "-20px",
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
          <DialogContent>
            <Grid container style={{ marginTop: "18px" }}>
              <Grid
                item
                xl={5}
                md={6}
                lg={5}
                xs={12}
                sm={6}
                style={{ paddingRight: isMobile ? 0 : "30px" }}
              >
                {isMobile && (
                  <Box
                    style={{
                      background: "#383F4E",
                      borderRadius: "4px",
                      padding: "20px 0 20px 20px",
                      marginBottom: "24px",
                    }}
                  >
                    <p className={classes.titleSection}>
                      Total editions: <span>{totalEditions || "N/A"}</span>
                    </p>
                    <p className={classes.limitedEdition}>{title || null}</p>
                    {/*externalLinkElement()*/}
                    <div className={classes.tagsSection}>
                      {/* <p>Tags</p> */}
                      <LoyaltyIcon style={{ marginRight: "10px" }} />
                      {tags?.length ? (
                        <div>
                          {tags?.map((tags, index) => (
                            <h4
                              style={{
                                background: "rgba(37, 43, 55, 0.4)",
                                borderRadius: "24px",
                                padding: "5px",
                                marginRight: "4px",
                                fontWeight: "300",
                                fontWize: "13px",
                                letterSpacing: "0.16px",
                                color: "#B6AEF6",
                              }}
                              key={index}
                            >
                              {tags}
                            </h4>
                          ))}
                        </div>
                      ) : (
                        "No tag added yet"
                      )}
                    </div>
                  </Box>
                )}
                <div className="asset-box">
                  <div
                    className="asset-container"
                  onClick={handleAssetPreview}
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeaveHover}
                  assetid={assets?.[0]?.id}
                  type={assets?.[0]?.type}
                  src={assets?.[0]?.originalPath}
                  bucketname={assets?.[0]?.bucketName}
                >
                  {hoverId &&
                  assets?.[0] &&
                  assets?.[0].type === "video" &&
                  hoverId === assets?.[0].id ? (
                    <>
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
                          sx={{ position: "absolute", top: 10, right: 20 }}
                          onClick={muteclick}
                          className="muteIcon"
                        />
                      ) : (
                        <VolumeOffIcon
                          sx={{ position: "absolute", top: 10, right: 20 }}
                          onClick={muteclick}
                          className="muteIcon"
                        />
                      )}
                    </>
                  ) : assets[0]?.type === "image" ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "8px",
                      }}
                    >
                      {thumbnailPath ? (
                        <img className={classes.noImage} src={thumbnailPath} />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <Image
                                src="/images/thumbnailnft.png"
                                layout="fill"
                                alt="3d_model"
                              />
                        </Box>
                      )}
                    </div>
                  ) : assets[0]?.type === "audio" ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "8px",
                      }}
                    >
                      {thumbnailPath && assets[0]?.thumbnailPath ? (
                        <img className={classes.noImage} src={thumbnailPath} />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <Image
                                src="/images/Audiothumbnail.png"
                                layout="fill"
                                alt="audio"
                              />
                        </Box>
                      )}
                    </div>
                  ) : assets[0]?.type === "video" ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "8px",
                      }}
                    >
                      {thumbnailPath && assets[0]?.thumbnailPath ? (
                        <img className={classes.noImage} src={thumbnailPath} />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <Image
                        src="/images/Videothumbnail.png"
                        layout="fill"
                        alt="video"
                      />
                        </Box>
                      )}
                    </div>
                  ) : assets[0]?.type === "3d_model" ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "8px",
                      }}
                    >
                      {thumbnailPath && assets[0]?.thumbnailPath ? (
                        <img className={classes.noImage} src={thumbnailPath} />
                      ) : (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Image
                            src="/images/3Dthumbnail.png"
                            layout="fill"
                            alt="3d_model"
                          />
                        </Box>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                    </div>
                  )}
                </div>
                </div>
              </Grid>
              <Grid item xl={7} xs={12} sm={6} md={6} lg={7}>
                {!isMobile && (
                  <Box
                    style={{
                      background: "#383F4E",
                      borderRadius: "4px",
                      padding: "20px 0 20px 20px",
                      marginBottom: "24px",
                    }}
                  >
                    <p className={classes.titleSection}>
                      Total editions: <span>{totalEditions || "N/A"}</span>
                    </p>
                    <p className={classes.limitedEdition}>{title || null}</p>

                    {/* {externalLinkElement()} */}

                    {tags?.length && (
                      <div className={classes.tagsSection}>
                        {/* <p>Tags</p> */}
                        <LoyaltyIcon style={{ marginRight: "10px" }} />
                        <div>
                          {tags?.map((tags, index) => (
                            <h4
                              key={index}
                              style={{
                                background: "rgba(37, 43, 55, 0.4)",
                                borderRadius: "24px",
                                padding: "5px",
                                marginRight: "4px",
                                fontWeight: "300",
                                fontWize: "13px",
                                letterSpacing: "0.16px",
                                color: "#B6AEF6",
                              }}
                            >
                              {tags}
                            </h4>
                          ))}
                        </div>
                      </div>
                    )}
                  </Box>
                )}
                <Box
                  style={{
                    background: "#383F4E",
                    borderRadius: "4px",
                    padding: "20px 20px 20px 20px",
                    marginBottom: "24px",
                  }}
                >
                  <div className={classes.creatorSection}>
                    <p style={{ width: isMobile ? "50%" : "25%", margin: "0" }}>
                      Creator :
                    </p>
                    <CollabaratorProfile owner={owner || {}}>
                      <div
                        style={{
                          width: isMobile ? "50%" : "75%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {owner?.username ? (
                          <p style={{ color: "#24D182", margin: "0" }}>
                            @{owner.username}
                          </p>
                        ) : (
                          <p style={{ margin: "0" }}>Not Available</p>
                        )}
                      </div>
                    </CollabaratorProfile>
                  </div>
                </Box>
                <Box
                  style={{
                    background: "#383F4E",
                    borderRadius: "4px",
                  }}
                >
                  <PropertiesSection properties={properties} />
                </Box>
                {status === "live" && (
                  <ShareComponent
                    shareUrl={hostnameLive}
                    title={`${title} - ${description?.replace(regex, "")}`}
                    nftId={nftId}
                    status="live"
                  ></ShareComponent>
                )}
                {status === "lazy" && (
                  <ShareComponent
                    shareUrl={hostname}
                    title={`${title} - ${description?.replace(regex, "")}`}
                    nftId={nftId}
                    status="lazy"
                  ></ShareComponent>
                )}
              </Grid>
            </Grid>
            {isMobile ? (
              tabsValue.map((tab, index) => (
                <div value={value} index={index} key={index}>
                  {tab.value}
                </div>
              ))
            ) : (
              <div
                style={{
                  marginTop: "45px",
                  width: "100%",
                  minHeight: "100px",
                  background: "rgba(41, 46, 58, 0.51)",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      style={{
                        background: "rgba(255, 255, 255, 0.09)",
                        textTransform: "capitalize",
                      }}
                    >
                      <Tab
                        label="Description"
                        {...a11yProps(0)}
                        style={{
                          textTransform: "none",
                          fontSize: "18px",
                          fontWeight: 400,
                          color: "#fff",
                        }}
                      />
                      <Tab
                        label="Blockchain Info"
                        {...a11yProps(1)}
                        style={{
                          textTransform: "none",
                          fontSize: "18px",
                          fontWeight: 400,
                          color: "#fff",
                        }}
                      />
                      <Tab
                        label="Transaction history"
                        {...a11yProps(2)}
                        style={{
                          textTransform: "none",
                          fontSize: "18px",
                          fontWeight: 400,
                          color: "#fff",
                        }}
                      />
                    </Tabs>
                  </Box>
                  {tabsValue.map((tab, index) => (
                    <TabPanel value={value} index={index} key={index}>
                      {tab.value}
                    </TabPanel>
                  ))}
                </Box>
              </div>
            )}
            <Divider style={{ margin: "30px 0", width: "100%" }} />
            {sectionList?.length
              ? sectionList.map((each, i) => (
                  <div
                    key={i}
                    style={{
                      width: "100%",
                      minHeight: "50px",
                      background: "rgba(41, 46, 58, 0.51)",
                      alignItems: "flex-start",
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    className={propertiesclass.sectionWrapper}
                  >
                    <h4>{sectionList[i]?.attributes?.title}</h4>
                    <p
                      style={{ lineHeight: "25px", marginBottom: "32px" }}
                      className={propertiesclass.addSectionDefault}
                      dangerouslySetInnerHTML={{
                        __html: sectionList[i]?.attributes?.content,
                      }}
                    ></p>
                  </div>
                ))
              : null}
          </DialogContent>
        </BootstrapDialog>
      )}
    </>
  );
}

export { PreviewNFTModal };
