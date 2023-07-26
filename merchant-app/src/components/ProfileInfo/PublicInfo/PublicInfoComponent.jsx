import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Container, Grid, Box } from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  Link,
  AccountCircleSharp as AccountCircleSharpIcon,
} from "@mui/icons-material";
import { validateFileType } from "../../../utils/fileValidation";
import {
  FILE_EXTENSIONS_PROFILE_PICTURE_ERR,
  MAX_PROFILE_PICTURE_SIZE,
  MAX_PROFILE_PICTURE_SIZE_ERROR,
  VALID_FILE_EXTENSIONS_PROFILE_PICTURE,
} from "../../../utils/constants";
import { useSectionStyle } from "./style";
import { useStyles } from "../../LoadingIndicator/LoadingIndicatorStyles";
import { useTheme } from "@mui/material/styles";
import InputField from "../../InputField";
import ProfilePictureModal from "./ProfilePictureModal";
import { actions } from "../../../actions";
import { profileActions } from "../../../actions/profileActions";

export function PublicInfoComponent({
  props,
  userProfile,
  handleChange,
  values,
  userNameErrorMessage,
}) {
  const myJSON = JSON.stringify(props);
  const theme = useTheme();
  const profileClasses = useSectionStyle(theme);
  const classes = useStyles(theme);
  const hiddenFileInput = useRef(null);
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState(false);
  const [file, setFile] = useState();
  const profile = useSelector((state) => state.profileReducer || {});
  const user = useSelector((state) => state.profileReducer || {});
  const { profileImage } = profile;

  const validateProfilePicture = () => {
    const inputFile = document.getElementById("profilePicure");
    const validateFileRes = validateFileType(
      inputFile.files[0],
      inputFile.size,
      VALID_FILE_EXTENSIONS_PROFILE_PICTURE,
      FILE_EXTENSIONS_PROFILE_PICTURE_ERR,
      MAX_PROFILE_PICTURE_SIZE,
      MAX_PROFILE_PICTURE_SIZE_ERROR
    );
    if (validateFileRes === MAX_PROFILE_PICTURE_SIZE_ERROR) {
      dispatch(
        actions.commonActions.displaySnackbar(MAX_PROFILE_PICTURE_SIZE_ERROR)
      );
    }
    if (validateFileRes === FILE_EXTENSIONS_PROFILE_PICTURE_ERR) {
      dispatch(
        actions.commonActions.displaySnackbar(
          FILE_EXTENSIONS_PROFILE_PICTURE_ERR
        )
      );
    }
    if (validateFileRes === "validated") {
      setFile(inputFile);
      setModalState(true);
    }
  };

  const getProfilePicture = async () => {
    try {
      await dispatch(
        profileActions.getS3CredentialsForFetchingProfileImage(
          user?.userProfile?.picture
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.userProfile?.picture) {
      getProfilePicture();
    }
  }, [user?.userProfile?.picture]);

  const handleClose = () => {
    setModalState(false);
  };

  return (
    <Container
      className={profileClasses.container}
      sx={{ padding: { sm: "48px!important", xs: "16px!important" } }}
    >
      <Grid container className={classes.container}>
        <Grid
          item
          xs={12}
          md={3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          sx={{ pr: "16px" }}
        >
          <ProfilePictureModal
            modalState={modalState}
            modalStyles={classes.modal}
            buttonStyle={classes.centreButton}
            closeModal={handleClose}
            file={file}
          />
          <Box>
            <input
              style={{
                opacity: "-1",
                height: "250px",
                width: "100%",
                display: "none",
              }}
              type="file"
              id="profilePicure"
              accept={"." + VALID_FILE_EXTENSIONS_PROFILE_PICTURE.join(",.")}
              onChange={validateProfilePicture}
              ref={hiddenFileInput}
            />
            {profileImage ? (
              <div className={classes.imageCropper}>
                <img
                  // style={{ marginTop: '-300px', borderRadius: '50%' }}
                  src={profileImage}
                  className={classes.profileImage}
                  alt="profilePicture"
                />
              </div>
            ) : (
              <AccountCircleSharpIcon
                style={{ height: "151px", width: "151px" }}
                className={classes.avatar}
              />
            )}
            <Typography
              className={classes.uploadPictureLabel}
              onClick={() => hiddenFileInput?.current?.click()}
            >
              Upload Profile Photo
            </Typography>
            <img
              style={{ display: "none" }}
              id="placeHolderImage"
              src=""
              alt=""
            />
            {/* <Grid item xs={12} md={12}>
            
            </Grid> */}
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={4.5} sx={{ pr: "16px" }}>
          <InputField
            disabled={myJSON === "true" ? false : true}
            fullWidth
            margin="normal"
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            variant="outlined"
            startAdornment={<p>@</p>}
            onChange={handleChange}
            value={values.username}
          />
          {userNameErrorMessage && (
            <Typography color="error" className={profileClasses.errorClass}>
              {userNameErrorMessage}
            </Typography>
          )}
          <span className="social-media">
            <InputField
              disabled={myJSON === "true" ? false : true}
              InputProps={{ paddingTop: "10px" }}
              startAdornment={<Facebook />}
              adonrment={
                <a
                  href={`https://www.facebook.com/${values.facebook}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Link color="primary" />
                </a>
              }
              margin="normal"
              fullWidth
              id="fbprofilelink"
              label="Facebook Username"
              name="facebook"
              autoComplete="facebook"
              variant="outlined"
              onChange={handleChange}
              value={values.facebook}
              color="primary"
            />
            {values.facebookError && (
              <Typography color="error" className={profileClasses.errorClass}>
                Invalid facebook profile
              </Typography>
            )}
            <InputField
              disabled={myJSON === "true" ? false : true}
              InputProps={{ startAdornment: <Twitter /> }}
              startAdornment={<Twitter />}
              margin="normal"
              fullWidth
              id="twitterusername"
              label="Twitter Username"
              name="twitter"
              autoComplete="twitter"
              variant="outlined"
              onChange={handleChange}
              value={values.twitter}
              adonrment={
                <a
                  href={`https://twitter.com/${values.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Link color="primary" />
                </a>
              }
            />
            {values.twitterError && (
              <Typography color="error" className={profileClasses.errorClass}>
                Invalid twitter username
              </Typography>
            )}
            <InputField
              disabled={myJSON === "true" ? false : true}
              InputProps={{
                startAdornment: <Instagram />,
              }}
              startAdornment={<Instagram />}
              margin="normal"
              adonrment={
                <a
                  href={`https://www.instagram.com/${values.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Link color="primary" />
                </a>
              }
              fullWidth
              id="instausername"
              label="Instagram Username"
              name="instagram"
              autoComplete="instagram"
              onChange={handleChange}
              variant="outlined"
              value={values.instagram}
              sx={{ color: theme.palette.primary }}
            />
            {values.instagramError && (
              <Typography color="error" className={profileClasses.errorClass}>
                Invalid Instagram username
              </Typography>
            )}
          </span>
        </Grid>
        <Grid item xs={12} sm={12} md={4.5}>
          <InputField
            inputProps={{ maxLength: 1000 }}
            disabled={myJSON === "true" ? false : true}
            multiline={true}
            rows={12}
            InputProps={{ className: classes.input1 }}
            fullWidth
            margin="normal"
            id="bio"
            label="Short Bio"
            name="bio"
            autoComplete="bio"
            variant="outlined"
            onChange={handleChange}
            value={values.bio}
          />
          <Typography
            style={{ color: "grey" }}
            className={profileClasses.errorClass}
          >
            Max 1000 Characters.
          </Typography>
          {values.shortBioError && (
            <Typography color="error" className={profileClasses.errorClass}>
              Bio should have max 1000 characters.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
