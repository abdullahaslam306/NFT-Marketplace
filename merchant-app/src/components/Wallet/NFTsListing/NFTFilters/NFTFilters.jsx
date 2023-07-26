import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Facebook from "@mui/icons-material/Search";
import { useMediaQuery, TextField, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import InputMultiSelect from "../../../InputMultiSelect/InputMultiSelect";
import { actions } from "../../../../actions";
import { useSelector } from "react-redux";
import FormControl from "@mui/material/FormControl";

let timeout = "";

export const NFTFilters = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedInput, setSelectedInput] = React.useState([]);
  const [selectedInputSmart, setSelectedInputSmart] = React.useState([]);
  let smartContractValues = [];
  let walletValues = [];
  const smartReducer = useSelector(
    (state) => (state && state.smartContractReducer) || {}
  );
  const walletReducer = useSelector(
    (state) => (state && state.walletReducer) || {}
  );

  const [filterValues, setFilterValues] = useState({
    walletUids: "",
    smartContractUids: "",
    title: "",
  });

  function saveInput(event) {
    dispatch(actions.nftActions.updateNFTSearch(event.target.value));
    dispatch(
      actions.nftActions.getNFTListAction(false, {
        ...filterValues,
        title: event.target.value,
      })
    );
  }

  const timefunction = (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      saveInput(event);
    }, 500);
  };

  const handleSearch = (event) => {
    timefunction(event);
    setFilterValues({ ...filterValues, title: event.target.value });
  };

  const handleClearWallet = () => {
    setSelectedInput([]);
  };

  const handleClearSmartContract = () => {
    setSelectedInputSmart([]);
  };

  const walletSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedInput(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const smartContractChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedInputSmart(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleApplyFilter = () => {
    dispatch(actions.nftActions.updateNFTPageNumber(0));
    dispatch(actions.nftActions.clearNFTList());
    dispatch(
      actions.nftActions.updateNFTFilter({
        walletUids: selectedInput,
        smartContractUids: selectedInputSmart,
      })
    );
  };

  useEffect(() => {
    dispatch(actions.walletActions.getWallets());
    dispatch(actions.smartContractActions.getSmartContractsList());
  }, []);

  if (
    smartReducer &&
    smartReducer.smartContractsList &&
    smartReducer.smartContractsList.length
  ) {
    smartReducer.smartContractsList.map((item) => {
      smartContractValues.push({
        name:
          item.attributes.platformName +
          " (" +
          item.attributes.tokenProtocol.toUpperCase() +
          ")",
        id: item.id,
      });
    });
  }
  if (
    walletReducer &&
    walletReducer.walletList &&
    walletReducer.walletList.length
  ) {
    walletReducer.walletList.map((item) => {
      walletValues.push({
        name: item.attributes.name ? item.attributes.name : "Null",
        id: item.id,
      });
    });
  }

  return (
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      <Box
        style={{
          padding: isMobile ? "0 4px " : "8px",
          width: isMobile ? "100%" : "300px",
          // paddingRight: isMobile && "0",
        }}
      >
        <TextField
          InputProps={{ endAdornment: <Facebook fontSize="large" /> }}
          InputLabelProps={{
            style: {
              color: "#BEBFC3",
            },
          }}
          // margin={!isMobile ? "normal" : ""}
          fullWidth
          // value={search}
          onChange={handleSearch}
          id="searchfiles"
          label="Search Files"
          name="searchfiles"
          autoComplete="searchfiles"
          variant="outlined"
        />
      </Box>
      {walletReducer &&
      walletReducer.walletList &&
      walletReducer.walletList.length ? (
        <Box style={{ padding: isMobile ? "8px 4px" : "8px" }}>
          <FormControl sx={{ width: isMobile ? "100%" : "300px" }}>
            <InputMultiSelect
              value={walletValues}
              label="All Wallets"
              onChange={walletSelectChange}
              selectedInput={selectedInput}
              fullWidth={true}
              handleClear={handleClearWallet}
              handleApplyFilter={handleApplyFilter}
            />
          </FormControl>
        </Box>
      ) : (
        ""
      )}
      {smartContractValues && smartContractValues.length ? (
        <Box style={{ padding: isMobile ? "0 4px 8px 4px" : "8px" }}>
          <FormControl sx={{ width: isMobile ? "100%" : "300px" }}>
            <InputMultiSelect
              value={smartContractValues}
              label="All Smart Contracts"
              onChange={smartContractChange}
              selectedInput={selectedInputSmart}
              fullWidth={true}
              handleClear={handleClearSmartContract}
              handleApplyFilter={handleApplyFilter}
            />
          </FormControl>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};
