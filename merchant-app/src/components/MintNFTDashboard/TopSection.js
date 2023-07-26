/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TagIcon } from "src/BloIcons";
import {
  Box,
  Typography,
  Grid,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Link,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { mintnftDashboardStyles } from "./MintNFTDashboardStyle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CollabaratorProfile } from "./CollabaratorProfile";
import { BlockChainInfo } from "../Wallet/PreviewNFTModal/BlockChainInfo";
import { TrasactionHistory } from "../Wallet/PreviewNFTModal/TrasactionHistory";
import { actions } from "src/actions";
import { VideoCameraBack } from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { downloadS3SignedURL } from "src/utils/s3Upload";
import { getTempCredentialsForNft } from "../../services/nftServices";
import Image from "next/image";
import { openUrl } from "src/utils/helper";

function TopSection({ selectedAsset, thumbnailPath, showDefaultThumbail }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const classes = mintnftDashboardStyles();
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});
  const { blockChainInfo, trasactionHistory } = useSelector(
    (state) => state.nftReducer || {}
  );
  const [tempCred, setTempCred] = useState({});

 
  const handleResize = () => {
    if (window.innerWidth < 1079 ){
    dispatch(actions.nftActions.setMobileview(true));

    } else{
      dispatch(actions.nftActions.setMobileview(false));
    }
  }
  React.useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    getTempCredentialsForNft().then((tempCred) => {
      setTempCred(tempCred);
    });
  }, []);

  useEffect(() => {
    if (
      tempCred &&
      nftReducer &&
      nftReducer.nftInfoById &&
      nftReducer.nftInfoById.assets &&
      nftReducer.nftInfoById.assets[0] &&
      !nftReducer.imgUrl
    ) {
      if (nftReducer.nftInfoById.assets[0].thumbnailPath) {
        downloadS3SignedURL(
          tempCred,
          nftReducer.nftInfoById.assets[0].thumbnailPath,
          nftReducer.nftInfoById.assets[0].bucketName
        ).then((url) => {
          dispatch(actions.nftActions.setNftImgUrl(url));
        });
      } else if (nftReducer.nftInfoById.assets[0].originalPath) {
        downloadS3SignedURL(
          tempCred,
          nftReducer.nftInfoById.assets[0].originalPath,
          nftReducer.nftInfoById.assets[0].bucketName
        ).then((url) => {
          dispatch(actions.nftActions.setNftImgUrl(url));
        });
      }
    }
  }, [nftReducer.nftInfoById?.assets?.[0]]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleClick = (panel) => (event) => {
    let ele = document.getElementsByClassName("clicked");
    for (let m = 0; m < ele.length; m++) {
      ele[m].classList.remove("clicked");
    }
    event.currentTarget.classList.add("clicked");
    dispatch(actions.nftActions.setExpandedPanel(`${panel}`));

    if (panel === "panel7") {
      nftReducer.nftEditData.properties = nftReducer.nftInfoById.properties;
      dispatch(actions.nftActions.setNftData(nftReducer.nftEditData));
    } else if (panel === "panelExternalLink") {
      openUrl(nftReducer?.nftEditData?.externalLink || "N/A");
    }
  };

  const externalLinkElement = () => {
    const externalLink = nftReducer?.nftEditData?.externalLink || "N/A";
    return (
      <Typography
        id="externalLinkRight"
        className={classes.nftTitle}
        sx={{ fontSize: "14px", mt: "10px", padding: "5px", color: "#24D182" }}
        onClick={handleClick("panelExternalLink")}
      >
        <EditIcon className={classes.editPencil} />
        {externalLink}
      </Typography>
    );
  };

  return (
    <>
      {nftReducer.isMobileView ? (
        <Box sx={{ pb: "30px" }}>
          <Box>
            <Box
              sx={{
                background: "#383F4E",
                width: "400px",
                borderRadius: "4px",
                padding: "20px",
                mr: "15px",
              }}
            >
              <Box>
                <Typography
                  id={"totalEditionRightSide"}
                  className={classes.nftTitle}
                  onClick={handleClick("panel2")}
                  panelname="totalEdition"
                  style={{ fontSize: "18px", fontWeight: 400 }}
                >
                  <EditIcon className={classes.editPencil} />
                  Total Editions:{" "}
                  <span
                    style={{
                      marginLeft: "15px",
                      color: "#B6AEF6",
                      fontSize: "14px",
                    }}
                  >
                    {nftReducer &&
                      nftReducer.nftEditData &&
                      nftReducer.nftEditData.totalEditions}
                  </span>
                </Typography>
                <Typography
                  id={"titleRight"}
                  className={classes.nftTitle}
                  sx={{ fontSize: "24px", fontWeight: 900 }}
                  onClick={handleClick("panel1")}
                >
                  <EditIcon className={classes.editPencil} />
                  {nftReducer &&
                    nftReducer.nftEditData &&
                    nftReducer.nftEditData.title}
                </Typography>

                {/*  {externalLinkElement()} */}

                <Box
                  sx={{ mt: "10px", display: "flex" }}
                  onClick={handleClick("panel8")}
                  className={classes.nftTitle}
                >
                  <EditIcon className={classes.editPencil} />
                  <TagIcon />
                  <Typography
                    style={{
                      wordBreak: "break-all",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                    }}
                    sx={{
                      ml: "10px",
                      fontSize: "14px",
                      padding: "5px",
                      color:
                        (nftReducer &&
                          nftReducer.nftInfoById &&
                          nftReducer.nftInfoById.tags) ||
                        (nftReducer &&
                          nftReducer.nftEditData &&
                          nftReducer.nftEditData.tags)
                          ? "#B6AEF6"
                          : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {nftReducer?.nftEditData?.tags?.length > 0
                      ? nftReducer?.nftEditData?.tags?.map((each) => {
                          if (each)
                            return (
                              <span
                                style={{
                                  background: "rgba(37, 43, 55, 0.4)",
                                  borderRadius: "24px",
                                  padding: "5px",
                                  marginRight: "4px",
                                  fontWeight: "400",
                                  fontSize: "14px",
                                  letterSpacing: "0.16px",
                                  color: "#B6AEF6",
                                }}
                              >
                                {each}
                              </span>
                            );
                        })
                      : "No tags added yet"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            onClick={handleClick("panel3")}
            className={classes.nftTitle}
            sx={{
              p: "30px",
              m: "0 16px",
              background: "rgba(255, 255, 255, 0.12)",
              borderRadius: "4px",
            }}
          >
            <EditIcon className={classes.editPencil} />
            {thumbnailPath || selectedAsset?.thumbnail ? (
              <img
                src={thumbnailPath || selectedAsset.thumbnail}
                alt="thumnail"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {selectedAsset?.type === "video" ||
                (nftReducer.nftInfoById?.assets?.[0]?.type === "video" &&
                  showDefaultThumbail) ? (
                  <VideoCameraBack sx={{ width: "100%", height: "100%" }} />
                ) : (
                  <>
                    {selectedAsset?.type === "3d_model" ||
                    (nftReducer.nftInfoById?.assets?.[0]?.type === "3d_model" &&
                      showDefaultThumbail) ? (
                      <Image
                        src="/images/3dmodel.svg"
                        width="100%"
                        height="100%"
                        alt="3d_model"
                      />
                    ) : (
                      <>
                        {selectedAsset?.type === "audio" ||
                        (nftReducer.nftInfoById?.assets?.[0]?.type ===
                          "audio" &&
                          showDefaultThumbail) ? (
                          <MusicNoteIcon
                            sx={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <img src="https://imgur.com/vQ3j117" alt="thumnail" />
                        )}
                      </>
                    )}
                  </>
                )}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.09)",
              height: "60px",
              m: "24px",
              padding: "20px 24px",
            }}
          >
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: 400,
              }}
            >
              Creator:
              <CollabaratorProfile
                owner={
                  (nftReducer &&
                    nftReducer.nftInfoById &&
                    nftReducer.nftInfoById.owner) ||
                  {}
                }
              >
                <span
                  style={{
                    marginLeft: "40px",
                    fontSize: "14px",
                    color: "#B6AEF6",
                    cursor: "pointer",
                  }}
                >
                  {"@"}
                  {(nftReducer &&
                    nftReducer.nftInfoById &&
                    nftReducer.nftInfoById.owner &&
                    nftReducer.nftInfoById.owner.username) ||
                    ""}
                </span>
              </CollabaratorProfile>
            </Typography>
          </Box>
          <Box
            sx={{
              background: "#383F4E",
              height: "auto",
              width: "400px",
              borderRadius: "4px",
              mt: "16px",
              mr: "15px",
            }}
          >
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                margin: "0 16px",
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
              <AccordionDetails
                style={{ background: "#252B37", cursor: "pointer" }}
                onClick={handleClick("panel6")}
              >
                {(nftReducer &&
                  nftReducer.nftInfoById &&
                  nftReducer.nftInfoById.description) ||
                  "This NFT has no description yet."}
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            sx={{
              background: "#383F4E",
              height: "auto",
              width: "400px",
              borderRadius: "4px",
              mt: "16px",
              mr: "15px",
            }}
          >
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                margin: "0 16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel6a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Properties
                </Typography>
              </AccordionSummary>
              <p className={classes.expandText}>
                Textual properties that describe your unique NFT{" "}
              </p>

              <AccordionDetails
                style={{ background: "#252B37", padding: "0px" }}
              >
                <Box
                  sx={{ background: "#252B37", m: "0px", p: "15px" }}
                  className={classes.nftTitle}
                  onClick={handleClick("panel7")}
                >
                  <EditIcon className={classes.editPencil} />

                  {nftReducer &&
                  nftReducer.nftInfoById &&
                  nftReducer.nftInfoById?.properties?.length ? (
                    <>
                      <Box sx={{ display: "flex" }}>
                        {nftReducer.nftInfoById.properties.map(
                          (item, index) => {
                            return (
                              <Box
                                key={index}
                                sx={{
                                  border: "1px solid #60646F",
                                  m: "10px",
                                  p: "10px",
                                  borderRadius: "4px",
                                  maxWidth: "150px",
                                }}
                              >
                                <Typography
                                  style={{ wordBreak: "break-all" }}
                                  sx={{
                                    color: "#B6AEF6",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                  }}
                                >
                                  {item.name}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "16px", fontWeight: 400 }}
                                  style={{ wordBreak: "break-all" }}
                                >
                                  {item.value}
                                </Typography>
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    </>
                  ) : nftReducer.nftEditData &&
                    nftReducer.nftEditData &&
                    nftReducer.nftEditData?.properties?.length ? (
                    <>
                      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        {nftReducer.nftEditData.properties.map(
                          (item, index) => {
                            if (item.name && item.value) {
                              return (
                                <>
                                  {item.name && item.value && (
                                    <Box
                                      key={index}
                                      sx={{
                                        border: "1px solid #60646F",
                                        m: "0 10px 10px 0",
                                        p: "10px 4px",
                                        borderRadius: "4px",
                                        display: " flex",
                                        flex: " 1 100px",
                                        justifyContent: " center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        maxWidth: "150px",
                                      }}
                                    >
                                      <Typography
                                        style={{ wordBreak: "break-all" }}
                                        sx={{
                                          color: "#B6AEF6",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {item.name}
                                      </Typography>
                                      <Typography
                                        sx={{ fontSize: "16px" }}
                                        style={{ wordBreak: "break-all" }}
                                      >
                                        {item.value}
                                      </Typography>
                                    </Box>
                                  )}
                                </>
                              );
                            }
                          }
                        )}
                      </Box>
                    </>
                  ) : (
                    <Typography
                      sx={{ p: "15px 20px" }}
                      onClick={handleClick("panel7")}
                    >
                      No properties added yet
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            sx={{
              background: "#383F4E",
              height: "auto",
              width: "400px",
              borderRadius: "4px",
              mt: "16px",
              mr: "15px",
            }}
          >
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                margin: "0 16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel6a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Blockchain Info
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{ background: "#252B37" }}>
                <BlockChainInfo padding={true} info={blockChainInfo} />
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            sx={{
              background: "#383F4E",
              height: "auto",
              width: "400px",
              borderRadius: "4px",
              mt: "16px",
              mr: "15px",
            }}
          >
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
              style={{
                background: "rgba(255, 255, 255, 0.09)",
                margin: "0 16px",
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon style={{ color: "#FFF" }} />}
                id="panel6a-header"
              >
                <Typography style={{ color: "#FFF", fontSize: "16px" }}>
                  Transaction History
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{ background: "#252B37", padding: "0px 0px 0px" }}
              >
                <TrasactionHistory trasactionHistory={trasactionHistory} />
              </AccordionDetails>
            </Accordion>
          </Box>
          {/* <Box sx={{ marginBottom: "10px" }}>
            <AdditionalSection />
          </Box> */}
        </Box>
      ) : (
        <>
          <div className="content-container">
            <div
              className={`asset-box ${
                nftReducer?.expandedPanel === "panel3"
                  ? classes.assestWrapper
                  : classes.nftTitle
              }`}
              onClick={handleClick("panel3")}
            >
              <EditIcon className={classes.editPencil} />
              <div className="asset-container">
                {thumbnailPath || selectedAsset?.thumbnail ? (
                  <img
                    src={thumbnailPath || selectedAsset.thumbnail}
                    alt="thumnail"
                  />
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {selectedAsset?.type === "video" ||
                    (nftReducer.nftInfoById?.assets?.[0]?.type === "video" &&
                      showDefaultThumbail) ? (
                      <Image
                        src="/images/Videothumbnail.png"
                        layout="fill"
                        alt="video"
                      />
                    ) : (
                      <>
                        {selectedAsset?.type === "3d_model" ||
                        (nftReducer.nftInfoById?.assets?.[0]?.type ===
                          "3d_model" &&
                          showDefaultThumbail) ? (
                          <Image
                            src="/images/3Dthumbnail.png"
                            layout="fill"
                            alt="3d_model"
                          />
                        ) : (
                          <>
                            {selectedAsset?.type === "audio" ||
                            (nftReducer.nftInfoById?.assets?.[0]?.type ===
                              "audio" &&
                              showDefaultThumbail) ? (
                              <Image
                                src="/images/Audiothumbnail.png"
                                layout="fill"
                                alt="audio"
                              />
                            ) : (
                              <Image
                                src="/images/thumbnailnft.png"
                                layout="fill"
                                alt="3d_model"
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Box>
                )}
              </div>
            </div>
            <div className="meta-data">
              <Box>
                <Box
                  sx={{
                    background: "#383F4E",
                    borderRadius: "4px",
                    padding: "20px",
                  }}
                >
                  <Box>
                    <Typography
                      id={"totalEditionRightSide"}
                      className={classes.nftTitle}
                      onClick={handleClick("panel2")}
                      style={{ fontSize: "18px", fontWeight: 400 }}
                    >
                      <EditIcon className={classes.editPencil} />
                      Total Editions:{" "}
                      <span
                        style={{
                          marginLeft: "15px",
                          color: "#B6AEF6",
                          fontSize: "14px",
                        }}
                      >
                        {(nftReducer &&
                          nftReducer.nftEditData &&
                          nftReducer.nftEditData.totalEditions) ||
                          (nftReducer &&
                            nftReducer.nftInfoById &&
                            nftReducer.nftInfoById.totalEditions)}
                      </span>
                    </Typography>
                    <Typography
                      id={"titleRight"}
                      className={classes.nftTitle}
                      onClick={handleClick("panel1")}
                      sx={{ fontSize: "24px", fontWeight: 900 }}
                    >
                      <EditIcon className={classes.editPencil} />
                      {(nftReducer &&
                        nftReducer.nftEditData &&
                        nftReducer.nftEditData.title) ||
                        (nftReducer &&
                          nftReducer.nftInfoById &&
                          nftReducer.nftInfoById.title)}
                    </Typography>

                    {/*  {externalLinkElement()} */}

                    <Box
                      sx={{ mt: "10px", display: "flex" }}
                      onClick={handleClick("panel8")}
                      className={classes.nftTitle}
                      id={"tagsRight"}
                    >
                      <EditIcon className={classes.editPencil} />
                      <TagIcon />
                      <Typography
                        style={{
                          wordBreak: "break-all",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px",
                        }}
                        sx={{
                          ml: "10px",
                          fontSize: "14px",
                          padding: "5px",
                          color:
                            (nftReducer &&
                              nftReducer.nftInfoById &&
                              nftReducer.nftInfoById.tags) ||
                            (nftReducer &&
                              nftReducer.nftEditData &&
                              nftReducer.nftEditData.tags)
                              ? "#B6AEF6"
                              : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {nftReducer?.nftEditData?.tags?.length > 0
                          ? nftReducer?.nftEditData?.tags?.map((each) => {
                              if (each)
                                return (
                                  <span
                                    style={{
                                      background: "rgba(37, 43, 55, 0.4)",
                                      borderRadius: "24px",
                                      padding: "5px",
                                      marginRight: "4px",
                                      fontWeight: "400",
                                      fontSize: "14px",
                                      letterSpacing: "0.16px",
                                      color: "#B6AEF6",
                                    }}
                                  >
                                    {each}
                                  </span>
                                );
                            })
                          : "No tags added yet"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    background: "#383F4E",
                    borderRadius: "4px",
                    mt: "16px",
                    padding: "20px",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "18px",
                      fontWeight: 400,
                    }}
                  >
                    Creator:
                    <CollabaratorProfile
                      owner={
                        (nftReducer &&
                          nftReducer.nftInfoById &&
                          nftReducer.nftInfoById.owner) ||
                        {}
                      }
                    >
                      <span
                        style={{
                          marginLeft: "40px",
                          fontSize: "14px",
                          color: "#B6AEF6",
                        }}
                      >
                        {"@"}
                        {(nftReducer &&
                          nftReducer.nftInfoById &&
                          nftReducer.nftInfoById.owner &&
                          nftReducer.nftInfoById.owner.username) ||
                          ""}
                      </span>
                    </CollabaratorProfile>
                  </Typography>
                </Box>
                <Box
                  id={"propertiesRight"}
                  onClick={handleClick("panel7")}
                  className={classes.nftTitle}
                  sx={{
                    background: "#383F4E",
                    borderRadius: "4px",
                    mt: "16px",
                  }}
                >
                  <EditIcon className={classes.editPencil} />
                  <Box
                    sx={{
                      background: " rgba(255, 255, 255, 0.09)",
                      width: "100%",
                      padding: "10px 20px",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography style={{
                fontSize: "18px",
                fontWeight: 400,
              }}>Properties</Typography>
                    <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      Textual properties that describe your unique NFT
                    </Typography>
                  </Box>
                  <Box sx={{ p: "15px" }}>
                    {nftReducer &&
                    nftReducer.nftInfoById &&
                    nftReducer.nftInfoById?.properties?.length ? (
                      <>
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                          {nftReducer.nftInfoById.properties.map(
                            (item, index) => {
                              return (
                                <Box
                                  key={index}
                                  sx={{
                                    border: "1px solid #60646F",
                                    m: "10px",
                                    p: "10px",
                                    borderRadius: "4px",
                                    maxWidth: "150px",
                                  }}
                                >
                                  <Typography
                                    style={{ wordBreak: "break-all" }}
                                    sx={{
                                      color: "#B6AEF6",
                                      fontSize: "14px",
                                      fontWeight: 400,
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: "16px", fontWeight: 400 }}
                                    style={{ wordBreak: "break-all" }}
                                  >
                                    {item.value}
                                  </Typography>
                                </Box>
                              );
                            }
                          )}
                        </Box>
                      </>
                    ) : nftReducer.nftEditData &&
                      nftReducer.nftEditData &&
                      nftReducer.nftEditData?.properties?.length ? (
                      <>
                        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                          {nftReducer.nftEditData.properties.map(
                            (item, index) => {
                              if (item.name && item.value) {
                                return (
                                  <>
                                    {item.name && item.value && (
                                      <Box
                                        key={index}
                                        sx={{
                                          border: "1px solid #60646F",
                                          m: "0 10px 10px 0",
                                          p: "10px 4px",
                                          borderRadius: "4px",
                                          display: " flex",
                                          flex: " 1 100px",
                                          justifyContent: " center",
                                          alignItems: "center",
                                          flexDirection: "column",
                                          maxWidth: "150px",
                                        }}
                                      >
                                        <Typography
                                          style={{ wordBreak: "break-all" }}
                                          sx={{
                                            color: "#B6AEF6",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                          }}
                                        >
                                          {item.name}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: "16px",
                                            fontWeight: 400,
                                          }}
                                          style={{ wordBreak: "break-all" }}
                                        >
                                          {item.value}
                                        </Typography>
                                      </Box>
                                    )}
                                  </>
                                );
                              }
                            }
                          )}
                        </Box>
                      </>
                    ) : (
                      <Typography
                        sx={{ p: "15px 20px" }}
                        onClick={handleClick("panel7")}
                      >
                        No properties added yet
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export { TopSection };
