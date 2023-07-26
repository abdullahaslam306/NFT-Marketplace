import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

export default function InputField({
  value,
  onChange,
  label,
  fullWidth = false,
  error = false,
  adornment = undefined,
  helperText,
  autocomplete = "off",
}) {
  return (
    <FormControl fullWidth={fullWidth} variant="outlined">
      <InputLabel htmlFor="outlined-adornment">{label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment"
        type={"text"}
        value={value}
        onChange={onChange}
        endAdornment={adornment}
        error={error}
        label={label}
        autoComplete={autocomplete}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
