import React from "react";
import PropTypes from "prop-types";

// MUI IMPORTS
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DashboardComponent } from "../DashBoard/DashBoard";

/* Horizontal TabPanel */
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: "40px", pt: 4 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/* Vertical TabPanel */
function TabPanelVertical(props) {
  const { children, valueVertical, index, ...other } = props;
  return (
    <div
      role="tabpanelVertical"
      hidden={valueVertical !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {valueVertical === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanelVertical.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  valueVertical: PropTypes.number.isRequired,
};

function a11yPropsVertical(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function TabsComponent({ tabType }) {
  const [value, setValue] = React.useState(0);
  const [valueVertical, setValueVertical] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleVerticalChange = (event, newValue) => {
    setValueVertical(newValue);
  };

  return (
    <>
      {tabType === "horizontal" && (
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              pl: { xs: "20px", md: "40px" },
              pt: "30px",
            }}
          >
            <Tabs value={value} onChange={handleChange}>
              <Tab
                label="Dashboard"
                {...a11yProps(0)}
                sx={{ textTransform: "capitalize", fontSize: "14px" }}
              />
              <Tab
                label="Customers"
                {...a11yProps(1)}
                sx={{ textTransform: "capitalize", fontSize: "14px" }}
              />
              <Tab
                label="Transactions"
                {...a11yProps(2)}
                sx={{ textTransform: "capitalize", fontSize: "14px" }}
              />
              <Tab
                label="Analytics"
                {...a11yProps(3)}
                sx={{ textTransform: "capitalize", fontSize: "14px" }}
              />
              <Tab
                label="Assets"
                {...a11yProps(4)}
                sx={{ textTransform: "capitalize", fontSize: "14px" }}
              />
              <Tab
                label="Settings"
                {...a11yProps(5)}
                sx={{ textTransform: "capitalize", fontSize: "14px" }}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <DashboardComponent />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
          <TabPanel value={value} index={3}>
            Item Four
          </TabPanel>
          <TabPanel value={value} index={4}>
            Item Five
          </TabPanel>
          <TabPanel value={value} index={5}>
            Item Six
          </TabPanel>
        </Box>
      )}
      {tabType === "vertical" && (
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
          }}
        >
          <Tabs
            orientation="vertical"
            value={valueVertical}
            id="Tab-vertical"
            onChange={handleVerticalChange}
            aria-label="Vertical tabs example"
          >
            <Tab
              label="General"
              {...a11yPropsVertical(0)}
              sx={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Payment"
              {...a11yPropsVertical(1)}
              sx={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Subscription"
              {...a11yPropsVertical(2)}
              sx={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Legal"
              {...a11yPropsVertical(3)}
              sx={{ textTransform: "capitalize" }}
            />
            <Tab
              label="Notifications"
              {...a11yPropsVertical(4)}
              sx={{ textTransform: "capitalize" }}
            />
          </Tabs>

          <TabPanelVertical valueVertical={valueVertical} index={0}>
            General Content
          </TabPanelVertical>
          <TabPanelVertical valueVertical={valueVertical} index={1}>
            Payment Content
          </TabPanelVertical>
          <TabPanelVertical valueVertical={valueVertical} index={2}>
            Subscription Content
          </TabPanelVertical>
          <TabPanelVertical valueVertical={valueVertical} index={3}>
            Legal Content
          </TabPanelVertical>
          <TabPanelVertical valueVertical={valueVertical} index={4}>
            Notification Content
          </TabPanelVertical>
        </Box>
      )}
    </>
  );
}

export { TabsComponent };
