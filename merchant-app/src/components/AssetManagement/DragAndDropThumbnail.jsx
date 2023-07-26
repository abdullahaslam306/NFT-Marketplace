import React from "react";

import { Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const DragAndDropForThumbnail = ({ dragging }) => {
  return (
    <>
      <div
        style={{
          width: "25rem",
          height: "16rem",
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
            marginTop: "20%",
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
              <span> Choose an image to upload</span>
            )}
          </div>
          <Typography
            style={{
              color: "white",
              fontSize: "16px",
              textAlign: "center",
              width: "50%",
              margin: "auto",
              marginTop: "0.5rem",
            }}
          >
            Max file size: 20 MB
          </Typography>
        </div>
      </div>
    </>
  );
};

export default DragAndDropForThumbnail;
