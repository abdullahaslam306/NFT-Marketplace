import React, { useEffect, useState, Suspense } from "react";
import Layout from "../../../../components/Layout";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { CollabaratorProfile } from "../../../../components/MintNFTDashboard/CollabaratorProfile";
import {
  Toolbar,
  Button,
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import Image from "next/image";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "@mui/material/Link";
import {
  PrivacyPolicy_URL,
  TermsandConditions_URL,
} from "../../../../utils/constants";
import { useRouter } from "next/router";
import Head from "next/head";

import { downloadS3SignedURL } from "../../../../utils/s3Upload";
import { actions } from "../../../../actions";
import Divider from "@mui/material/Divider";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  PreviewNFTStyle,
  propertiesStyle,
} from "../../../../components/Wallet/PreviewNFTModal/PreviewNFTStyle";
import {
  TabPanel,
  a11yProps,
} from "../../../../components/Wallet/PreviewNFTModal/Tabs";
import { TrasactionHistory } from "../../../../components/Wallet/PreviewNFTModal/TrasactionHistory";
import { BlockChainInfo } from "../../../../components/Wallet/PreviewNFTModal/BlockChainInfo";
import { PropertiesSection } from "../../../../components/Wallet/PreviewNFTModal/Properties";
import CustomModal from "../../../../components/Modal/Modal";
import { LoadingIndicator } from "../../../../components/LoadingIndicator/LoadingIndicator";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { AccordionComponent } from "../../../../components/Wallet/PreviewNFTModal/AccordionComponent";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  getTempCredentialsForNftPublic,
  getTempCredentialsForProfilePublic,
} from "../../../../services/nftServices";
import ShareComponent from "../../../../components/ShareComponent/ShareComponent";
import Stack from "@mui/material/Stack";

function PreviewNFTSharedModal() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const classes = PreviewNFTStyle();
  const router = useRouter();
  const { signature, contractAddress } = router.query;
  const [publicNftDetails, setPublicNftDetails] = React.useState({});
  const [transactionNftDetails, setTransactionNftDetails] = React.useState({});
  const [blockchainNftDetails, setBlockchainNftDetails] = React.useState({});
  const [sectionList, setSectionList] = React.useState({});
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
  const [isLoading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [ownerData, setOwnerData] = useState({});

  useEffect(() => {
    setLoading(true);
    if (signature && contractAddress) {
      fetch(
        `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/?contractAddress=${contractAddress}&signature=${signature}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            fetch(
              `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/nft/?contractAddress=${contractAddress}&tokenId=${signature}`
            )
              .then((response) => response.json())
              .then((data) => {
                setLoading(false);
                setPublicNftDetails(data?.response);
              });
          }
        })
        .then((data) => {
          setLoading(false);
          setPublicNftDetails(data?.response);
        });
    }
  }, [signature, contractAddress]);

  const regex = /(<([^>]+)>)/gi;
  let hostname = "";

  if (typeof window !== "undefined") {
    hostname = `https://${window.location.hostname}/token/${contractAddress}/${signature}`;
  }

  const propertiesclass = propertiesStyle();

  function Model(props) {
    const { scene } = useGLTF(props.imgUrl);
    return <primitive object={scene} />;
  }
  useEffect(() => {
    if (publicNftDetails?.included?.length) {
      for (let item of publicNftDetails?.included) {
        if (item.type === "assets") {
          item.attributes.id = item.id;
          setAttributes(item.attributes);
        }
      }
    }
    if (!attributes?.bucketName) {
      if (attributes?.thumbnailPath) {
        setthumbnailPath(
          attributes?.thumbnailPath?.replace("ipfs:/", "https://ipfs.io/ipfs")
        );
      }
      if (
        attributes?.originalPath?.indexOf("jpg") > 0 ||
        attributes?.originalPath?.indexOf("jpeg") > 0 ||
        attributes?.originalPath?.indexOf("png") > 0 ||
        attributes?.originalPath?.indexOf("gif") > 0 ||
        attributes?.originalPath?.indexOf("svg") > 0
      ) {
        attributes.type = "image";
      } else if (
        attributes?.originalPath?.indexOf("mp4") > 0 ||
        attributes?.originalPath?.indexOf("mov") > 0 ||
        attributes?.originalPath?.indexOf("webm") > 0 ||
        attributes?.originalPath?.indexOf("wav") > 0
      ) {
        attributes.type = "video";
      } else if (attributes?.originalPath?.indexOf("mp3") > 0) {
        attributes.type = "audio";
      } else if (attributes?.originalPath?.indexOf("glb")) {
        attributes.type = "3d_model";
      } else {
        attributes.type = "image";
      }
      if (attributes?.originalPath) {
        attributes.originalPath = attributes?.originalPath?.replace(
          "ipfs:/",
          "https://ipfs.io/ipfs"
        );
      }
    } else if (publicNftDetails?.data?.id && attributes?.bucketName) {
      getTempCredentialsForNftPublic(publicNftDetails?.data?.id).then((res) => {
        setTempCredentials(res);
        if (attributes && attributes?.thumbnailPath) {
          downloadS3SignedURL(
            res,
            attributes?.thumbnailPath,
            attributes?.bucketName
          ).then((thumbnail) => {
            setthumbnailPath(thumbnail);
          });
        } else if (attributes && attributes?.originalPath) {
          downloadS3SignedURL(
            res,
            attributes?.originalPath,
            attributes?.bucketName
          ).then((thumbnail) => {
            setthumbnailPath(thumbnail);
          });
        } else {
          setthumbnailPath("");
        }
      });
    }
  }, [publicNftDetails?.data?.id, attributes, publicNftDetails?.included]);

  const muteclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setisMute(!isMute);
  };
  const handlePreviewModalClose = () => {
    setshowAssetPreviewModal(false);
    dispatch(actions.commonActions.setModalState(false));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (publicNftDetails?.data?.id) {
      if (publicNftDetails?.included && publicNftDetails?.included.length) {
        for (let item of publicNftDetails?.included) {
          if (item.type === "owners") {
            getTempCredentialsForProfilePublic(publicNftDetails?.data?.id).then(
              (res) => {
                item.attributes.tempCred = res;
                item.attributes.externalLink = true;
                setOwnerData(item.attributes);
              }
            );
          }
        }
      }
      fetch(
        `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/public/nft/${publicNftDetails?.data?.id}/transaction-history`
      )
        .then((response) => response.json())
        .then((data) => setTransactionNftDetails(data?.response));
      fetch(
        `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/public/nft/${publicNftDetails?.data?.id}/blockchain-info`
      )
        .then((response) => response.json())
        .then((data) => setBlockchainNftDetails(data?.response?.data));
      fetch(
        `${process.env.NEXT_PUBLIC_NFT_MANAGEMENT_DOMAIN}/api/v1/public/nft/${publicNftDetails?.data?.id}/sections/list`
      )
        .then((response) => response.json())
        .then((data) => setSectionList(data?.response?.data));
    }
  }, [publicNftDetails?.data?.id]);

  const handleAssetPreview = async (event) => {
    setshowAssetPreviewModal(true);
    if (event.currentTarget && event.currentTarget.attributes?.type) {
      setassetType(event.currentTarget.attributes?.type?.value);
    }
    if (event.currentTarget?.attributes?.bucketname?.value) {
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
    } else {
      if (
        event.currentTarget &&
        event.currentTarget?.attributes?.type?.value === "image"
      ) {
        setassetSrc(event.currentTarget?.attributes?.src?.value);
      } else if (
        event.currentTarget &&
        event.currentTarget?.attributes?.type?.value === "video"
      ) {
        setVideoSrc(event.currentTarget?.attributes?.src?.value);
      } else if (
        event.currentTarget &&
        event.currentTarget?.attributes?.type?.value === "3d_model"
      ) {
        setthreedSrc(event.currentTarget?.attributes?.src?.value);
      } else if (
        event.currentTarget &&
        event.currentTarget?.attributes?.type?.value === "audio"
      ) {
        setAudioSrc(event.currentTarget?.attributes?.src?.value);
      }
    }
    dispatch(actions.commonActions.setModalState(true));
  };

  const handleHover = async (event) => {
    sethoverId(event.currentTarget?.attributes?.assetid?.value);
    if (
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
    } else {
      sethoverId("");
    }
  };

  const handleLeaveHover = async (event) => {
    sethoverId("");
  };

  const tabsValue = [
    {
      index: 0,
      value: (
        <AccordionComponent title={"Description"}>
          {publicNftDetails?.data?.attributes?.description ? (
            <p
              className={classes.description}
              dangerouslySetInnerHTML={{
                __html: publicNftDetails?.data?.attributes?.description,
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
          <BlockChainInfo
            info={blockchainNftDetails}
            totalEditions={publicNftDetails?.data?.attributes?.totalEditions}
            status={publicNftDetails?.data?.attributes?.status}
          />
        </AccordionComponent>
      ),
    },
    {
      index: 2,
      value: (
        <AccordionComponent title={"Transaction history"}>
          <TrasactionHistory trasactionHistory={transactionNftDetails} />
        </AccordionComponent>
      ),
    },
  ];
  return (
    <>
      {publicNftDetails?.data?.attributes?.title && (
        <Head>
          <meta
            property="og:title"
            content={publicNftDetails?.data?.attributes?.title}
          />
          <meta
            property="og:description"
            content={publicNftDetails?.data?.attributes?.description}
          />
        </Head>
      )}
      <Layout>
        {isLoading && <LoadingIndicator isModal={true} title="Loading NFT" />}
        <Toolbar
          sx={{
            py: 2,
            px: { xs: "16px", sm: "72px!important" },
            marginBottom: { xs: "0", sm: "24px" },
            minHeight: "0px!important",
            background: "#383F4E",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <span style={{ cursor: "pointer" }}>
            <Image
              width="160px"
              height="34px"
              alt="Blocommerce"
              src="/images/BLOCommerce_White.png"
              onClick={() => (window.location.href = "https://blocommerce.com")}
            />
          </span>
          <Stack
            direction="row"
            sx={{
              position: "absolute",
              right: "72px",
              display: "flex",
              top: { xs: "5px", md: "10px" },
            }}
            spacing={1}
          >
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                textTransform: "uppercase",
                display: { xs: "none", sm: "block" },
                m: 0,
              }}
              onClick={() => router.push("/register")}
            >
              create a new account
            </Button>
          </Stack>
        </Toolbar>

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
          <Container
            maxWidth="lg"
            sx={{ pt: 2, px: { xs: "16px", sm: "72px!important" } }}
            style={{
              background: "#252B37",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              size="large"
              fullwidth="true"
              sx={{
                textTransform: "uppercase",
                position: "relative",
                width: "100%",
                display: { xs: "block", sm: "none" },
                m: 0,
              }}
              onClick={() => router.push("/register")}
            >
              create a new account
            </Button>
            <Box>
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
                        Total editions:{" "}
                        <span>
                          {publicNftDetails?.data?.attributes?.totalEditions ||
                            0}
                        </span>
                      </p>
                      <p className={classes.limitedEdition}>
                        {publicNftDetails?.data?.attributes?.title || null}
                      </p>

                      <div className={classes.tagsSection}>
                        {/* <p>Tags</p> */}
                        <LoyaltyIcon style={{ marginRight: "10px" }} />
                        {publicNftDetails?.data?.attributes?.tags?.length ? (
                          <div>
                            {publicNftDetails?.data?.attributes?.tags?.map(
                              (tags, index) => (
                                <h4
                                  key={index}
                                  style={{
                                    background: "rgba(37, 43, 55, 0.4)",
                                    borderRadius: "24px",
                                    padding: "5px 10px",
                                    marginRight: "4px",
                                    fontWeight: "300",
                                    fontWize: "13px",
                                    letterSpacing: "0.16px",
                                    color: "#B6AEF6",
                                  }}
                                >
                                  {tags}
                                </h4>
                              )
                            )}
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
                      assetid={attributes?.id}
                      type={attributes?.type}
                      src={attributes?.originalPath}
                      bucketname={attributes?.bucketName}
                    >
                      {hoverId &&
                      attributes?.type === "video" &&
                      hoverId === attributes?.id ? (
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
                      ) : attributes?.type === "image" ? (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "8px",
                          }}
                        >
                          {thumbnailPath ? (
                            <img
                              alt="thumbnail"
                              className={classes.noImage}
                              src={thumbnailPath}
                            />
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
                      ) : attributes?.type === "audio" ? (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "8px",
                          }}
                        >
                          {thumbnailPath && attributes?.thumbnailPath ? (
                            <img
                              alt="thumbnail"
                              className={classes.noImage}
                              src={thumbnailPath}
                            />
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
                      ) : attributes?.type === "video" ? (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "8px",
                          }}
                        >
                          {thumbnailPath && attributes?.thumbnailPath ? (
                            <img
                              alt="thumbnail"
                              className={classes.noImage}
                              src={thumbnailPath}
                            />
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
                      ) : attributes?.type === "3d_model" ? (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "8px",
                          }}
                        >
                          {thumbnailPath && attributes?.thumbnailPath ? (
                            <img
                              alt="thumbnail"
                              className={classes.noImage}
                              src={thumbnailPath}
                            />
                          ) : (
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
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
                        Total editions:{" "}
                        <span>
                          {publicNftDetails?.data?.attributes?.totalEditions ||
                            0}
                        </span>
                      </p>
                      <p className={classes.limitedEdition}>
                        {publicNftDetails?.data?.attributes?.title || null}
                      </p>
                      {publicNftDetails?.data?.attributes?.tags?.length && (
                        <div className={classes.tagsSection}>
                          {/* <p>Tags</p> */}
                          <LoyaltyIcon style={{ marginRight: "10px" }} />
                          <div>
                            {publicNftDetails?.data?.attributes?.tags?.map(
                              (tags, index) => (
                                <h4
                                  key={index}
                                  style={{
                                    background: "rgba(37, 43, 55, 0.4)",
                                    borderRadius: "24px",
                                    padding: "5px 10px",
                                    marginRight: "4px",
                                    fontWeight: "300",
                                    fontWize: "13px",
                                    letterSpacing: "0.16px",
                                    color: "#B6AEF6",
                                  }}
                                >
                                  {tags}
                                </h4>
                              )
                            )}
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
                      <p
                        style={{ width: isMobile ? "50%" : "25%", margin: "0" }}
                      >
                        Creator :
                      </p>
                      <div
                        style={{
                          width: isMobile ? "50%" : "75%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {ownerData && ownerData?.username ? (
                          <CollabaratorProfile owner={ownerData}>
                            <p style={{ color: "#24D182", margin: "0" }}>
                              @{ownerData?.username}
                            </p>
                          </CollabaratorProfile>
                        ) : (
                          <p style={{ margin: "0" }}>Not Available</p>
                        )}
                      </div>
                    </div>
                  </Box>
                  <Box
                    style={{
                      background: "#383F4E",
                      borderRadius: "4px",
                    }}
                  >
                    <PropertiesSection
                      properties={
                        publicNftDetails?.data?.attributes?.properties
                      }
                    />
                  </Box>
                  <ShareComponent
                    shareUrl={hostname}
                    title={`${
                      publicNftDetails?.data?.attributes?.title
                    } - ${publicNftDetails?.data?.attributes?.description?.replace(
                      regex,
                      ""
                    )}`}
                    nftId={publicNftDetails?.data?.id}
                  ></ShareComponent>
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
            </Box>
          </Container>
        )}
        <Box
          sx={
            matches
              ? {
                  py: 3,
                  px: 2,
                  width: "100%",
                  float: "left",
                  mt: "20px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.23)",
                }
              : {
                  mt: "20px",
                  padding: 0,
                  width: "100%",
                  float: "left",
                  borderTop: "1px solid rgba(255, 255, 255, 0.23)",
                }
          }
        >
          <Container
            maxWidth="sm"
            align="center"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              position: "relative",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <Typography
              className={classes.footerLinks}
              sx={matches ? { px: 2, fontSize: 14 } : { width: "100%" }}
            >
              © 2022 BLOCommerce
            </Typography>
            <Link
              target="_blank"
              href={PrivacyPolicy_URL}
              className={classes.footerLinks}
              underline="none"
              color="text.primary"
              sx={
                matches ? { px: 2, fontSize: 14 } : { padding: "5px 10px 0 0" }
              }
            >
              Privacy Policy
            </Link>
            <Link
              target="_blank"
              href={TermsandConditions_URL}
              underline="none"
              color="text.primary"
              className={classes.footerLinks}
              sx={
                matches ? { px: 2, fontSize: 14 } : { padding: "5px 10px 0 0" }
              }
            >
              Terms of Service
            </Link>
            <Link
              href="mailto:hello@blocommerce.com"
              underline="none"
              color="primary"
              sx={
                matches ? { px: 2, fontSize: 14 } : { padding: "5px 10px 0 0" }
              }
            >
              Contact us
            </Link>
          </Container>
        </Box>
      </Layout>
    </>
  );
}

export default PreviewNFTSharedModal;
