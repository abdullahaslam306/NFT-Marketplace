import React, { useEffect } from "react";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useStyles, useOutlinedInputStyles } from "./PasswordInputFieldStyles";

/*
This component can be used on signup page by passing prop "showValidations={true}"
This component can be used on signup page by passing prop "showValidations={false}" by default it's value is false
*/

const PasswordInputField = ({
  value,
  onChange,
  label,
  helperText = "",
  error = false,
  fullWidth = false,
  showValidation = false,
}) => {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
    isValidPassword: true,
    showPwdValidators: false,
  });

  //Password validation states
  const [passwordValidators, setPasswordValidators] = React.useState({
    isContainLowerCase: false,
    isContainUpperCase: false,
    isContainSpecialChar: false,
    isContainMinimumLength: false,
    isContainNumber: false,
  });

  //Password validation function
  function validatePassword(password) {
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let isLengthValid = password.length > 7;
    let lc = /[a-z]/.test(password);
    let uc = /[A-Z]/.test(password);
    let sc = format.test(password);
    let number = /\d/.test(password);

    setPasswordValidators({
      isContainLowerCase: lc,
      isContainUpperCase: uc,
      isContainSpecialChar: sc,
      isContainMinimumLength: isLengthValid,
      isContainNumber: number,
    });

    return isLengthValid && lc && uc && sc && number;
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const onPwdChange = (event) => {
    let isValid = event.target.value
      ? validatePassword(event.target.value)
      : true;
    onChange(event, isValid);
  };

  useEffect(() => {
    let e = validatePassword(value);
    if (value === "") {
      e = true;
    }
    setValues({
      ...values,
      isValidPassword: e,
    });
  }, [value]);

  return (
    <FormControl fullWidth={fullWidth} variant="outlined">
      <InputLabel error={!values.isValidPassword} htmlFor="outlined-adornment" className={classes.inputLabel}>
        {label}
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={values.showPassword ? "text" : "password"}
        value={value}
        error={!values.isValidPassword}
        fullWidth
        onChange={onPwdChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              style={{ color: "#FFFFFF8F" }}
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
            >
              {values.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
        style={{ borderColor: "#B6AEF6" }}
      />
      {showValidation ? (
        <div style={{ padding: "10px 5px 0px 5px", opacity: 1 }}>
          <div className={classes.row}>
            <div
              className={classes.column}
              style={{
                color: passwordValidators.isContainLowerCase ? "#B6AEF6" : "",
              }}
            >
              One lowercase character
            </div>
            <div
              className={classes.column}
              style={{
                textAlign: "right",
                color: passwordValidators.isContainSpecialChar ? "#B6AEF6" : "",
              }}
            >
              One special character
            </div>
          </div>
          <div className={classes.row}>
            <div
              className={classes.column}
              style={{
                color: passwordValidators.isContainUpperCase ? "#B6AEF6" : "",
              }}
            >
              One uppercase character
            </div>
            <div
              className={classes.column}
              style={{
                textAlign: "right",
                color: passwordValidators.isContainMinimumLength
                  ? "#B6AEF6"
                  : "",
              }}
            >
              8 characters minimum
            </div>
          </div>
          <div className={classes.row}>
            <div
              className={classes.column}
              style={{
                color: passwordValidators.isContainNumber ? "#B6AEF6" : "",
              }}
            >
              One number
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default PasswordInputField;
