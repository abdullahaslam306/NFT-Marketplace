import React from "react";
import { FileUploadCloudIcon } from "../../BloIcons/index";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  fileuploadWrapper: {
    width: "100%",
    height: "50%",
    display: "flex",
    cursor: "pointer",
    margin: "30px 0",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: "5px",
    fontSize: "15px",
    padding: "5%",
    border: "2px dashed #abadb2",
    "&:hover": {
      border: "2px dashed #00E387 ",
    },
    "& p": {
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: "19px",
    },
    "& label": {
      display: "inline-block",
      backgroundColor: "#383f4e",
      color: "#00E387",
      padding: "0.5rem 1rem",
      borderRadius: "0.3rem",
      cursor: "pointer",
      // marginTop: "1rem",
    },
  },
  uploadIcon: {
    width: 50,
    height: 34,
  },
  textPadding: {
    padding: "5%",
    fontStyle: "normal",
    fontWeight: 900,
    fontSize: "20px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  paddingContent: {
    padding: 0,
  },
});
function InputFileUpload() {
  const classes = useStyles();
  return (
    <div className={classes.fileuploadWrapper}>
      <FileUploadCloudIcon className={classes.uploadIcon} />
      <Typography
        variant="h3"
        className={classes.textPadding}
        component="body1"
      >
        Select your main NFT
      </Typography>
      <Typography variant="body1" component="body1">
        Supported file types:
      </Typography>
      <Typography variant="body1" component="body1">
        {" "}
        Image: JPG, JPEG, PNG, GIF
      </Typography>
      <Typography variant="body1" component="body1">
        {" "}
        SVG Audio: mp3, WEBM
      </Typography>
      <Typography variant="body1" component="body1">
        WAV Video: mp4, mov
      </Typography>
      <Typography variant="body1" component="body1">
        3D model: GLB
      </Typography>
      <p className={classes.paddingContent}>Max size: 100mb</p>
      <input type="file" id="upload" hidden />
      <label htmlFor="upload" className={classes.label}>
        Choose file
      </label>
    </div>
  );
}
export { InputFileUpload };
