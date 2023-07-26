import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomModalV2 from "../../Modal/ModalV2";
import { useSelector, useDispatch } from "react-redux";
import SelectField from "../../selectField/SelectField";
import InputField from "../../InputField";
import { actions } from "../../../actions";
import { ActionType } from "../../../utils/actionTypes";
import { useTheme } from "@emotion/react";

const importSmartContractModalStyles = makeStyles((theme) => ({
  box: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "4px",
    width: "auto",
    height: "auto",
    margin: "auto",
    padding: "25px",
    maxWidth: "550px",
    textAlign: "center",
  },
  container: {
    margin: "1.2rem",
  },
  divider: {
    margin: "1rem 0",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  mainHeading: {
    fontWeight: "900",
    fontSize: "1.25rem",
    lineHeight: "2rem",
    letterSpacing: "0.15px",
  },
  subHeading: {
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "143%",
    letterSpacing: "0.15px",
    paddingTop: "24px",
    color: "rgba(255, 255, 255, 0.7)",
  },
  fileName: {
    marginLeft: "0.4rem",
  },
  buttons: {
    textAlign: "right",
    padding: "32px 0 10px 0px",
  },
  deletingFiles: {
    display: "grid",
    placeItems: "center",
    marginTop: "4rem",
    textAlign: "center",
  },
}));

const ImportSmartContractModal = ({ open, closeModal }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const dispatch = useDispatch();
  const { commonReducer, smartContractReducer } = useSelector((state) => state);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");

  const classes = importSmartContractModalStyles();

  useEffect(() => {
    const { importSmartContractResponse } = smartContractReducer;
    if (importSmartContractResponse) {
      const { response } = importSmartContractResponse;
      if (response && response.includes("successfully")) {
        dispatch({
          type: ActionType.IMPORT_SMART_CONTRACT_RESPONSE,
          payload: null,
        });
        closeModal();
      } else setError(response);
    }
  }, [smartContractReducer]);

  useEffect(() => () => cleanUp(), []);

  const cleanUp = () => {
    dispatch(actions.smartContractActions.setImportSmartContractResponse());
    setAddress("");
    setError("");
  };

  const handleInputChange = (e) => {
    setAddress(e.target.value);
    if (error) {
      setError("");
      dispatch({
        type: ActionType.IMPORT_SMART_CONTRACT_RESPONSE,
        payload: null,
      });
    }
  };

  return (
    <CustomModalV2
      showCloseButton={!commonReducer?.loading}
      className={classes.modal}
      open={open}
      onClose={closeModal}
      width={"75%"}
      maxWidth={"500px"}
    >
      <div className={classes.container}>
        {commonReducer?.loading ? (
          <div className={classes.deletingFiles}>
            <CircularProgress />
            <h2>Importing your smart contract... </h2>
          </div>
        ) : (
          <>
            <Typography
              className={classes.mainHeading}
              style={{ margin: "16px 0px" }}
            >
              Import your smart contract
            </Typography>
            <div>
              <div className={classes.subHeading}>
                <SelectField
                  fullWidth={true}
                  label="Network"
                  id={"network"}
                  name="defaultNetwork"
                  value={"Ethereum"}
                  menuItems={[{ label: "Ethereum", code: "eth" }]}
                />
              </div>
              <div className={classes.subHeading}>
                <InputField
                  fullWidth={true}
                  multiline={true}
                  id="smartcontract"
                  label="Enter your ERC721 or ERC1155 contract address"
                  name="smartContract"
                  error={error}
                  value={address}
                  onChange={handleInputChange}
                  helperText={error}
                />
              </div>
            </div>
            <div className={classes.buttons}>
              <Button
                variant="contained"
                color="primary"
                sx={
                  matches
                    ? { margin: "8px", padding: "6px 16px" }
                    : { margin: "0px !important", padding: "6px 6px" }
                }
                disabled={!address}
                onClick={() =>
                  dispatch(
                    actions.smartContractActions.importExistingSmartContract({
                      address,
                    })
                  )
                }
              >
                Import smart contract
              </Button>
            </div>
          </>
        )}
      </div>
    </CustomModalV2>
  );
};

export default ImportSmartContractModal;
