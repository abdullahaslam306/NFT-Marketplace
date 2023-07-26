import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Grid, Tooltip, Typography, useMediaQuery } from "@mui/material";
import {
  Image,
  LibraryBooks,
  Assignment,
  DateRange,
  Pending,
  VideoCameraBack,
} from "@mui/icons-material";
import Chip from "@mui/material/Chip";
import NFTCardMenu from "./NFTCardMenu";
import NFTCardMedia from "./NFTCardMedia";
import { ethereumIcon } from "../../../BloIcons/EthereumIcon";
import { DatetoHumanReadableUTC, FilterDate } from "../../../utils/helper";
import NFTPreviewMobileModal from "./NFTPreviewMobileModal";
import { useTheme } from "@mui/system";

export default function NFTCard({
  classes,
  data,
  onClose,
  tempCred,
  deleteNftClicked,
  handleOpenSendNft,
  setSelectedNft,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isNFTPreviewMobileModal, setIsNFTPreviewMobileModal] =
    React.useState(false);
  let matches = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const showPreview = () => {
    setIsNFTPreviewMobileModal(true);
  };

  const handleClickForNFTPReviewModal = () => {
    setIsNFTPreviewMobileModal(false);
    onClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let status = "";
  let createDate = "";
  let createDateBrief = "";

  const styleForTruncate = {
    width: "100px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  switch (data.status) {
    case "draft": {
      status = (
        <Chip
          icon={<Assignment sx={{ color: "#FFFFFF" }} />}
          label={"Draft"}
          className={classes.desktopChip}
        />
      );
      createDate = "Created on " + DatetoHumanReadableUTC(data.createdAt);
      createDateBrief = FilterDate(data.createdAt);
      break;
    }
    case "lazy": {
      status = (
        <Chip
          icon={ethereumIcon()}
          label={"Lazy Minted"}
          className={classes.desktopChip}
        />
      );
      createDate = "Lazy-minted on " + DatetoHumanReadableUTC(data.createdAt);
      createDateBrief = FilterDate(data.createdAt);
      break;
    }
    case "pending": {
      status = (
        <Chip
          icon={<Pending sx={{ color: "#B6AEF6" }} />}
          label={"Pending"}
          className={classes.desktopChip}
        />
      );
      createDate = "Created on " + DatetoHumanReadableUTC(data.createdAt);
      createDateBrief = FilterDate(data.createdAt);
      break;
    }
    case "live": {
      status = (
        <Chip
          icon={ethereumIcon()}
          label={"Locked"}
          className={classes.desktopChip}
        />
      );
      createDate = "Minted on " + DatetoHumanReadableUTC(data.createdAt);
      createDateBrief = FilterDate(data.createdAt);
      break;
    }

    default:
      break;
  }
  let type = data.assets[0]?.type || "N/A";
  if (type === "3d_model") {
    type = "3D Model";
  }
  return (
    <Card sx={{ background: "#383F4E" }}>
      <NFTPreviewMobileModal
        open={isNFTPreviewMobileModal}
        heading="You can only preview this NFT on mobile."
        buttonLabel="continue"
        description="In order to access the tools to edit your NFT, please proceed with your computer."
        handleClick={handleClickForNFTPReviewModal}
      />
      <CardHeader
        action={
          data.status !== "pending" && (
            <IconButton
              aria-label="settings"
              onClick={handleClick}
              disableRipple
            >
              <MoreVertIcon sx={{ color: "#FFFFFF" }} />
            </IconButton>
          )
        }
        title={
          <div style={isMobile ? styleForTruncate : {}} onClick={onClose}>
            {data.title}
          </div>
        }
        titleTypographyProps={{ noWrap: true }}
        className={classes.headerHover}
      />

      <NFTCardMenu
        data={data}
        showPreview={showPreview}
        open={open}
        handleClose={handleClose}
        anchorEl={anchorEl}
        handleOpenSendNft={handleOpenSendNft}
        deleteNftClicked={deleteNftClicked}
        setSelectedNft={setSelectedNft}
      />
      <CardMedia>
        <NFTCardMedia
          classes={classes}
          asset={data.assets}
          tempCred={tempCred}
        />
      </CardMedia>
      <CardContent
        className={classes.cardFooter}
        // sx={{ background: "#383F4E" }}
      >
        <Grid container={matches}>
          <Grid item>
            {type === "video" ? (
              <Chip
                icon={<VideoCameraBack sx={{ color: "#FFFFFF" }} />}
                label="Video"
                className={classes.desktopChip}
              />
            ) : (
              <Chip
                icon={<Image sx={{ color: "#FFFFFF" }} alt="chip" />}
                label={type}
                className={classes.desktopChip}
              />
            )}
          </Grid>
          {matches && (
            <Grid item>
              <Tooltip
                placement="top"
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      Wallet available editions {data.owners[0].editionsOwned}
                    </Typography>
                    <Typography color="inherit">
                      NFT total editions {data.totalEditions || "N/A"}
                    </Typography>
                  </React.Fragment>
                }
                arrow
              >
                <Chip
                  icon={<LibraryBooks sx={{ color: "#FFFFFF" }} />}
                  label={
                    data.owners[0].editionsOwned +
                    "/" +
                    (data.totalEditions || "NA")
                  }
                  className={classes.desktopChip}
                />
              </Tooltip>
            </Grid>
          )}

          <Grid item>{status}</Grid>
        </Grid>
        {matches && (
          <Grid container>
            <Grid item>
              <Tooltip
                placement="top"
                title={<Typography color="inherit">{createDate}</Typography>}
                arrow
              >
                <Chip
                  icon={<DateRange sx={{ color: "#FFFFFF" }} />}
                  label={createDateBrief}
                  className={classes.desktopChip}
                />
              </Tooltip>
            </Grid>
            {data.smartContract && data.smartContract.platformName && (
              <Grid item>
                <Chip
                  icon={<Assignment sx={{ color: "#FFF" }} />}
                  label={data.smartContract.platformName}
                  className={classes.desktopChip}
                />
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
