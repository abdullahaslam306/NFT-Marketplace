import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// MUI IMPORTS
import { Typography } from "@mui/material";
import Image from "next/image";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { actions } from "../../actions";
import { useRouter } from "next/router";
import { useTheme } from "@mui/styles";
import { useMediaQuery } from "@mui/material";
import { profileActions } from "src/actions/profileActions";
import NotificationComponent from "../NotificationComponent/NotificationComponent";

function HeaderComponent() {
  const authReducer = useSelector(
    (state) => (state && state.authReducer) || {}
  );
  const profile = useSelector((state) => state.profileReducer || {});
  const { profileImage } = profile;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleProfileBtn = () => {
    dispatch(actions.commonActions.setDrawerState("profile-setting"));
    setAnchorEl(null);
    //router.push("/profile", undefined, { shallow: true });
  };

  const logout = () => {
    setAnchorEl(null);
    dispatch(actions.authActions.logoutUser());
    router.push("/login");
  };

  const getProfilePicture = async () => {
    try {
      await dispatch(
        profileActions.getS3CredentialsForFetchingProfileImage(
          profile?.userProfile?.picture
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (profile?.userProfile?.picture && !profileImage) {
      getProfilePicture();
    }
  }, [profile?.userProfile?.picture]);

  let path = !authReducer.isAuthenticated;

  return (
    <>
      {path ? (
        <>
          <Toolbar
            sx={{
              mt: 2,
              marginBottom: "24px",
              justifyContent: "center",
              display: "flex",
              minHeight: "0px!important",
            }}
          >
            <Image
              width="124px"
              height="26px"
              alt="Blocommerce"
              src="/images/BLOCommerce_White.png"
            />
          </Toolbar>
        </>
      ) : (
        <>
          {!isMobile &&
          window?.location?.pathname !== "/nfts" &&
          window?.location?.pathname !== "/login" &&
          window?.location?.pathname !== "/authenticate" &&
          window?.location?.pathname !== "/register" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                dispatch(actions.commonActions.setDrawerState("nfts", true))
              }
              style={{ width: "8rem" }}
            >
              Mint NFT
            </Button>
          ) : (
            <></>
          )}
          {window?.location?.pathname !== "/login" &&
            window?.location?.pathname !== "/authenticate" &&
            window?.location?.pathname !== "/register" && (
              <Stack
                direction="row"
                sx={{
                  // position: "absolute",
                  // right: 0,
                  display: "flex",
                  top: { xs: "5px", md: "10px" },
                }}
                spacing={1}
              >
                <NotificationComponent />

                <IconButton
                  color="active"
                  sx={{ mr: "8px" }}
                  style={{ padding: 0, margin: 0 }}
                  aria-label="profile"
                  id="basic-button"
                  aria-controls="basic-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  {profileImage ? (
                    <img
                      // style={{ marginTop: '-300px', borderRadius: '50%' }}
                      src={profileImage}
                      style={{ width: "3rem", clipPath: "circle()" }}
                      alt="profilePicture"
                    />
                  ) : (
                    <AccountCircleIcon style={{ fontSize: "2rem" }} />
                  )}
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem onClick={handleProfileBtn}>
                    <ListItemIcon>
                      <SettingsIcon color="active" />
                    </ListItemIcon>
                    <Typography variant="inherit" color="text.white">
                      Profile Settings
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <ListItemIcon>
                      <LogoutIcon color="active" />
                    </ListItemIcon>
                    <Typography variant="inherit" color="text.white">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Stack>
            )}
        </>
      )}
    </>
  );
}

export default HeaderComponent;
