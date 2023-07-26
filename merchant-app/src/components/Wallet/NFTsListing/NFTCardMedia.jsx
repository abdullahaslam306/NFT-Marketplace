import * as React from "react";
import { useMediaQuery, Box } from "@mui/material";
import { VideoCameraBack } from "@mui/icons-material";
import { useEffect, useState, Suspense } from "react";
import { downloadS3Base64, downloadS3SignedURL } from "../../../utils/s3Upload";
import { actions } from "../../../actions";
import { useDispatch } from "react-redux";
import CustomModal from "../../Modal/Modal";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useTheme } from "@mui/system";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Image from "next/image";

export default function NFTCardMedia({ asset, classes, tempCred }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [showAssetPreviewModal, setshowAssetPreviewModal] = useState(false);
  const [assetType, setassetType] = useState("image");
  const [assetSrc, setassetSrc] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [threedSrc, setthreedSrc] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [hoverId, sethoverId] = useState("");
  const dispatch = useDispatch();
  const associatedNFTAsset = asset[0];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const [isMute, setisMute] = useState(true);

  const muteclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setisMute(!isMute);
  };

  const imgStyles = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
  };

  const wrapperStyles = {
    width: "100%",
    paddingBottom: "100%",
    position: "relative",
    borderRadius: "4px",
    overflow: "hidden",
  };

  useEffect(() => {
    if (asset[0] && asset[0].bucketName) {
      if (asset[0].thumbnailPath && Object.keys(tempCred).length > 0) {
        downloadS3Base64(
          asset[0].thumbnailPath,
          tempCred,
          "",
          asset[0].bucketName
        ).then((thumbnailData) => {
          setThumbnail(thumbnailData);
        });
      } else if (
        asset[0].type === "image" &&
        asset[0].originalPath &&
        Object.keys(tempCred).length > 0
      ) {
        downloadS3Base64(
          asset[0]?.originalPath,
          tempCred,
          "",
          asset[0]?.bucketName
        ).then((thumbnailData) => {
          setThumbnail(thumbnailData);
        });
      }
    } else if (asset[0] && !asset[0].bucketName) {
      if (asset[0]?.thumbnailPath) {
        setThumbnail(
          asset[0]?.thumbnailPath?.replace("ipfs:/", "https://ipfs.io/ipfs")
        );
      }
      if (
        asset[0]?.originalPath?.indexOf("jpg") > 0 ||
        asset[0]?.originalPath?.indexOf("jpeg") > 0 ||
        asset[0]?.originalPath?.indexOf("png") > 0 ||
        asset[0]?.originalPath?.indexOf("gif") > 0 ||
        asset[0]?.originalPath?.indexOf("svg") > 0
      ) {
        associatedNFTAsset.type = "image";
      } else if (
        asset[0].originalPath?.indexOf("mp4") > 0 ||
        asset[0].originalPath?.indexOf("mov") > 0 ||
        asset[0].originalPath?.indexOf("webm") > 0 ||
        asset[0].originalPath?.indexOf("wav") > 0
      ) {
        associatedNFTAsset.type = "video";
      } else if (asset[0].originalPath?.indexOf("mp3") > 0) {
        associatedNFTAsset.type = "audio";
      } else if (asset[0].originalPath?.indexOf("glb")) {
        associatedNFTAsset.type = "3d_model";
      } else {
        associatedNFTAsset.type = "image";
      }
      if (asset[0].originalPath) {
        associatedNFTAsset.originalPath = asset[0]?.originalPath?.replace(
          "ipfs:/",
          "https://ipfs.io/ipfs"
        );
      }
    }
  }, [asset, tempCred]);

  function Model(props) {
    const { scene } = useGLTF(props.imgUrl);
    return <primitive object={scene} />;
  }

  const handlePreview = async (event) => {
    setshowAssetPreviewModal(true);
    if (event.currentTarget && event.currentTarget?.attributes?.type) {
      setassetType(event.currentTarget?.attributes?.type?.value);
    }
    setassetSrc(event.currentTarget?.attributes?.src?.value);
    if (event.currentTarget?.attributes?.bucketname?.value) {
      if (
        event.currentTarget &&
        event.currentTarget?.attributes?.type?.value === "image"
      ) {
        setassetSrc(
          await downloadS3SignedURL(
            tempCred,
            event.currentTarget?.attributes?.src?.value,
            event.currentTarget?.attributes?.bucketname?.value
          )
        );
      } else if (
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
        event.currentTarget?.attributes?.type?.value === "3d_model"
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
        event.currentTarget?.attributes?.type?.value === "audio"
      ) {
        let audioUrl = await downloadS3SignedURL(
          tempCred,
          event.currentTarget?.attributes?.src?.value,
          event.currentTarget?.attributes?.bucketname?.value
        );
        setAudioSrc(audioUrl);
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

  const handlePreviewModalClose = () => {
    setshowAssetPreviewModal(false);
    dispatch(actions.commonActions.setModalState(false));
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

  return (
    <>
      {showAssetPreviewModal && assetType && assetSrc && (
        <CustomModal
          showModal={showAssetPreviewModal}
          isCloseButton={true}
          onClose={handlePreviewModalClose}
        >
          <div
            style={{
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
          </div>
        </CustomModal>
      )}

      {!showAssetPreviewModal && (
        <div
          onMouseEnter={handleHover}
          onMouseLeave={handleLeaveHover}
          className={classes.mediaDiv}
          onClick={handlePreview}
          type={associatedNFTAsset && associatedNFTAsset.type}
          src={associatedNFTAsset && associatedNFTAsset.originalPath}
          assetid={associatedNFTAsset && associatedNFTAsset.id}
          bucketname={associatedNFTAsset && associatedNFTAsset.bucketName}
          style={{
            width: "100%",
            padding: "16px",
            gridArea: "2/1/2/2",
            display: "grid",
            placeItems: "center",
          }}
        >
          <>
            {hoverId &&
            associatedNFTAsset &&
            associatedNFTAsset.type === "video" &&
            hoverId === associatedNFTAsset.id ? (
              <Box
                // sx={{
                //   position: "relative",
                //   height: "100%",
                // }}
                sx={wrapperStyles}
              >
                <video
                  width="100%"
                  height="100%"
                  // style={{ maxWidth: "100%", maxHeight: "100%" }}
                  style={imgStyles}
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
              </Box>
            ) : associatedNFTAsset ? (
              <>
                {associatedNFTAsset.type === "video" ? (
                  associatedNFTAsset.thumbnailPath && thumbnail ? (
                    <Box sx={wrapperStyles}>
                      <img
                        src={thumbnail}
                        className={classes.imgSize}
                        style={imgStyles}
                      />
                    </Box>
                  ) : (
                    <Box sx={wrapperStyles}>
                      <VideoCameraBack
                        className={classes.imgSize}
                        style={imgStyles}
                      />
                    </Box>
                  )
                ) : associatedNFTAsset.type === "image" ? (
                  associatedNFTAsset.originalPath && thumbnail ? (
                    <Box sx={wrapperStyles}>
                      <img
                        src={thumbnail}
                        className={classes.imgSize}
                        style={imgStyles}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        ...wrapperStyles,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 86 85"
                        fill="none"
                        style={imgStyles}
                      >
                        <path
                          d="M85.375 75.4583V9.54167C85.375 4.3625 81.1375 0.125 75.9583 0.125H10.0417C4.8625 0.125 0.625 4.3625 0.625 9.54167V75.4583C0.625 80.6375 4.8625 84.875 10.0417 84.875H75.9583C81.1375 84.875 85.375 80.6375 85.375 75.4583ZM26.5208 49.5625L38.2917 63.7346L54.7708 42.5L75.9583 70.75H10.0417L26.5208 49.5625Z"
                          fill="white"
                          fillOpacity="0.56"
                        />
                      </svg>
                    </Box>
                  )
                ) : associatedNFTAsset.type === "audio" ? (
                  associatedNFTAsset.thumbnailPath && thumbnail ? (
                    <Box sx={wrapperStyles}>
                      <img
                        src={thumbnail}
                        className={classes.imgSize}
                        style={imgStyles}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        ...wrapperStyles,
                      }}
                    >
                      <MusicNoteIcon sx={imgStyles} />
                    </Box>
                  )
                ) : associatedNFTAsset.type === "3d_model" ? (
                  associatedNFTAsset.thumbnailPath && thumbnail ? (
                    <Box sx={wrapperStyles}>
                      <img
                        src={thumbnail}
                        className={classes.imgSize}
                        style={imgStyles}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        ...wrapperStyles,
                      }}
                    >
                      <img
                        src="/images/3dmodel.svg"
                        style={imgStyles}
                        width="70%"
                        height="70%"
                        alt="3d_model"
                      />
                    </Box>
                  )
                ) : (
                  ""
                )}
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  justifyContent: "center",
                  ...wrapperStyles,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 86 85"
                  fill="none"
                  style={imgStyles}
                >
                  <path
                    d="M85.375 75.4583V9.54167C85.375 4.3625 81.1375 0.125 75.9583 0.125H10.0417C4.8625 0.125 0.625 4.3625 0.625 9.54167V75.4583C0.625 80.6375 4.8625 84.875 10.0417 84.875H75.9583C81.1375 84.875 85.375 80.6375 85.375 75.4583ZM26.5208 49.5625L38.2917 63.7346L54.7708 42.5L75.9583 70.75H10.0417L26.5208 49.5625Z"
                    fill="white"
                    fillOpacity="0.56"
                  />
                </svg>
              </Box>
            )}
          </>
        </div>
      )}
    </>
  );
}
