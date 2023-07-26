import * as React from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { EtherIcon } from "src/BloIcons";

function useOnClickOutside(ref, handler, headRef) {
  useEffect(() => {
    const listener = (event) => {
      if (
        !ref.current ||
        ref.current.contains(event.target) ||
        !headRef.current ||
        headRef.current.contains(event.target)
        // event.target.id === "DrawerIcon"
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default function SwipeableTemporaryDrawer({
  open,
  drawerItems,
  handleDrawerClose,
  headRef,
}) {
  const [state, setState] = React.useState({
    left: false,
  });
  const commonReducer = useSelector((state) => state.commonReducer || {});
  const ref = React.useRef();

  useOnClickOutside(ref, () => handleDrawerClose(), headRef);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 250, background: "#383F4E", height: "100vh" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      ref={ref}
    >
      <List sx={{ mt: 10 }}>
        {drawerItems.map((menuItem, index) => (
          <Box key={index}>
            <ListItemButton
              selected={menuItem.text === "Admin"}
              key={menuItem.text}
              onClick={menuItem.onClick}
              sx={{
                background:
                  (commonReducer.drawer === menuItem.link ||
                    menuItem?.subItems?.find?.(
                      (item) => item.link === commonReducer.drawer
                    )) &&
                  "rgb(0 227 135 / 8%)",
              }}
            >
              <ListItemIcon>{menuItem.icon}</ListItemIcon>
              <ListItemText primary={menuItem.text} />

              {menuItem?.subItems?.length > 0 && menuItem.checked ? (
                <ExpandLess />
              ) : (
                menuItem?.subItems?.length > 0 && <ExpandMore />
              )}
            </ListItemButton>

            <Collapse in={menuItem.checked} timeout="auto" unmountOnExit>
              {menuItem?.subItems?.map((subItem, index) => (
                <List component="div" disablePadding key={index}>
                  <ListItemButton
                    sx={{
                      pl: open ? 4 : 2,
                      background:
                        commonReducer.drawer === subItem.link &&
                        "rgb(0 227 135 / 8%)",
                    }}
                    onClick={subItem.onClick}
                    id={subItem.class}
                  >
                    <ListItemIcon
                      sx={{
                        color: "rgba(255, 255, 255, 0.56)",
                        fontSize: { sm: "10px" },
                      }}
                    >
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.text}
                      sx={{ fontSize: { sm: "12px" } }}
                    />
                  </ListItemButton>
                </List>
              ))}
            </Collapse>
          </Box>
        ))}
      </List>

      <Box
        sx={{
          border: "1px solid rgba(255, 255, 255, 0.23)",
          margin: "0 40px 0 40px",
          padding: "8px",
          borderRadius: "4px",
          display: "flex",
          bottom: "10%",
          position: "absolute",
          alignItems: "center",
        }}
      >
        <EtherIcon color="primary" />
        <Box
          sx={{
            flexWrap: "wrap",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <Typography
            sx={{ fontSize: "16px", color: "#FFF", ml: "15px" }}
            component="div"
          >
            Ethereum Main
          </Typography>
          <Typography
            sx={{ fontSize: "16px", color: "#FFF", ml: "15px" }}
            component="div"
          >
            Network
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <div>
      <SwipeableDrawer
        anchor={"left"}
        open={open}
        onOpen={() => {}}
        onClose={() => {}}
      >
        {list("left")}
      </SwipeableDrawer>
    </div>
  );
}
