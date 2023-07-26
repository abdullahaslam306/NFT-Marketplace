import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {
  Button,
  Box,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import { CloseSharp } from "@mui/icons-material";

import { FacebookShareButton, TwitterShareButton } from "react-share";
import SocialShareTag from "../socialShareTag";
import { useSelector } from "react-redux";

export default function ShareComponent({ shareUrl, title, nftId = "" }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobilePopover, setMobilePopover] = React.useState(false);
  const [socialShareTag, setSocialShareTag] = React.useState(false);
  const profileReducer = useSelector(
    (state) => (state && state.profileReducer) || {}
  );

  const handleClick = (event) => {
    setSocialShareTag(true);
    setAnchorEl(event.currentTarget);
    setTimeout(() => {
      setSocialShareTag(false);
    }, 500);
  };

  const handleClickMobile = () => {
    setMobilePopover((mobilePopover) => !mobilePopover);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      {socialShareTag && (
        <SocialShareTag
          email={
            profileReducer &&
            profileReducer.userProfile &&
            profileReducer.userProfile.email
          }
          nftId={nftId}
        />
      )}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Button
          aria-describedby={id}
          variant="outlined"
          onClick={handleClick}
          sx={{ mx: 0 }}
          endIcon={<ShareIcon />}
        >
          Share
        </Button>
        <Popover
          id={id}
          open={open}
          className="sharePopover"
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          sx={{ width: "300px" }}
        >
          <Typography sx={{ p: "24px", fontSize: "20px", fontWeight: "900" }}>
            Share with
          </Typography>

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing="2"
          >
            <Box sx={{ mr: "16px" }}>
              <TwitterShareButton url={shareUrl} title={title}>
                <IconButton
                  aria-label="facebook"
                  sx={{
                    background: "rgba(46, 51, 64, 1)",
                    width: "72px",
                    height: "72px",
                    m: "0 auto",
                  }}
                >
                  <TwitterIcon color="primary" sx={{ fontSize: "22px" }} />
                </IconButton>
              </TwitterShareButton>

              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "12px",
                  fontWeight: "normal",
                  textAlign: "center",
                  mt: "8px",
                }}
              >
                Twitter
              </Typography>
            </Box>

            <Box sx={{ mr: "16px" }}>
              <FacebookShareButton url={shareUrl} quote={title}>
                <IconButton
                  aria-label="facebook"
                  sx={{
                    background: "rgba(46, 51, 64, 1)",
                    width: "72px",
                    height: "72px",
                    m: "0 auto",
                  }}
                >
                  <FacebookIcon color="primary" sx={{ fontSize: "22px" }} />
                </IconButton>
              </FacebookShareButton>
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "12px",
                  fontWeight: "normal",
                  textAlign: "center",
                  mt: "8px",
                }}
              >
                Facebook
              </Typography>
            </Box>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="share-input"
          >
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "12px",
                fontWeight: "normal",
                textAlign: "center",
                mt: "24px",
              }}
            >
              Or share with link
            </Typography>
            <TextField
              variant="filled"
              multiline
              disabled
              style={{
                background: "rgba(46, 51, 64, 1)",
                borderBottom: "0px",
                margin: "24px",
                width: "100%",
                borderRadius: "4px",
                borderColor: "transparent",
                padding: "12px!important",
                WebkitTextFillColor: "#FFF",
              }}
              id="wallet-address"
              value={shareUrl}
              inputProps={{
                style: {
                  fontSize: "13px",
                  color: "#FFF",
                  padding: "12px!important",
                  WebkitTextFillColor: "#FFF",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      style={{ margin: "10px 0 10px 0", justifyContent: "end" }}
                      onClick={handleCopy}
                    >
                      <ContentCopySharpIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Popover>
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Button
          aria-describedby={id}
          variant="outlined"
          fullWidth
          onClick={handleClickMobile}
          sx={{ mx: 0 }}
          endIcon={<ShareIcon />}
        >
          Share
        </Button>

        {mobilePopover && (
          <Box
            className="sharePopover"
            sx={{ width: "100%", background: "rgba(56, 63, 78, 1)" }}
          >
            <Grid container>
              <Grid item xs={10}>
                <Typography
                  sx={{ p: "24px", fontSize: "20px", fontWeight: "900" }}
                >
                  Share with
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "end" }}>
                <Button
                  onClick={handleClickMobile}
                  style={{ margin: 0, paddingTop: "25px" }}
                >
                  <CloseSharp color="error" fontSize="large" />
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing="2"
            >
              <Box sx={{ mr: "16px" }}>
                <TwitterShareButton url={shareUrl} title={title}>
                  <IconButton
                    aria-label="facebook"
                    sx={{
                      background: "rgba(46, 51, 64, 1)",
                      width: "72px",
                      height: "72px",
                      m: "0 auto",
                    }}
                  >
                    <TwitterIcon color="primary" sx={{ fontSize: "22px" }} />
                  </IconButton>
                </TwitterShareButton>

                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "12px",
                    fontWeight: "normal",
                    textAlign: "center",
                    mt: "8px",
                  }}
                >
                  Twitter
                </Typography>
              </Box>

              <Box sx={{ mr: "16px" }}>
                <FacebookShareButton
                  url={shareUrl}
                  quote={title}
                  hashtag="#blocommerce"
                >
                  <IconButton
                    aria-label="facebook"
                    sx={{
                      background: "rgba(46, 51, 64, 1)",
                      width: "72px",
                      height: "72px",
                      m: "0 auto",
                    }}
                  >
                    <FacebookIcon color="primary" sx={{ fontSize: "22px" }} />
                  </IconButton>
                </FacebookShareButton>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "12px",
                    fontWeight: "normal",
                    textAlign: "center",
                    mt: "8px",
                  }}
                >
                  Facebook
                </Typography>
              </Box>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "12px",
                  fontWeight: "normal",
                  textAlign: "center",
                  mt: "24px",
                }}
              >
                Or share with link
              </Typography>
            </Grid>
            <TextField
              variant="filled"
              disabled
              style={{
                background: "rgba(46, 51, 64, 1)",
                borderBottom: "0px",
                width: "92%",
                margin: "20px",
                borderRadius: "4px",
                borderColor: "transparent",
                paddingTop: 0,
                WebkitTextFillColor: "#FFF",
              }}
              id="wallet-address"
              value={shareUrl}
              inputProps={{
                style: {
                  fontSize: "13px",
                  color: "#FFF",
                  padding: "20px",
                  WebkitTextFillColor: "#FFF",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      color="primary"
                      style={{ margin: "10px 0 10px 0", justifyContent: "end" }}
                      onClick={handleCopy}
                    >
                      <ContentCopySharpIcon />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
}
