import React from "react";

import { Menu, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: "#383F4E",
      color: "white",
    },
  },
}));

const BasicMenu = ({ menuItems, onClose, anchorEl, open, wallet }) => {
  const classes = useStyles();
  return (
    <Menu
      onClose={onClose}
      anchorEl={anchorEl}
      open={open}
      className={classes.menu}
    >
      {menuItems.map(({ label, onClick, isDisabled }) => (
        <MenuItem
          key={label}
          onClick={() => onClick(wallet)}
          disabled={isDisabled}
          //   selected={isSelected}
        >
          {label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default BasicMenu;
