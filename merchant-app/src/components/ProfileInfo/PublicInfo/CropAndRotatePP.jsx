import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getOrientation } from "get-orientation/browser";
import { useDispatch, useSelector } from "react-redux";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { Button, CircularProgress, Slider, Typography } from "@mui/material";
import { s3upload } from "../../../utils/s3Upload";
import { getCroppedImg, getRotatedImage } from "../../../utils/canvas";
import { getS3CredentialsForImageUplaoding } from "../../../services/profileServices";
import { actions } from "../../../actions";
import { withStyles } from "@mui/styles";
import SuccessModal from "../../successModal/index";

const styles = (theme) => ({
  cropContainer: {
    position: "relative",
    width: "31rem",
    height: "31rem",
    maxHeight: "65vh",
    background: "#282B30",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  cropButton: {
    flexShrink: 0,
    marginLeft: 16,
  },
  controls: {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    // [theme.breakpoints.up("sm")]: {
    //   flexDirection: "column",
    //   alignItems: "center",
    // },
  },
  subControls: {
    display: "flex",
    flexDirection: "row",
  },
  sliderContainer: {
    display: "flex",
    width: "14rem",
    flex: "1",
    alignItems: "center",
    flexDirection: "column",
  },
  sliderLabel: {
    // [theme.breakpoints.down("xs")]: {
    //   minWidth: 65,
    // },
  },
  slider: {
    padding: "22px 0px",
    marginLeft: 16,
    // [theme.breakpoints.up("sm")]: {
    //   flexDirection: "row",
    //   alignItems: "center",
    //   margin: "0 16px",
    // },
  },
  containerClass: {
    maxHeight: "65vh",
  },
});

const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

let { commonActions, profileActions } = actions;

const CropAndRotatePP = ({ classes, file, closeModal, fileName }) => {
  const onFileChange = async (e) => {
    const file = e.files[0];
    let imageDataUrl = await readFile(file);

    const orientation = await getOrientation(file);
    const rotation = ORIENTATION_TO_ANGLE[orientation];
    if (rotation) {
      imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
    }
    setImageSrc(imageDataUrl);
  };

  const [imageSrc, setImageSrc] = React.useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const dispatch = useDispatch();
  const [croppedImage, setCroppedImage] = useState();
  const user = useSelector((state) => state.profileReducer);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(() => croppedImage);

      const s3Credentials = await getS3CredentialsForImageUplaoding();
      const img = document.getElementById("placeHolderImage");
      img.src = croppedImage;

      fetch(img.src)
        .then((res) => res.blob())
        .then(async (blob) => {
          const file = new File([blob], fileName, blob);
          const s3Response = await s3upload(file, s3Credentials);
          dispatch(
            actions.profileActions.updateUserProfile(
              {
                picture: s3Response.Key,
              },
              profileActions.getS3CredentialsForFetchingProfileImage,
              s3Response.Key,
              true
            )
          );
          setLoading(false);
          dispatch(profileActions.getUserProfile());
        });
    } catch (e) {
      setLoading(false);
      dispatch(commonActions.displaySnackbar(e.message));
    }
  }, [imageSrc, croppedAreaPixels, rotation, fileName, dispatch]);

  useEffect(() => {
    setImageSrc(onFileChange(file));
  }, []);

  if (loading)
    return (
      <div style={{ margin: "5rem" }}>
        <CircularProgress style={{ marginLeft: "43%", color: "#00e387" }} />
        <h2>Updating profile Photo...</h2>
      </div>
    );

  // if (croppedImage) return <SuccessModal closeParentModal={closeModal} />;
  if (croppedImage) {
    setTimeout(() => {
      closeModal();
      // TODO: This should not be here, there is a performance issue for infinite call of this action in public info component
      dispatch(commonActions.setModalState(false));
    }, 4000);
    return (
      <SuccessModal
        text="Profile photo was updated successfully."
        open={!!croppedImage}
        closeModal={() => closeModal()}
      />
    );
  }

  return (
    <div>
      {imageSrc && (
        <React.Fragment>
          <div className={classes.cropContainer}>
            <Button
              onClick={() => {
                closeModal();
              }}
              style={{
                position: "absolute",
                right: 0,
                top: "15px",
                zIndex: 1,
                marginRight: "0",
              }}
            >
              <CloseSharpIcon color="error" />
            </Button>
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              classes={{
                containerClassName: classes.containerClass,
                cropAreaClassName: classes.containerClass,
                mediaClassName: classes.containerClass,
              }}
            />
          </div>
          <div className={classes.controls}>
            <div className={classes.subControls}>
              <div className={classes.sliderContainer}>
                <Typography
                  variant="overline"
                  classes={{ root: classes.sliderLabel }}
                >
                  Zoom
                </Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  classes={{ root: classes.slider }}
                  onChange={(e, zoom) => setZoom(zoom)}
                />
              </div>
              <div
                className={classes.sliderContainer}
                style={{ marginLeft: "1rem" }}
              >
                <Typography
                  variant="overline"
                  classes={{ root: classes.sliderLabel }}
                >
                  Rotation
                </Typography>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  classes={{ root: classes.slider }}
                  onChange={(e, rotation) => setRotation(rotation)}
                />
              </div>
            </div>
            <Button
              onClick={showCroppedImage}
              variant="contained"
              color="primary"
              classes={{ root: classes.cropButton }}
            >
              Change Profile Photo
            </Button>
          </div>
          {/* <ImgDialog img={croppedImage} onClose={onClose} /> */}
        </React.Fragment>
      )}
    </div>
  );
};

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export default withStyles(styles)(CropAndRotatePP);
