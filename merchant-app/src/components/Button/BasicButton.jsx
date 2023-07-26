import * as React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const BasicButton = ({
  variant = "outlined",
  color,
  disabled,
  title,
  type,
  onClickHandler,
  endIcon,
  sx,
  startIcon,
  size,
  fullWidth,
  id,
  ariaControls,
  ariaHaspopup,
  ariaExpanded,
  margin,
  loading = false,
}) => {
  return (
    <>
      {!loading ? (
        <Button
          type={type}
          onClick={onClickHandler}
          id={id}
          aria-controls={ariaControls}
          aria-haspopup={ariaHaspopup}
          aria-expanded={ariaExpanded}
          fullWidth={fullWidth}
          variant={variant}
          color={color}
          disabled={disabled}
          endIcon={endIcon}
          startIcon={startIcon}
          sx={sx}
          size={size}
          style={{ fontWeight: 500, fontSize: "15px", margin: margin }}
        >
          {title}
        </Button>
      ) : (
        <Button
          type={type}
          onClick={onClickHandler}
          id={id}
          aria-controls={ariaControls}
          aria-haspopup={ariaHaspopup}
          aria-expanded={ariaExpanded}
          fullWidth={fullWidth}
          variant={variant}
          color={color}
          endIcon={endIcon}
          startIcon={startIcon}
          sx={sx}
          size={size}
          style={{
            fontWeight: 500,
            fontSize: "15px",
            margin: margin,
            width: "100%",
            height: "40px",
          }}
        >
          <CircularProgress color="inherit" size={25} />
        </Button>
      )}
    </>
  );
};

export default BasicButton;
