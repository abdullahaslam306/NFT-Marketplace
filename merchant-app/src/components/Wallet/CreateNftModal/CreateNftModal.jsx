import * as React from "react";
import { useRouter } from "next/router";

import {
  Divider,
  MenuItem,
  Grid,
  Select,
  Typography,
  FormControl,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Modal from "../../Modal/ModalV2";
import BasicButton from "../../Button/BasicButton";
import { useStyles } from "./CreateNftModalStyles";

import { useDispatch } from "react-redux";
import { actions } from "../../../actions";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";

const SECONDARY_SALE_ROYALTY = 10;

export default function NFTCreationComponent({ open, handleClose, setOpen }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = React.useState({
    title: "",
    totalEditions: undefined,
    secondarySaleRoyalty: undefined,
    showZeroError: false,
  });

  React.useEffect(() => {
    setValues({
      title: "",
      totalEditions: undefined,
      secondarySaleRoyalty: undefined,
    });
  }, [open]);

  const [error, setError] = React.useState(false);
  const [zeError, setZeError] = React.useState(false);

  const handleChange = (event) => {
    let value = event.target.value;
    if (value && event.target.name === "secondarySaleRoyalty") {
      setError(false);
      if (parseFloat(value) < 0 || parseFloat(value) > 10) {
        setError(true);
      }
      if (parseFloat(value) % 1 != 0) {
        if (value.split(".")[1].length > 2) {
          value = parseFloat(value).toFixed(2);
        }
      }
    }
    if (value && event.target.name === "totalEditions") {
      value = value.replace(/\D/g, "");
    }
    if (value === "0" && event.target.name === "totalEditions") {
      setValues({
        ...values,
        showZeroError: true,
        [event.target.name]: value,
      });
      setZeError(true);
    } else {
      setZeError(false);
      setValues({
        ...values,
        showZeroError: false,
        [event.target.name]: value,
      });
    }
  };

  const pushToMintNft = async (id) => {
    router.push({
      pathname: `/nft/${id}/draft`,
    });
  };

  const createNFTClick = async () => {
    try {
      const data = {
        title: values.title,
        totalEditions: parseInt("" + values.totalEditions),
        secondarySaleRoyalty: parseFloat("" + SECONDARY_SALE_ROYALTY),
      };
      //setOpen(false);
      dispatch(actions.commonActions.updateCreateModalForNFT(false));
      dispatch(actions.nftActions.showHelpModal(true));
      dispatch(actions.nftActions.createNFTAction(true, data, pushToMintNft));
      setTimeout(() => {
        dispatch(actions.nftActions.resetNftInfoDetails());
      }, 2000);
    } catch (error) {
      dispatch(actions.nftActions.loading(false));
      setOpen(false);
    }
  };

  return (
    <Modal width={"40%"} mobileWidth={"95%"} open={open} onClose={handleClose}>
      <div className={classes.container}>
        <Typography variant="h4" style={{ marginTop: "60px" }}>
          Mint NFT
        </Typography>
        <Typography className={classes.disabledText}>
          Please provide the following information to start minting your NFT
        </Typography>

        <Divider className={classes.row} />

        <div className={classes.row} style={{ marginTop: "20px" }}>
          <div className={classes.column1}>Blockchain</div>
          <FormControl
            size="small"
            variant="outlined"
            className={classes.column2}
          >
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={1}
              className={classes.column2}
            >
              <MenuItem value={1}>Ethereum main network</MenuItem>
            </Select>
          </FormControl>
          {/* <div className={classes.column2}>
            <Chip variant={"outlined"} label={"Etherium Main Network"} />
          </div> */}
        </div>
        <div className={classes.row}>
          <div className={classes.column1}>Smart-Contract</div>
          <FormControl
            size="small"
            variant="outlined"
            className={classes.column2}
          >
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={1}
              className={classes.column2}
            >
              <MenuItem value={1}>Bloocommerce smart-contract</MenuItem>
            </Select>
          </FormControl>
        </div>

        <TextField
          margin="normal"
          fullWidth
          label="NFT Title"
          name="title"
          variant="outlined"
          onChange={handleChange}
          value={values.title}
        />

        <TextField
          margin="normal"
          fullWidth
          label="# of Editions"
          name="totalEditions"
          variant="outlined"
          onChange={handleChange}
          value={values.totalEditions}
        />
        {values.showZeroError && (
          <FormHelperText>
            You cannot mint an NFT with 0 edition.
          </FormHelperText>
        )}
        <FormControl variant="outlined" margin="normal" fullWidth>
          <InputLabel
            htmlFor="outlined-adornment-password"
            className={error ? classes.errorLabel : ""}
          >
            Royalties for Secondary Sales
          </InputLabel>
          <OutlinedInput
            label="Royalties for Secondary Sales"
            name="secondarySaleRoyalty"
            onChange={handleChange}
            value={SECONDARY_SALE_ROYALTY}
            disabled
            type={"number"}
            error={error}
            endAdornment={
              <InputAdornment position="end">
                {SECONDARY_SALE_ROYALTY && "%"}
              </InputAdornment>
            }
          />
          <FormHelperText sx={{ color: "#FFF", opacity: 0.7 }}>
            {/* For secondary sale royalties, suggest 0 to 10%; and not exceed 10%. */}
            You will receive 10% of the sales proceeds for all secondary sales
            on external NFT marketplaces.
          </FormHelperText>
        </FormControl>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="flex-end"
          justifyContent="flex-end"
          style={{ margin: "0px 0px" }}
        >
          <Grid item>
            <BasicButton
              variant="contained"
              color="primary"
              type="submit"
              title={"customize and mint your nft"}
              className={classes.centreButton}
              onClickHandler={createNFTClick}
              disabled={
                !(
                  values.title &&
                  SECONDARY_SALE_ROYALTY &&
                  values.totalEditions &&
                  !error &&
                  !zeError
                )
              }
              endIcon={<ArrowForwardIcon />}
            ></BasicButton>
          </Grid>
        </Grid>
        <div style={{ marginTop: "25px" }}></div>
      </div>
    </Modal>
  );
}
