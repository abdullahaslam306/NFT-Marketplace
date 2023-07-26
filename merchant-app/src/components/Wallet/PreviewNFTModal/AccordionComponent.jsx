import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/system";
import { useMediaQuery } from "@mui/material";

export function AccordionComponent({ children, title }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  if (!isMobile) {
    return <>{children} </>;
  }
  return (
    <Accordion
      style={{
        background: "#383f4e",
        margin: "24px 0 24px 0",
      }}
      expanded={true}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            style={{
              color: "#fff",
            }}
          />
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography style={{ fontSize: "16px", fontWeight: "400" }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        style={{
          background: "rgba(41, 46, 58, 0.51)",
          padding: "0 0 0px 0",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
