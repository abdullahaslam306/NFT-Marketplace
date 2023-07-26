import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddPlusIcon } from "../../BloIcons/index";
import { mintnftDashboardStyles } from "./MintNFTDashboardStyle";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Typography } from "@mui/material";
import { actions } from "src/actions";
import { createStyles, makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

function AdditionalSection({
  nftID = "",
  handleDeleteSection,
  handleupdateSection,
  handleAddSection,
  updateSectionId,
}) {
  const dispatch = useDispatch();
  const { sectionList } = useSelector((state) => state.nftReducer || {});
  const nftReducer = useSelector((state) => state.nftReducer || {});

  const propertiesclass = propertiesStyle();

  const handleHoverClick = (event, index) => {
    dispatch(actions.nftActions.setExpandedPanel("panel9"));
    handleupdateSection(index);
  };

  return (
    <Box sx={{ mt: "24px" }}>
      {sectionList?.length
        ? sectionList.map((each, i) => {
            if (sectionList[i]?.attributes?.content) {
              return (
                <div
                  key={i}
                  style={{
                    width: "100%",
                    background: "rgba(41, 46, 58, 0.51)",
                    alignItems: "flex-start",
                    backgroundColor: "transparent",
                  }}
                  className={
                    nftReducer.expandedPanel === "panel9" &&
                    updateSectionId === i
                      ? propertiesclass.sectionWrapperSelected
                      : propertiesclass.sectionWrapper
                  }
                  onClick={(e) => handleHoverClick(e, i)}
                >
                  <div>
                    <EditIcon
                      style={{
                        marginRight: "5px",
                        backgroundColor: "#5244ab",
                        border: "2px solid #5244ab",
                      }}
                      onClick={() => handleupdateSection(i)}
                    />
                    <CloseIcon
                      style={{
                        backgroundColor: "#5244ab",
                        border: "2px solid #5244ab",
                      }}
                      onClick={() => handleDeleteSection(each.id, i)}
                    />
                  </div>
                  {/* <h4>{sectionList[i]?.attributes?.title}</h4> */}
                  <p
                    style={{ margin: 0 }}
                    className={propertiesclass.addSectionDefault}
                    dangerouslySetInnerHTML={{
                      __html: sectionList[i]?.attributes?.content,
                    }}
                  ></p>
                </div>
              );
            }
            return;
          })
        : null}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px dashed #475164",
          height: "150px",
          flexDirection: "column",
          cursor: "pointer",
        }}
        onClick={handleAddSection}
      >
        <AddPlusIcon />
        <Typography sx={{ fontSize: "28px", fontWeight: 900 }}>
          Add Section
        </Typography>
      </Box>
    </Box>
  );
}
export { AdditionalSection };

const propertiesStyle = makeStyles((theme) =>
  createStyles({
    cardWrapper: {
      display: "flex",
      padding: "5px",
      flexDirection: "column",
      border: "1.5px solid #383f4e",
      justifyContent: "center",
      margin: "15px 0px 0px 15px",
      alignItems: "center",
      flex: "0 1 15%",
      "& p": {
        fontWeight: " 400",
        fontSize: "0.8rem",
        lineHeight: " 18px",
        letterSpacing: " 0.16px",
        color: " #B6AEF6",
        margin: "0px",
      },
      "& h4": {
        fontWeight: " 400",
        fontSize: "1rem",
        letterSpacing: " 0.16px",
        color: " #fff",
        margin: "0px",
      },
    },
    sectionWrapper: {
      display: "flex",
      // padding: "5px",
      flexDirection: "column",
      border: "2px solid transparent",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      marginBottom: "32px",
      "& div": {
        display: "none",
      },
      "&:hover": {
        border: "2px solid #5244ab",
        cursor: "pointer",
      },
      "&:hover div": {
        position: " absolute",
        top: " -23px",
        right: " -2px",
        display: " block",
      },
      "& p": {
        fontWeight: " 200",
        fontSize: "1rem",
        lineHeight: "31px",
        letterSpacing: " 0.16px",
        color: " #ffffff",
        margin: "0px",
      },
      "& h4": {
        fontWeight: " 400",
        fontSize: "1.5rem",
        letterSpacing: " 0.16px",
        color: " #fff",
        margin: "0px",
      },
    },
    sectionWrapperSelected: {
      border: "3px solid #5244ab",
      display: "flex",
      padding: "5px",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      marginBottom: "32px",
      "& div": {
        position: " absolute",
        top: " -23px",
        right: " -2px",
        display: " block",
        cursor: "pointer",
      },
    },
    addSectionDefault: {
      "& p": {
        fontSize: "16px",
        margin: 0,
        padding: 0,
        fontWeight: 400,
      },
      "& h1": {
        margin: 0,
        padding: 0,
        fontSize: "80px",
        fontWeight: 900,
      },
      "& h2": {
        fontSize: "60px",
        margin: 0,
        padding: 0,
        fontWeight: 900,
      },
      "& h3": {
        fontSize: "38px",
        margin: 0,
        padding: 0,
        fontWeight: 900,
      },
      "& h4": {
        fontSize: "28px",
        margin: 0,
        padding: 0,
        fontWeight: 900,
      },
      "& h5": {
        fontSize: "24px",
        margin: 0,
        padding: 0,
        fontWeight: 900,
      },
      "& h6": {
        fontSize: "20px",
        margin: 0,
        padding: 0,
        fontWeight: 900,
      },
      "& ul": {
        margin: 0,
      },
    },
  })
);
