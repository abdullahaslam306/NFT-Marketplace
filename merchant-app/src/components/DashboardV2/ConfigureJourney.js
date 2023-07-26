import React, { useEffect, useRef } from "react";

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { continuejourneyAccordian } from "../../utils/constants";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";


export default function ConfigureJourney() {
  const router = useRouter();
  const myRef = useRef(null)
  const auth = useSelector((state) => state.authReducer || {});


  useEffect(() => {
    if (auth?.isAuthenticatedWithNewUser) {
      window.scrollTo({ behavior: 'smooth', top: myRef.current.offsetTop })
    }
  },[] )
  return (
    <Box sx={{ padding: "16px", background: "#383F4E", borderRadius: "4px" }} id="my-fourth-step"  ref={myRef}>
      <Typography variant="h3" sx={{ mb: 2 }} id="my-fourth-step-mobile">
        Continue your journey
      </Typography>
      {continuejourneyAccordian.map((each, index) => (
        <Accordion
          key={index}
          style={{
            background: "#383F4E",
            boxShadow:
              "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)",
            borderRadius: "4px 4px 0px 0px",
            marginBottom: "8px",
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon style={{ color: "rgba(255, 255, 255, 0.56)" }} />
            }
            aria-controls="panel1a-content"
            id={index}
            style={{ padding: "8px" }}
          >
            <Link
              underline="none"
              onClick={(event) => {
                event.stopPropagation();
                router.push(each.link, undefined, { shallow: true });
              }}
              style={{
                fontWeight: "regular",
                fontSize: "14px",
                letterSpacing: "0.15px",
                color: "#24D182",
                cursor: "pointer",
              }}
            >
              {each.name}
            </Link>
          </AccordionSummary>
          <AccordionDetails style={{ padding: "8px" }}>
            <Typography
              style={{
                fontSize: "12px",
                color: " rgba(255, 255, 255, 0.7)",
                fontWeight: "medium",
                letterSpacing: "0.4px",
                lineHeight: "20px",
              }}
            >
              {each.value}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
