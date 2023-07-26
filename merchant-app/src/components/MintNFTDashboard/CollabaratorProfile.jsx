import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import { makeStyles } from "@mui/styles";
import { Link, Grid, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../actions";
import { downloadS3SignedURL } from "../../utils/s3Upload";

function CollabaratorProfile(props) {
  const dispatch = useDispatch();
  const classes = collaboatorProfileStyle();
  let { owner } = props;
  const profileReducer = useSelector(
    (state) => (state && state.profileReducer) || {}
  );
  const [imgURL, setImgURL] = useState("");

  useEffect(() => {
    try {
      if (owner.picture) {
        if (owner.externalLink) {
          if (owner.tempCred) {
            downloadS3SignedURL(
              owner.tempCred,
              owner.picture,
              "blocommerce-user-meta-data"
            ).then((res) => {
              setImgURL(res);
            });
          }
        } else {
          dispatch(
            actions.profileActions.getS3CredentialsForFetchingProfileImage(
              owner?.picture
            )
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [owner.tempCred]);
  return (
    <CustomWidthTooltip
      title={
        <div className={classes.profileWrapper}>
          <div className={classes.imageCropper}>
            {owner.picture && (profileReducer.profileImage || imgURL) ? (
              <img
                alt="profile image"
                src={owner.externalLink ? imgURL : profileReducer.profileImage}
              />
            ) : (
              <Grid container style={{ justifyContent: "center" }}>
                <Grid item sx={{ mt: "20px" }}>
                  <AccountCircleIcon style={{ fontSize: "5rem" }} />
                </Grid>
              </Grid>
            )}
          </div>
          <h5>{owner.username ? "@" + owner.username : "Not Available"}</h5>
          <Grid container style={{ justifyContent: "center" }}>
            {owner.facebook && (
              <Grid item>
                <Link
                  href={`https://www.facebook.com/${owner.facebook}`}
                  target="_blank"
                >
                  <FacebookIcon className={classes.socialIcons} />
                </Link>
              </Grid>
            )}
            {owner.instagram && (
              <Grid item>
                <Link
                  href={`https://www.instagram.com/${owner.instagram}`}
                  target="_blank"
                >
                  <InstagramIcon className={classes.socialIcons} />
                </Link>
              </Grid>
            )}
            {owner.twitter && (
              <Grid item>
                <Link
                  href={`https://twitter.com/${owner.twitter}`}
                  target="_blank"
                >
                  <TwitterIcon className={classes.socialIcons} />
                </Link>
              </Grid>
            )}
          </Grid>
          {owner.bio && <Typography>{owner.bio}</Typography>}
        </div>
      }
    >
      {props.children}
    </CustomWidthTooltip>
  );
}

export { CollabaratorProfile };

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} placement="left" arrow />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    minWidth: 350,
    minHeight: 290,
    backgroundColor: "#383F4E",
  },
});

const collaboatorProfileStyle = makeStyles({
  profileWrapper: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    "& h5": {
      color: "#B6AEF6",
      fontSize: "14px",
      margin: "8px 0 18px 0",
      padding: "0",
    },
    "& p": {
      fontWeight: " 400",
      fontSize: " 14px",
      color: " rgba(255, 255, 255, 0.7)",
      fontWeight: 400,
    },
  },
  imageCropper: {
    width: "100px",
    height: "100px",
    position: "relative",
    overflow: "hidden",
    borderRadius: " 50%",
    "& img": {
      display: "inline",
      margin: "0 auto",
      height: "100%",
      width: "auto",
    },
  },
  socialIcons: {
    color: "#24D182",
    marginRight: "25px",
    width: "20px",
    height: "20px",
  },
});
