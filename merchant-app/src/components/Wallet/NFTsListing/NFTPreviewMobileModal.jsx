import BasicButton from "../../Button/BasicButton";
import CustomModalV2 from "../../Modal/ModalV2";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  modalContainer: {
    padding: "50px 25px",
  },
  heading: {
    fontWeight: 900,
    fontSize: "20px",
  },
  description: {
    paddingTop: "10px",
    fontWeight: 400,
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

const NFTPreviewMobileModal = ({
  open,
  heading,
  description,
  handleClick,
  buttonLabel,
}) => {
  const classes = useStyles();

  return (
    <CustomModalV2
      className={classes.modalStyles}
      open={open}
      showCloseButton={false}
    >
      <div className={classes.modalContainer}>
        <div className={classes.heading}>{heading}</div>
        <div className={classes.description}>{description}</div>
        <BasicButton
          variant="outlined"
          onClickHandler={handleClick}
          title={buttonLabel}
          color="secondary"
          sx={{ float: "right", marginRight: "0" }}
        />
      </div>
    </CustomModalV2>
  );
};

export default NFTPreviewMobileModal;
