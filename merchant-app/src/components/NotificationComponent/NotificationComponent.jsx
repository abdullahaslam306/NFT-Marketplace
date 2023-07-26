import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import { Badge, Box, Grid, Divider, Typography } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import IconButton from "@mui/material/IconButton";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PubNub from "pubnub";
import moment from "moment";
import { actions } from "../../actions";
import ClickAwayListener from '@mui/material/ClickAwayListener';

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 5,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function NotificationComponent() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [channelTimeToken, setChannelTimeToken] = React.useState("");
  const [notificationCount, setNotificationCount] = React.useState();
  const [notificationMobileView, setNotificationMobileView] = React.useState(false);
  const { profileUUID } = useSelector((state) => state.profileReducer || {});
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickListItemMobile = (event) => {
    setNotificationMobileView((notificationMobileView) => !notificationMobileView);
  };

  const handleClickAwayListener = () => {
    setNotificationMobileView(false);
  }

  const pubnub = new PubNub({
    subscribeKey: process.env.NEXT_PUBLIC_PUB_NUB_SUBSCRIBE_KEY,
    uuid: profileUUID,
  });

  const [channels] = useState([profileUUID]);
  const [notifications, addNotifications] = useState([]);
  const [message, setMessage] = useState("");

  const markAllAsRead = () => {
    let notificationAllRead =
      notifications &&
      notifications.channels &&
      notifications.channels[profileUUID];
    for (let i = 0; i < notificationAllRead?.length; i++) {
      if (!notificationAllRead[i].hasOwnProperty("actions")) {
        pubnub.addMessageAction(
          {
            channel: profileUUID,
            messageTimetoken: notificationAllRead[i].timetoken,
            action: {
              type: "receipt",
              value: "read",
            },
          },
          function (status, response) { }
        );
      }
    }
  };

  const handleReadReciepts = (value) => {
    pubnub.addMessageAction(
      {
        channel: profileUUID,
        messageTimetoken: value,
        action: {
          type: "receipt",
          value: "read",
        },
      },
      function (status, response) { }
    );
  };
  useEffect(() => {
    const pubnubFetchMessages = () => {
      pubnub.fetchMessages(
        {
          channels: [profileUUID],
          end: moment().subtract(60, "d").unix() * 10000,
          includeMessageActions: true,
          count: 100,
        },
        (status, response) => {
          addNotifications(response);
          setChannelTimeToken(response?.channels[profileUUID]?.[1]?.timetoken);
        }
      );
    };
    const interval = setInterval(() => {
       pubnubFetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [handleReadReciepts, profileUUID]);

  useEffect(() => {
    dispatch(actions.profileActions.getUserProfileUUID());
    pubnub.fetchMessages(
      {
        channels: [profileUUID],
        end: moment().subtract(60, "d").unix() * 10000,
        includeMessageActions: true,
        count: 100,
      },
      (status, response) => {
        addNotifications(response);
        setChannelTimeToken(response?.channels[profileUUID]?.[1]?.timetoken);
      }
    );
  }, [profileUUID]);

  useEffect(() => {
    let count = 0;
    let notificationArray =
      notifications &&
      notifications.channels &&
      notifications.channels[profileUUID];
    for (let i = 0; i < notificationArray?.length; i++) {
      if (!notificationArray[i].hasOwnProperty("actions")) {
        ++count;
      }
    }
    setNotificationCount(count);
  }, [notifications, profileUUID]);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
     
      <Box sx={{ display: { sm: "block", xs: "none" } }}>
        {notificationCount?.length < 0 ? (
          <IconButton
            aria-label="notification"
            color="active"
            onClick={handleClickListItem}
          >
            <NotificationsIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton
            aria-label="notification"
            color="active"
            onClick={handleClickListItem}
          >
            <StyledBadge badgeContent={notificationCount} color="primary">
              <NotificationsNoneIcon fontSize="large" />
            </StyledBadge>
          </IconButton>
        )}
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{ width: "500px" }}
          PaperProps={{
            style: {
              width: "500px",
              background: "rgba(56, 63, 78, 1)",
            },
          }}
          MenuListProps={{
            "aria-labelledby": "lock-button",
            role: "listbox",
          }}
        >
          <Grid container>
            <Grid item xs={6}>
              <Box component="p" sx={{ fontWeight: "500", pl: "16px" }}>
                Notifications
              </Box>
            </Grid>
            {notifications && (
              <Grid item xs={6} sx={{ textAlign: "end" }}>
                <Box
                  component="p"
                  sx={{ pr: "16px", cursor: "pointer" }}
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read{" "}
                  <CheckCircleOutlineIcon
                    sx={{ verticalAlign: "middle", fontSize: "12px" }}
                  ></CheckCircleOutlineIcon>
                </Box>
              </Grid>
            )}
          </Grid>

          <List sx={{ width: "100%" }} data-testid="notification-component">
            {notifications &&
              notifications.channels &&
              notifications.channels[profileUUID]
                ?.slice(0)
                .reverse()
                .map((notification, index) => {
                  return (
                    <>
                      <ListItem
                        key={index}
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          handleReadReciepts(notification?.timetoken)
                        }
                      >
                        <ListItemIcon sx={{ minWidth: "25px!important" }}>
                          <FiberManualRecordIcon
                            color={
                              notification.hasOwnProperty("actions")
                                ? ""
                                : "primary"
                            }
                            sx={{ fontSize: "8px" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  display: "inline",
                                  fontSize: "16px",
                                  fontWeight: notification.hasOwnProperty(
                                    "actions"
                                  )
                                    ? "400"
                                    : "900",
                                }}
                                color="rgba(255, 255, 255, 1)"
                              >
                                {notification.message.message}
                              </Typography>
                            </React.Fragment>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  display: "inline",
                                  fontSize: "12px",
                                  fontWeight: "400",
                                }}
                                color="rgba(105, 115, 134, 1)"
                              >
                                {moment(
                                  (notification?.timetoken / 10000000) * 1000
                                ).format("YYYY-MM-DD HH:mm:ss")}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </>
                  );
                })}

            {!notifications && (
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  component="p"
                  sx={{
                    display: "inline",
                    fontSize: "12px",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                  color="rgba(255, 255, 255, 1)"
                >
                  No Notifications
                </Typography>
              </Box>
            )}
          </List>
        </Menu>
      </Box>
      <ClickAwayListener onClickAway={handleClickAwayListener}>
      <Box sx={{ display: { sm: "none", xs: "block" } }}>
        {notificationCount?.length < 0 ? (
          <IconButton
            aria-label="notification"
            color="active"
            onClick={handleClickListItemMobile}
          >
            <NotificationsIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton
            aria-label="notification"
            color="active"
            onClick={handleClickListItemMobile}
          >
            <StyledBadge badgeContent={notificationCount} color="primary">
              <NotificationsNoneIcon fontSize="large" />
            </StyledBadge>
          </IconButton>
        )}
        {notificationMobileView && 
        <Box sx={{ width: "100%", paddingTop:"16px",position:"absolute", left:"0", paddingLeft:"16px!important", paddingRight:"16px!important"}}>
          <Box sx={{background: "rgba(56, 63, 78, 1)", position:"relative", height:"auto"}}>
            <Box sx={{height:"500px", overflow:"auto"}}>
          <Grid container>
            <Grid item xs={6}>
              <Box component="p" sx={{ fontWeight: "500", pl: "16px", color:"rgba(255, 255, 255, 0.65)" }}>
                Notifications
              </Box>
            </Grid>
            {notifications && (
              <Grid item xs={6} sx={{ textAlign: "end" }}>
                <Box
                  component="p"
                  sx={{ pr: "16px", cursor: "pointer", color:"rgba(255, 255, 255, 0.65)" }}
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read{" "}
                  <CheckCircleOutlineIcon
                    sx={{ verticalAlign: "middle", fontSize: "12px" }}
                  ></CheckCircleOutlineIcon>
                </Box>
              </Grid>
            )}
          </Grid>

          <List sx={{ width: "100%" }} data-testid="notification-component">
            {notifications &&
              notifications.channels &&
              notifications.channels[profileUUID]
                ?.slice(0)
                .reverse()
                .map((notification, index) => {
                  return (
                    <>
                      <ListItem
                        key={index}
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          handleReadReciepts(notification?.timetoken)
                        }
                      >
                        <ListItemIcon sx={{ minWidth: "25px!important" }}>
                          <FiberManualRecordIcon
                            color={
                              notification.hasOwnProperty("actions")
                                ? ""
                                : "primary"
                            }
                            sx={{ fontSize: "8px" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  display: "inline",
                                  fontSize: "16px",
                                  overflowWrap: "break-word",
                                  fontWeight: notification.hasOwnProperty(
                                    "actions"
                                  )
                                    ? "400"
                                    : "900",
                                }}
                                color="rgba(255, 255, 255, 1)"
                              >
                                {notification.message.message}
                              </Typography>
                            </React.Fragment>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{
                                  display: "inline",
                                  fontSize: "12px",
                                  fontWeight: "400",
                                }}
                                color="rgba(105, 115, 134, 1)"
                              >
                                {moment(
                                  (notification?.timetoken / 10000000) * 1000
                                ).format("YYYY-MM-DD HH:mm:ss")}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </>
                  );
                })}

            {!notifications && (
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  component="p"
                  sx={{
                    display: "inline",
                    fontSize: "12px",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                  color="rgba(255, 255, 255, 1)"
                >
                  No Notifications
                </Typography>
              </Box>
            )}
          </List>
          </Box>
          </Box>
        </Box>
}
      </Box>
      </ClickAwayListener>
    </>
  );
}
