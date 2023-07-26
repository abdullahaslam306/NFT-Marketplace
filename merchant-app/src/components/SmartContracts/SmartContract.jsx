import React, { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/styles";
import { useState } from "react";
import { actions } from "../../actions";
import { useSelector, useDispatch } from "react-redux";
import Menu from "../Menu/Menu";
import DisconnectModal from "./DisconnectModal/DisconnectModal";
import TableData from "./TableData";
import ImportSmartContractModal from "./ImportSmartContractModal/ImportSmartContractModal";
import ImportSmartContractTag from "../smartContractTag";

let anchorEl = null;
export default function SmartContracts() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(false);
  const [openDisconnectModal, setOpenDisconnectModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectedSmartContract, setSelectedSmartContract] = useState();
  const [smartContractTag, setSmartContractTag] = useState(false);
  const { commonReducer, smartContractReducer, profileReducer } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.smartContractActions.getSmartContractsList(true, {
        offset: 0,
        limit: 10,
      })
    );
  }, []);

  const handleMenuClick = (e, id) => {
    anchorEl = e.currentTarget;
    const items = smartContractReducer.smartContractsList.filter(
      (item) => item.id === id
    );
    setSelectedSmartContract(items[0]);
    setOpen(true);
  };

  const menuProps = {
    anchorEl,
    onClose: () => setOpen(false),
    open,
    menuItems: [
      {
        label: "Disconnect",
        onClick: () => {
          setOpen(false);
          setOpenDisconnectModal(true);
        },
      },
    ],
  };
  const closeModals = () => {
    if (!commonReducer.loading) {
      setOpenDisconnectModal(false);
      setOpenImportModal(false);
    }
  };

  const clickImportSmartContract = () => {
    setSmartContractTag(true);
    setOpenImportModal(true);
  };

  return (
    <>
      <Grid
        container
        sx={matches ? { float: "right" } : { mt: "10px", float: "left" }}
        style={{ marginTop: "0.75rem" }}
      >
        <Grid item md={6} sm={6} xs={9}>
          <Typography variant="h4" sx={{ mt: "20px" }}>
            Smart Contracts
          </Typography>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Button
            variant="outlined"
            color="primary"
            style={
              matches
                ? { float: "right", margin: "15px 0px 15px 0px" }
                : { margin: "16px 0px 16px 0px" }
            }
            onClick={clickImportSmartContract}
          >
            Import existing smart contract
          </Button>
        </Grid>
      </Grid>

      <Menu {...menuProps} />

      <DisconnectModal
        smartContract={selectedSmartContract}
        open={openDisconnectModal}
        closeModal={closeModals}
      />
      {openImportModal && (
        <>
          {smartContractTag && (
            <ImportSmartContractTag
              email={
                profileReducer &&
                profileReducer.userProfile &&
                profileReducer.userProfile.email
              }
            />
          )}
          <ImportSmartContractModal
            open={openImportModal}
            closeModal={closeModals}
          />
        </>
      )}

      {commonReducer?.loading &&
        smartContractReducer?.smartContractsList.length == 0 && (
          <CircularProgress style={{ marginLeft: "50%" }} color="primary" />
        )}

      <TableData
        data={smartContractReducer?.smartContractsList}
        handleMenuClick={handleMenuClick}
      />
    </>
  );
}
