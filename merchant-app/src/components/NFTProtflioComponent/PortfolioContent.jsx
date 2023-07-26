import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Divider,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { experimentalStyled as styled } from "@mui/material/styles";
import ProtfolioGraph from "./PortfolioGraph";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import InputMultiSelect from "../InputMultiSelect/InputMultiSelect";
import moment from "moment";
import { actions } from "../../actions";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputAdornment from "@mui/material/InputAdornment";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CustomizedTables from "./PortfolioTable";
import CircularProgress from "@mui/material/CircularProgress";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  textTransform: "uppercase",
  fontSize: "12px",
  letterSpacing: "1px",
  color: "rgba(255, 255, 255, 0.5)",
  backgroundColor: "rgb(37 43 55)",
}));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    [(theme) => theme.breakpoints.only("md")]: {
      width: "60%",
    },
    [(theme) => theme.breakpoints.down("sm")]: {
      width: "75%",
    },
    [(theme) => theme.breakpoints.down("xs")]: {
      width: "75%",
      paddingLeft: "2px",
      marginTop: (theme) => theme.spacing(3.1),
    },
    background: "transparent",
    // paddingLeft: (theme)=>theme.spacing(9),
    zIndex: 1000,
    "& .MuiAppBar-colorDefault": {
      backgroundColor: "transparent !important",
      boxShadow: "none",
    },
    "& .Mui-selected": {
      borderBottom: `3px solid ${(theme) => theme.palette.primary.dark}`,
    },
    "& .MuiTabScrollButton-root": {
      color: (theme) => theme.palette.text.primary,
      [(theme) => theme.breakpoints.down("xs")]: {
        display: "auto",
      },
    },
    "& .MuiBox-root": {
      [(theme) => theme.breakpoints.down("xs")]: {
        padding: "0 !important",
      },
    },
  },
  labels: {
    textTransform: "uppercase",
    fontSize: "14px",
  },
  topSectionTxt: {
    top: "40px",
    fontSize: "20px",
    letterSpacing: "0.15px",
    color: "#FFFFFF",
    fontWeight: "900",
  },
  topsectionCard: {
    background: "rgba(56, 63, 78, 1)",
  },
  topsectionCardsecond: {
    border: "2px solid #576279",
    padding: "30px 8px",
    background: "#383F4E",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  },
}));

export function ProtfolioContent({ tabPanels }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles(theme);
  let today = moment().toDate().getTime();
  const [showDateRange, setShowDateRange] = useState(false);
  const [value, setValue] = React.useState([
    new Date(moment().subtract(90, "days")),
    today,
  ]);
  const [selectedInput, setSelectedInput] = React.useState([]);
  const [selectedSmartInput, setSelectedSmartInput] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [selectedDateRangeLabel, setSelectedDateRangeLabel] =
    React.useState("Last year");
  const [financialData, setFinancialData] = React.useState("transactions");
  const [isActiveTransactions, setActiveTransactions] = useState(true);
  const [isActiveSpending, setActiveSpending] = useState(false);
  const [isActiveEarning, setActiveEarning] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const walletReducer = useSelector(
    (state) => (state && state.walletReducer) || {}
  );
  const smartContractReducer = useSelector(
    (state) => (state && state.smartContractReducer) || {}
  );
  const nftPortfolioAnalysisReducer = useSelector(
    (state) => (state && state.nftPortfolioAnalysisReducer) || {}
  );

  const {
    porfolioStatsLoading,
    transactionStatsLoading,
    earningsStatsLoading,
    spendingsStatsLoading,
  } = useSelector(
    (state) => (state && state.nftPortfolioAnalysisReducer) || {}
  );

  const nftTrasactionReducer = useSelector(
    (state) => (state && state.nftPortfolioAnalysisReducer) || {}
  );

  useEffect(() => {
    dispatch(actions.smartContractActions.getSmartContractsList());
    dispatch(actions.walletActions.getWallets());
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: selectedInput,
      smartContractUids: selectedSmartInput,
    };
    dispatch(actions.nftPortfolioAnalysisActions.getPortfolioStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getTransactionStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getSpendingStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getEarningStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getNFTTrasaction(params));
  }, []);

  useEffect(() => {
    if (selectedDateRangeLabel != "Custom") {
      graphClickHandler();
      setShowDateRange(false);
    }
  }, [value]);

  const { nftOwned, totalTransactions, portfolioValue } =
    nftPortfolioAnalysisReducer.porfolioStats || {};

  const selectWallet = walletReducer?.walletList?.map((item) => {
    return {
      name: item?.attributes?.name,
      id: item.id,
    };
  });

  const smartContract = smartContractReducer?.smartContractsList?.map(
    (item) => {
      return {
        name:
          item.attributes.platformName +
          " (" +
          item.attributes.tokenProtocol.toUpperCase() +
          ")",
        id: item.id,
      };
    }
  );

  const handleSelectwallet = async (event) => {
    const {
      target: { value },
    } = event;

    setSelectedInput(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSelectSmartContact = async (event) => {
    const {
      target: { value },
    } = event;
    setSelectedSmartInput(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleCloseSmart = () => {
    setSelectedSmartInput([]);
  };

  const handleCloseWallet = () => {
    setSelectedInput([]);
  };

  const handleFilterWallet = () => {
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: selectedInput,
      smartContractUids: selectedSmartInput,
      financialData: financialData,
    };
    dispatch(actions.nftPortfolioAnalysisActions.getPortfolioStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getTransactionStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getSpendingStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getEarningStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getNFTTrasaction(params));
  };

  const handleFilterSmart = () => {
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: selectedInput,
      smartContractUids: selectedSmartInput,
      financialData: financialData,
    };
    dispatch(actions.nftPortfolioAnalysisActions.getPortfolioStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getTransactionStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getSpendingStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getEarningStats(params));
    dispatch(actions.nftPortfolioAnalysisActions.getNFTTrasaction(params));
  };

  const dateRangePopup = () => {
    setShowDateRange((showDateRange) => !showDateRange);
  };

  const closeDateRangePicker = () => {
    setShowDateRange(false);
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const graphClickHandler = () => {
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: selectedInput,
      smartContractUids: selectedSmartInput,
    };

    // if (financialData === "transactions"){
    dispatch(actions.nftPortfolioAnalysisActions.getTransactionStats(params));
    // }

    // if (financialData === "spendings"){
    dispatch(actions.nftPortfolioAnalysisActions.getSpendingStats(params));
    // }

    // if (financialData === "earnings"){
    dispatch(actions.nftPortfolioAnalysisActions.getEarningStats(params));
    // }
    dispatch(actions.nftPortfolioAnalysisActions.getNFTTrasaction(params));

    setShowDateRange((showDateRange) => !showDateRange);
  };

  const transactionResults = nftPortfolioAnalysisReducer.transactionStats || {};
  const spendingResults = nftPortfolioAnalysisReducer.spendingsStats || {};
  const earningResults = nftPortfolioAnalysisReducer.earningsStats || {};

  let chartData = [];
  if (financialData === "transactions") {
    transactionResults?.data?.map((res) => {
      chartData.push([res.date, res.count || res.value]);
    });
  }
  if (financialData === "spendings") {
    spendingResults?.data?.map((res) => {
      chartData.push([res.date, res.value]);
    });
  }

  if (financialData === "earnings") {
    earningResults?.data?.map((res) => {
      chartData.push([res.date, res.value]);
    });
  }

  const handleClickTransactions = () => {
    setActiveTransactions(true);
    setActiveEarning(false);
    setActiveSpending(false);
    setFinancialData("transactions");
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: selectedInput,
      smartContractUids: selectedSmartInput,
    };
    dispatch(actions.nftPortfolioAnalysisActions.getTransactionStats(params));
    if (chartData.length > 0) {
      ApexCharts.exec(
        "area-datetime",
        "updateOptions",
        {
          yaxis: {
            labels: {
              style: {
                colors: ["#fff"],
              },
              formatter: (value) => { return value },
            },
            
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return `${val.toFixed(0)}`;
              },
              title: {
                formatter: (seriesName) => "",
              },
            },
          },
        },
        false,
        true
      );
    }
  };

  const handleClickEarning = () => {
    setActiveTransactions(false);
    setActiveEarning(true);
    setActiveSpending(false);
    setFinancialData("earnings");
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: selectedInput,
      smartContractUids: selectedSmartInput,
    };
    dispatch(actions.nftPortfolioAnalysisActions.getEarningStats(params));
    if (chartData.length > 0) {
      ApexCharts.exec(
        "area-datetime",
        "updateOptions",
        {
          yaxis: {
            labels: {
              style: {
                colors: ["#fff"],
              },
              formatter: (value) => { return value },
            },
            
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return `${parseFloat(val.toFixed(6))} ETH`;
              },
              title: {
                formatter: (seriesName) => "",
              },
            },
          },
        },
        false,
        true
      );
    }
  };

  const handleClickSpending = () => {
    setActiveTransactions(false);
    setActiveEarning(false);
    setActiveSpending(true);
    setFinancialData("spendings");
    const params = {
      startDate: moment(value[0]).toISOString(),
      endDate: moment(value[1]).toISOString(),
      walletUids: selectedInput,
      smartContractUids: selectedSmartInput,
    };
    dispatch(actions.nftPortfolioAnalysisActions.getSpendingStats(params));
    if (chartData.length > 0) {
      ApexCharts.exec(
        "area-datetime",
        "updateOptions",
        {
          yaxis: {
            labels: {
              style: {
                colors: ["#fff"],
              },
              formatter: (value) => { return value },
            },
            
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return `${parseFloat(val.toFixed(6))} ETH`;
              },
              title: {
                formatter: (seriesName) => "",
              },
            },
          },
        },
        false,
        true
      );
    }
  };

  const handleClickAway = () => {
    setShowDateRange(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div style={{ width: "100%", marginTop: "16px" }}>
        <div>
          <Box sx={{ mt: 1 }} className={classes.topSection}>
            <FormControl
              sx={{ width: { xs: 150, sm: 300 }, pr: 1 }}
              className="multiselect"
            >
              <InputMultiSelect
                value={selectWallet}
                label="All Wallets"
                onChange={handleSelectwallet}
                selectedInput={selectedInput}
                fullWidth={true}
                handleClear={handleCloseWallet}
                handleApplyFilter={handleFilterWallet}
              />
            </FormControl>
            <FormControl
              sx={{ width: { xs: 150, sm: 300 } }}
              className="multiselect"
            >
              <InputMultiSelect
                value={smartContract}
                label="All Smart Contracts"
                onChange={handleSelectSmartContact}
                selectedInput={selectedSmartInput}
                fullWidth={true}
                handleClear={handleCloseSmart}
                handleApplyFilter={handleFilterSmart}
              />
            </FormControl>
          </Box>
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 12, sm: 12, md: 12 }}
              sx={{ minHeight: "125px" }}
            >
              <Grid item xs={4} sm={4} md={4}>
                <Item
                  className={classes.topsectionCard}
                  sx={{
                    fontSize: { xs: "10px", sm: "12px" },
                    paddingLeft: { xs: "8px", sm: "16px" },
                    minHeight: "90px",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  NFTs {isMobile ? <br /> : <></>} owned
                  {porfolioStatsLoading ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        right: 0,
                      }}
                    >
                      <CircularProgress
                        color="inherit"
                        style={{
                          width: " 20px",
                          marginTop: "5px",
                          height: " 20px",
                          color: " rgba(255, 255, 255, 0.56)",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: isMobile ? "14px" : "20px",
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        right: 0,
                        fontWeight: 900,
                        color: "#FFF",
                      }}
                    >
                      {nftOwned}{" "}
                    </div>
                  )}
                </Item>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Item
                  className={classes.topsectionCard}
                  sx={{
                    fontSize: { xs: "10px", sm: "12px" },
                    paddingLeft: { xs: "8px", sm: "16px" },
                    minHeight: "90px",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  portfolio value (purchase price)
                  {porfolioStatsLoading ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        right: 0,
                      }}
                    >
                      <CircularProgress
                        color="inherit"
                        style={{
                          width: " 20px",
                          marginTop: "5px",
                          height: " 20px",
                          color: " rgba(255, 255, 255, 0.56)",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: isMobile ? "14px" : "20px",
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        right: 0,
                        fontWeight: 900,
                        color: "#FFF",
                      }}
                    >
                      {portfolioValue?.toFixed(6)} ETH
                    </div>
                  )}
                </Item>
              </Grid>
              <Grid item xs={4} sm={4} md={4}>
                <Item
                  className={classes.topsectionCard}
                  sx={{
                    fontSize: { xs: "10px", sm: "12px" },
                    paddingLeft: { xs: "8px", sm: "16px" },
                    minHeight: "90px",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  total transactions
                  {porfolioStatsLoading ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        right: 0,
                      }}
                    >
                      <CircularProgress
                        color="inherit"
                        style={{
                          width: " 20px",
                          marginTop: "5px",
                          height: " 20px",
                          color: " rgba(255, 255, 255, 0.56)",
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: isMobile ? "14px" : "20px",
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        right: 0,
                        fontWeight: 900,
                        color: "#FFF",
                      }}
                    >
                      {totalTransactions}
                    </div>
                  )}
                </Item>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{ mt: 3, position: "relative" }}
            className={classes.topSection}
          >
            <div>
              <Grid container>
                <Grid item xs={8} sm={4} md={4} className="date-range">
                  <TextField
                    fullWidth
                    id="selectDateRange"
                    label="Select Date Range"
                    name="selectDateRange"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <ArrowDropDownIcon color="white"></ArrowDropDownIcon>
                        </InputAdornment>
                      ),
                    }}
                    value={
                      moment(value[0]).format("MM/DD/YYYY") +
                      " " +
                      "to" +
                      " " +
                      moment(value[1]).format("MM/DD/YYYY")
                    }
                    onClick={() => dateRangePopup()}
                  />
                </Grid>
              </Grid>
              {showDateRange && (
                <Paper
                  sx={{
                    width: "250px",
                    background: "#383F4E",
                    p: "20px",
                    position: "absolute",
                    zIndex: "99",
                    ...(selectedDateRangeLabel === "Custom" && {
                      width: "530px",
                    }),
                  }}
                >
                  <Grid container spacing={2} tabIndex={0}>
                    <Grid
                      item
                      xs={selectedDateRangeLabel === "Custom" ? 4 : 12}
                    >
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={(event) => {
                              setValue([moment().subtract(30, "days"), today]);
                              handleListItemClick(event, 0);
                              setSelectedDateRangeLabel("Last 30 days");
                            }}
                          >
                            <ListItemText primary="Last 30 days" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton
                            selected={selectedIndex === 1}
                            onClick={(event) => {
                              setValue([
                                moment(event).subtract(90, "days"),
                                today,
                              ]);
                              handleListItemClick(event, 1);
                              setSelectedDateRangeLabel("Last 90 days");
                            }}
                          >
                            <ListItemText primary="Last 90 days" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton
                            selected={selectedIndex === 2}
                            onClick={(event) => {
                              setValue([moment().subtract(1, "years"), today]);
                              handleListItemClick(event, 2);
                              setSelectedDateRangeLabel("Last year");
                            }}
                          >
                            <ListItemText primary="Last year" />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton
                            selected={selectedIndex === 3}
                            onClick={(event) => {
                              setValue(["", ""]);
                              handleListItemClick(event, 3);
                              setSelectedDateRangeLabel("Custom");
                            }}
                          >
                            <ListItemText primary="Custom" />
                          </ListItemButton>
                        </ListItem>
                      </List>
                    </Grid>
                    {selectedDateRangeLabel === "Custom" && (
                      <Grid item xs={8}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              id="outlined-basic-1"
                              label="Start Date "
                              variant="outlined"
                              sx={{ mb: 2 }}
                              value={moment(value[0]).format("MM/DD/YYYY")}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              id="outlined-basic"
                              label="End Date "
                              variant="outlined"
                              sx={{ mb: 2 }}
                              value={moment(value[1]).format("MM/DD/YYYY")}
                            />
                          </Grid>
                        </Grid>
                        <Grid sx={{ textAlign: "end" }}>
                          <Button
                            variant="contained"
                            sx={{ mr: 0, mt: 0 }}
                            onClick={() => {
                              graphClickHandler();
                            }}
                            disabled={value[0] === "" && value[1] === ""}
                          >
                            Save
                          </Button>
                        </Grid>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <StaticDateRangePicker
                            displayStaticWrapperAs="desktop"
                            calendars={1}
                            value={value}
                            sx={{ background: "#E5E5E5", width: "300px" }}
                            onChange={(newValue) => {
                              setValue(newValue);
                            }}
                            renderInput={(startProps, endProps) => (
                              <React.Fragment>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                              </React.Fragment>
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              )}
            </div>
          </Box>
          <Box>
            <div style={{ marginTop: "16px", backgroundColor: "#383F4E" }}>
              {isActiveTransactions ? (
                <Typography style={{ padding: "2%" }} variant="h4">
                  Transactions Over Time
                </Typography>
              ) : isActiveEarning ? (
                <Typography style={{ padding: "2%" }} variant="h4">
                  Earnings Over Time
                </Typography>
              ) : (
                <Typography style={{ padding: "2%" }} variant="h4">
                  Spendings Over Time
                </Typography>
              )}
              <Grid container sx={{ px: 1 }}>
                <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
                  <Grid item sm={4} md={12} style={{ padding: "10px" }}>
                    <Item
                      className={classes.topsectionCardsecond}
                      onClick={handleClickTransactions}
                      sx={{
                        cursor: "pointer",
                        ...(isActiveTransactions
                          ? {
                              background: "rgba(0, 227, 135, 0.08)!important",
                              border:
                                "1px solid rgba(36, 209, 130, 1)!important",
                            }
                          : null),
                      }}
                    >
                      transactions
                      {transactionStatsLoading ? (
                        <div>
                          <CircularProgress
                            color="inherit"
                            style={{
                              width: " 20px",
                              marginTop: "5px",
                              height: " 20px",
                              color: " rgba(255, 255, 255, 0.56)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className={classes.topSectionTxt}>
                          {transactionResults.count}
                        </div>
                      )}
                    </Item>
                  </Grid>
                  <Grid item sm={4} md={12} style={{ padding: "10px" }}>
                    <Item
                      className={classes.topsectionCardsecond}
                      onClick={handleClickSpending}
                      sx={{
                        cursor: "pointer",
                        ...(isActiveSpending
                          ? {
                              background: "rgba(0, 227, 135, 0.08)!important",
                              border:
                                "1px solid rgba(36, 209, 130, 1)!important",
                            }
                          : null),
                      }}
                    >
                      spendings
                      {spendingsStatsLoading ? (
                        <div>
                          <CircularProgress
                            color="inherit"
                            style={{
                              width: " 20px",
                              marginTop: "5px",
                              height: " 20px",
                              color: " rgba(255, 255, 255, 0.56)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className={classes.topSectionTxt}>
                          {spendingResults?.value?.toFixed(6)} ETH
                        </div>
                      )}
                    </Item>
                  </Grid>
                  <Grid item sm={4} md={12} style={{ padding: "10px" }}>
                    <Item
                      className={classes.topsectionCardsecond}
                      onClick={handleClickEarning}
                      sx={{
                        cursor: "pointer",
                        ...(isActiveEarning
                          ? {
                              background: "rgba(0, 227, 135, 0.08)!important",
                              border:
                                "1px solid rgba(36, 209, 130, 1)!important",
                            }
                          : null),
                      }}
                    >
                      earnings
                      {earningsStatsLoading ? (
                        <div>
                          <CircularProgress
                            color="inherit"
                            style={{
                              width: " 20px",
                              marginTop: "5px",
                              height: " 20px",
                              color: " rgba(255, 255, 255, 0.56)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className={classes.topSectionTxt}>
                          {earningResults?.value?.toFixed(6) || 0} ETH
                        </div>
                      )}
                    </Item>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={{ xs: 0.5 }}
                  sx={{ display: { md: "none" } }}
                >
                  <Grid item xs={4} sm={4} md={4}>
                    <Item
                      className={classes.topsectionCardsecond}
                      onClick={handleClickTransactions}
                      sx={{
                        cursor: "pointer",
                        p: "20px 10px !important",
                        fontSize: "10px",
                        ...(isActiveTransactions
                          ? {
                              background: "rgba(0, 227, 135, 0.08)!important",
                              border:
                                "1px solid rgba(36, 209, 130, 1)!important",
                            }
                          : null),
                      }}
                    >
                      transactions
                      {transactionStatsLoading ? (
                        <div>
                          <CircularProgress
                            color="inherit"
                            style={{
                              width: " 20px",
                              marginTop: "5px",
                              height: " 20px",
                              color: " rgba(255, 255, 255, 0.56)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className={classes.topSectionTxt}>
                          {transactionResults.count}
                        </div>
                      )}
                    </Item>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <Item
                      className={classes.topsectionCardsecond}
                      onClick={handleClickSpending}
                      sx={{
                        cursor: "pointer",
                        p: "20px 10px!important",
                        fontSize: "10px",
                        ...(isActiveSpending
                          ? {
                              background: "rgba(0, 227, 135, 0.08)!important",
                              border:
                                "1px solid rgba(36, 209, 130, 1)!important",
                            }
                          : null),
                      }}
                    >
                      spendings
                      {spendingsStatsLoading ? (
                        <div>
                          <CircularProgress
                            color="inherit"
                            style={{
                              width: " 20px",
                              marginTop: "5px",
                              height: " 20px",
                              color: " rgba(255, 255, 255, 0.56)",
                            }}
                          />
                        </div>
                      ) : (
                        <div className={classes.topSectionTxt}>
                          {spendingResults?.value?.toFixed(6)} ETH
                        </div>
                      )}
                    </Item>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4}>
                    <Item
                      className={classes.topsectionCardsecond}
                      onClick={handleClickEarning}
                      sx={{
                        cursor: "pointer",
                        p: "20px 10px!important",
                        fontSize: "10px",
                        ...(isActiveEarning
                          ? {
                              background: "rgba(0, 227, 135, 0.08)!important",
                              border:
                                "1px solid rgba(36, 209, 130, 1)!important",
                            }
                          : null),
                      }}
                    >
                      earnings
                      {earningsStatsLoading ? (
                        <div>
                          <CircularProgress
                            color="inherit"
                            style={{
                              width: " 20px",
                              marginTop: "5px",
                              height: " 20px",
                              color: " rgba(255, 255, 255, 0.56)",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className={classes.topSectionTxt}
                          //style={{ fontSize: "12px" }}
                        >
                          {earningResults?.value?.toFixed(6) || 0} ETH
                        </div>
                      )}
                    </Item>
                  </Grid>
                </Grid>
                {chartData.length > 0 ? (
                  <Grid
                    md={9}
                    xs={12}
                    style={{ padding: "3%" }}
                    sx={{ position: "relative", mt: { xs: "30px" } }}
                  >
                    <ProtfolioGraph
                      className={classes.topsectionCardsecond}
                      type="graph"
                      dateRange={[value]}
                      chartData={chartData}
                    />
                  </Grid>
                ) : (
                  <Grid
                    md={9}
                    xs={12}
                    style={{
                      padding: "3%",
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                    sx={{
                      position: "relative",
                      mb: "10px!important",
                      minHeight: "150px",
                    }}
                  >
                    <Typography
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {`You don’t have any ${
                        isActiveTransactions
                          ? "transactions"
                          : isActiveEarning
                          ? "earnings"
                          : "spendings"
                      } to show here`}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </div>
          </Box>

          <Box
            component="div"
            sx={{ overflow: "auto", width: { xs: "100%", sm: "100%" } }}
          >
            <div style={{ marginTop: "16px", backgroundColor: "#383F4E" }}>
              <Typography style={{ padding: "2%" }} variant="h4">
                Transactions
              </Typography>

              {/* <ProtfolioGraph heading="Transactions" type="table" /> */}
              <CustomizedTables
                nftTrasaction={nftTrasactionReducer?.nftTrasaction}
                value={value}
                walletUids={selectedInput}
                smartContractUids={selectedSmartInput}
              />
            </div>
          </Box>
        </div>
        <Divider />
      </div>
    </ClickAwayListener>
  );
}
