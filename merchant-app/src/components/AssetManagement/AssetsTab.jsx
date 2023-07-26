import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button, TextField, Typography, useMediaQuery } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
import SelectField from "../selectField/SelectField";
import Facebook from "@mui/icons-material/Search";
import FileUplaodModal from "./Modals/FileUploadModal";
import { ActionType } from "../../utils/actionTypes";
import { useDispatch } from "react-redux";
import { updateSearchAssetQuery } from "src/actions/assetsActions";

let timeout = "";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
  },
  topSection: {
    float: "left",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "1rem",
    },
  },
  uploadFileButton: {
    float: "right",
    marginTop: "1.8rem",
    marginRight: "0",
  },
  uploadFileButtonManage: {
    float: "right",
    marginTop: "1.8rem",
    marginRight: "1.5rem",
  },
  uploadFileButtonMobile: {
    float: "right",
    marginRight: "0",
    marginBottom: "0.3rem",
  },
  searchField: {
    padding: "10px",
    width: "300px",
    float: "left",
    paddingLeft: "0",
  },
}));

export function AssetsTab({
  tabPanels,
  showAppBar = true,
  tabType = "Admin",
  isModal,
}) {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles(theme);
  const [currentTab, setCurrentTab] = useState(0);
  const [search, setSearch] = useState("");
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  let searchToSend = "";

  const openOrCloseFileUploadModal = (value = true) => {
    setShowFileUploadModal(value);
  };

  const handleTabChange = (newValue) => {
    setCurrentTab(newValue);
    dispatch({ type: ActionType.FETCHED_ALL_ASSETS, payload: false });
  };

  function saveInput() {
    dispatch({ type: ActionType.FETCHED_ALL_ASSETS, payload: false });
    dispatch(updateSearchAssetQuery(searchToSend));
  }
  const timefunction = () => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      saveInput();
    }, 500);
  };

  const handleSearch = (e) => {
    timefunction();
    // if (e.target.value === "") {
    //   clearTimeout(timeout);
    // }
    searchToSend = e.target.value;
    setSearch(e.target.value);
  };

  return (
    <div className={classes.root}>
      <FileUplaodModal
        modalState={showFileUploadModal}
        modalStyles={classes.modal}
        closeModal={openOrCloseFileUploadModal}
      />
      <div>
        <div className={classes.topSection}>
          <div
            className={classes.searchField}
            style={{
              paddingRight: isMobile && "0",
              width: isMobile ? "100%" : "300px",
            }}
          >
            <TextField
              InputProps={{ endAdornment: <Facebook fontSize="large" /> }}
              InputLabelProps={{
                style: {
                  color: "#BEBFC3",
                },
              }}
              margin={!isMobile ? "normal" : ""}
              fullWidth
              value={search}
              onChange={handleSearch}
              id="searchfiles"
              label="Search Files"
              name="searchfiles"
              autoComplete="searchfiles"
              variant="outlined"
            />
          </div>
          <SelectField
            menuItems={tabPanels}
            customStylesForMenu={{ width: isMobile ? "100%" : "300px" }}
            customStyles={{
              marginTop: isMobile ? "0" : "1.6rem",
              width: isMobile ? "100%" : "300px",
            }}
            label={tabPanels.find((item) => item.index === currentTab)?.label}
            onClick={handleTabChange}
          />
        </div>
        {tabPanels.map((tab) => {
          const { component, index } = tab;
          if (index === currentTab) {
            return (
              <TabPanel value={index} index={index} key={index}>
                {tab.component}
              </TabPanel>
            );
          }
        })}
      </div>
    </div>
  );
}

// {tabPanels.map((tab, index) => (
//   <TabPanel value={value} index={index} key={index}>
//     {tab.value}
//   </TabPanel>
// ))}
