import React from "react";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";

const DragAndDropAsset = ({ dragging }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <div
        style={{
          width: isMobile ? "auto" : "24rem",
          height: isMobile ? "19rem" : "16rem",
          borderRadius: "10px",
          backgroundPosition: "top",
          backgroundSize: "10px 1px",
          backgroundRepeat: "repeat-x",
          borderColor: "gray",
          borderWidth: "2px",
          borderStyle: "dashed",
          backgroundColor: "#44474B",
        }}
      >
        <div
          style={{
            marginTop: "12%",
            textAlign: "center",
            color: "grey",
            //   fontSize: 36,
          }}
        >
          <CloudUploadIcon
            style={{ transform: "scale(1.7)", marginBottom: "0.5rem" }}
          />
          <div style={{ color: "white", fontSize: 25, fontWeight: 600 }}>
            {dragging ? (
              <span>Drop files here.</span>
            ) : (
              <span> Drag and drop files to upload</span>
            )}
          </div>
          <Typography
            style={{
              color: "white",
              fontSize: "12px",
              textAlign: "center",
              width: "50%",
              margin: "auto",
            }}
          >
            Supported file types:
            <br /> Image: JPG, PNG, GIF, SVG <br />
            Audio: mp3, WEBM, WAV <br />
            Video: mp4, mov <br />
            3D model: GLB
          </Typography>
          <Typography
            style={{ color: "white", fontSize: "12px", marginTop: "0.5rem" }}
          >
            Max file size: 100MB
          </Typography>
        </div>
      </div>
    </>
  );
};

export default DragAndDropAsset;
