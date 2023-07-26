import React from "react";
import {FormControl, FormHelperText, InputLabel, OutlinedInput} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) =>  createStyles({
    root: {
        "& $notchedOutline": {
          borderWidth: 1,
          borderColor: ''
        },
        "&:hover $notchedOutline": {
          borderWidth: 1,
        },
        "&$focused $notchedOutline": {
          borderWidth: 1,
          borderColor: '#24D182 !important'
        },
      },
      error:{ borderWidth: 1,
        borderColor: '#000000 !important'},
      focused: {
      },
      notchedOutline: {},
}));

export default function InputField({id, name,value, onChange, label, disabled=false, fullWidth=false, error=false, adonrment=undefined, helperText, InputProps=undefined,
                                   multiline=false, rows=0, startAdornment=undefined, margin}){
    const  classes  = useStyles()
    return(
        <FormControl fullWidth={fullWidth} variant="outlined" disabled={disabled} margin={margin!==undefined?margin: "none"}>
            <InputLabel htmlFor="outlined-adornment">{label}</InputLabel>
            <OutlinedInput
                id={id}
                disabled={disabled}
                name={name}
                type={'text'}
                value={value}
                onChange={onChange}
                endAdornment={adonrment}
                error={error}
                label={label}
                multiline={multiline}
                classes={classes}
                rows={rows}
                InputProps={InputProps}
                startAdornment={startAdornment}
            />
            <FormHelperText sx={{fontSize: '0.95rem'}}>{helperText}</FormHelperText>
        </FormControl>
    )
}