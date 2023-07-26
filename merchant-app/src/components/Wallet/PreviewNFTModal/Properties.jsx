import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { propertiesStyle } from "./PreviewNFTStyle";
import { useTheme } from "@mui/system";
import { useMediaQuery } from "@mui/material";

function PropertiesSection({ properties }) {
  const classes = propertiesStyle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div style={{ width: "100%" }}>
      <Accordion expanded={true}>
        <AccordionSummary
          expandIcon={
            isMobile ? (
              <ExpandMoreIcon
                style={{
                  color: "#fff",
                }}
              />
            ) : (
              ""
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography
              style={{
                fontWeight: 400,
                fontSize: "18px",
                letterSpacing: "0.15px",
                color: "#FFFFFF",
                fontFamily: "Roboto",
              }}
            >
              Properties*
            </Typography>

            <Typography
              style={{
                fontWeight: 400,
                fontSize: "14px",
                letterSpacing: "0.15px",
                color: "#FFFFFF",
                fontFamily: "Roboto",
              }}
            >
              Textual properties that describe your unique NFT
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails
          style={{
            background: "rgba(41, 46, 58, 0.51)",
            padding: "0 0 15px 0",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
            }}
            component={"p"}
            variant={"body2"}
          >
            {properties?.length ? (
              properties?.map((each, i) => (
                <div className={classes.cardWrapper} key={i}>
                  <p>{each.name}</p>
                  <h4>{each.value}</h4>
                </div>
              ))
            ) : (
              <div
                style={{
                  margin: "10px auto 0 auto",
                  fontWeight: 300,
                  fontSize: "14px",
                  letterSpacing: "0.15px",
                  color: "#FFFFFF",
                  fontFamily: "Roboto",
                }}
              >
                {" "}
                This NFT have no properties yet
              </div>
            )}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export { PropertiesSection };
