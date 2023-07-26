import React from "react";
import { MenuItem, TextField } from "@mui/material";

export default function SelectField({
  id,
  name,
  value,
  disabled,
  onChange,
  onClick = () => {},
  label,
  fullWidth = false,
  customStyles = {},
  customStylesForMenu = {},
  helperText,
  menuItems,
}) {
  return (
    <TextField
      select
      id={id}
      name={name}
      disabled={disabled}
      label={label}
      style={customStyles}
      value={value}
      onChange={onChange}
      helperText={helperText}
      fullWidth={fullWidth}
      // style={{  }}
      placeholder={label}
    >
      {menuItems.map((option) => (
        <MenuItem
          key={option.value || option.index}
          style={customStylesForMenu}
          onClick={() => onClick(option.value || option.name || option.index)}
          value={option.label || option.code}
        >
          {option.name || option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
