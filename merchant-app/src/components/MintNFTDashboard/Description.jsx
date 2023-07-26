import React from "react";
import { Grid, Tab, Tabs, Typography, Box } from "@mui/material";
import { mintnftDashboardStyles } from "./MintNFTDashboardStyle";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../actions";
import { BlockChainInfo } from "../Wallet/PreviewNFTModal/BlockChainInfo";
import { TrasactionHistory } from "../Wallet/PreviewNFTModal/TrasactionHistory";

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

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

export function Description({ tabType = "Admin" }) {
  const dispatch = useDispatch();
  const nftReducer = useSelector((state) => state && state.nftReducer);

  const handleDescClick = (event) => {
    let ele = document.getElementsByClassName("clicked");
    for (let m = 0; m < ele.length; m++) {
      ele[m].classList.remove("clicked");
    }
    event.currentTarget.classList.add("clicked");
    nftReducer.textEditorData = nftReducer?.setFieldTouched ? nftReducer.nftEditData.description :  nftReducer.nftInfoById.description;
    dispatch(actions.nftActions.setExpandedPanel("panel6"));
  };
  const classes = mintnftDashboardStyles();

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { blockChainInfo, trasactionHistory } = useSelector(
    (state) => state.nftReducer || {}
  );
  const tabValues = [
    {
      index: 0,
      value: (
        <>
          {nftReducer &&
          nftReducer.nftEditData &&
          nftReducer.nftEditData.description ? (
            <p
              style={{
                fontWeight: 400,
                fontSize: "14px",
                padding: "16px",
                margin: 0,
              }}
              dangerouslySetInnerHTML={{
                __html: nftReducer.nftEditData?.description,
              }}
            ></p>
          ) : nftReducer &&
            nftReducer.nftInfoById &&
            nftReducer.nftInfoById.description ? (
            <p
              style={{
                fontWeight: 400,
                fontSize: "14px",
                padding: "16px",
                margin: 0,
              }}
              dangerouslySetInnerHTML={{
                __html: nftReducer.nftInfoById?.description,
              }}
            ></p>
          ) : (
            <Typography
              style={{
                fontWeight: 400,
                fontSize: "14px",
                padding: "16px",
              }}
            >
              This NFT has no description yet.
            </Typography>
          )}
        </>
      ),
    },
    {
      index: 1,
      value: <BlockChainInfo info={blockChainInfo} />,
    },
    {
      index: 2,
      value: <TrasactionHistory trasactionHistory={trasactionHistory} />,
    },
  ];
  return (
    <Box sx={{ mt: "24px" }}>
      <Box>
        <Box className={classes.descriptionContainerEdit}>
          <EditIcon className={classes.editPencil} />
          <div
            className={classes.propertiesContainer}
            style={{ border: "none" }}
          >
            <div className={classes.propertiesTopSection}>
              {tabType === "upload" && (
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="blocommerce tabs"
                >
                  <Tab
                    label="Description"
                    {...a11yProps(0)}
                    className={classes.labels}
                  />
                  <Tab
                    label="Blockchain Info"
                    {...a11yProps(1)}
                    className={classes.labels}
                  />
                  <Tab
                    label="Transaction History"
                    {...a11yProps(2)}
                    className={classes.labels}
                  />
                </Tabs>
              )}
            </div>
          </div>
          {tabValues.map((tab, index) => (
            <TabPanel
              id={tab.index === 0 ? "descRight" : index + "panel"}
              value={value}
              index={index}
              key={index}
              onClick={tab.index === 0 ? handleDescClick : null}
              className={tab.index === 0 ? classes.nftTitle : ""}
              style={{
                background: "#383F4E",
                marginBottom: "24px",
              }}
            >
              {index === 0 && <EditIcon className={classes.editPencil} />}
              {tab.value}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
