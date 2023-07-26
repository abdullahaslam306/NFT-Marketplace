import * as React from "react";
import ErrorOutlineSharpIcon from "@mui/icons-material/ErrorOutlineSharp";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import Snackbar from "@mui/material/Snackbar";
import { Typography, Grid, Button } from "@mui/material";
import Slide from "@mui/material/Slide";
import { actions } from "../../actions";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function PositionedSnackbar({
  message,
  isOpen,
  button,
  type = "error",
}) {
  const [state, setState] = React.useState({
    open: isOpen,
    vertical: "bottom",
    horizontal: "center",
    transition: Slide,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    setState({ ...state, open: isOpen });
  }, [isOpen]);

  const handleClose = () => {
    setState({ ...state, open: false });
    dispatch(actions.commonActions.closeSnackBar());
  };
  return (
    <div>
      <Snackbar
        style={{
          bottom: "60px",
          width: "auto",
          marginBottom: "20px",
        }}
        autoHideDuration={15000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={state.open}
        TransitionComponent={SlideTransition}
        onClose={handleClose}
        message={message}
        key={state.vertical + state.horizontal}
      >
        <Grid
          container
          style={{
            background: "#383F4E",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <Grid item>
            {type === "error" && <ErrorOutlineSharpIcon color="error" />}
            {type === "success" && (
              <CheckCircleOutlineSharpIcon color="success" />
            )}
          </Grid>
          <Grid item xs>
            <Typography
              style={{
                marginLeft: "10px",
                color: type === "error" ? "#DFA6A5" : "#00E387",
              }}
            >
              {message}
            </Typography>
          </Grid>
          {button && (
            <Grid item>
              <React.Fragment>
                <Button
                  color="primary"
                  size="small"
                  sx={{ m: 0 }}
                  onClick={handleClose}
                >
                  {button}
                </Button>
              </React.Fragment>
            </Grid>
          )}
        </Grid>
      </Snackbar>
    </div>
  );
}
