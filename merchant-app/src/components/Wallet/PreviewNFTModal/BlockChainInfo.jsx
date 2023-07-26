import React from "react";
import { List, Grid, ListItem, ListItemText } from "@mui/material";
import { useTheme } from "@mui/system";
import { useMediaQuery } from "@mui/material";
import { DatetoHumanReadableUTC } from "../../../utils/helper";
import { useSelector } from "react-redux";
import { smartContractsLink } from "../../../utils/helper";
const itemListHeader = [
  { value: "Blockchain:", name: "blockchain" },
  { value: "Token Standard:", name: "tokenStandard" },
  { value: "Smart Contract:", name: "contractAddress" },
  { value: "Token ID:", name: "tokenId" },
  { value: "Total Editions:", name: "totalEditions" },
  { value: "Metadata:", name: "metadata" },
  { value: "Token URI:", name: "tokenUri" },
  { value: "Mint Date:", name: "mintedAt" },
];
function BlockChainInfo({ info, padding = false, totalEditions, status }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});

  const [blockChainInfo, setBlockChainInfo] = React.useState({
    blockchain:
      info?.attributes?.network && info?.attributes?.network === "eth"
        ? "Ethereum"
        : "",
    tokenId: info?.attributes?.tokenId || null,
    tokenStandard: info?.attributes?.tokenProtocol || null,
    contractAddress: info?.attributes?.contractAddress || null,
    tokenUri: info?.attributes?.tokenUri || null,
    mintedAt: DatetoHumanReadableUTC(info?.attributes?.mintedAt) || null,
    totalEditions:
      (nftReducer.nftInfoById && nftReducer.nftInfoById.totalEditions) ||
      totalEditions,
    metadata:
      nftReducer?.nftInfoById?.status === "draft"
        ? "Editable"
        : nftReducer?.nftInfoById?.status === "lazy"
        ? "Editable"
        : nftReducer?.nftInfoById?.status === "live"
        ? "Frozen"
        : "N/A",
    // nftReducer &&
    // nftReducer.nftInfoById &&
    // nftReducer.nftInfoById.status &&
    // nftReducer.nftInfoById.status === "live"
    //   ? "Frozen"
    //   : nftReducer &&
    //     nftReducer.nftInfoById &&
    //     nftReducer.nftInfoById.status &&
    //     nftReducer.nftInfoById.status === "lazy"
    //   ? "Editable"
    //   : "N/A" || status === "live"
    //   ? "Frozen"
    //   : status === "live"
    //   ? "Frozen"
    //   : "N/A",
  });
  return (
    <Grid container sx={{ p: padding ? 0 : 3 }}>
      <List style={{ width: "100%" }}>
        {itemListHeader.map((option, index) => (
          <ListItem key={index} style={{ margin: 0, padding: 0 }}>
            <ListItemText
              style={{
                fontWeight: "400",
                fontSize: "15px",
                letterSpacing: "0.15px",
                color: "#ffffff",
                opacity: "50%",
                width: isMobile ? "50%" : "30%",
                paddingRight: "5px",
              }}
            >
              {option.value || "N/A"}
            </ListItemText>
            <ListItemText
              style={{
                fontWeight: "400",
                fontSize: "15px",
                letterSpacing: "0.15px",
                color: "#ffffff",
                opacity: "50%",
                marginBottom: "10px",
                width: isMobile ? "50%" : "70%",
                wordBreak: "break-word",
                textTransform:
                  option.value === "Token Standard:" ? "uppercase" : "none",
              }}
            >
              {option.value === "Smart Contract:" &&
              blockChainInfo[option.name] ? (
                <a
                  rel="noopener noreferrer"
                  href={smartContractsLink(blockChainInfo[option.name])}
                  style={{ color: "rgb(0 255 113)", textDecoration: "none" }}
                  target="_blank"
                >
                  {blockChainInfo[option.name]
                    ? blockChainInfo[option.name]
                    : "N/A"}
                </a>
              ) : option.value === "Token URI:" &&
                blockChainInfo[option.name] ? (
                <a
                  rel="noopener noreferrer"
                  href={blockChainInfo[option.name]}
                  style={{ color: "rgb(0 255 113)", textDecoration: "none" }}
                  target="_blank"
                >
                  {blockChainInfo[option.name]
                    ? blockChainInfo[option.name]
                    : "N/A"}
                </a>
              ) : (
                blockChainInfo[option.name] || "N/A"
              )}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
}

export { BlockChainInfo };
