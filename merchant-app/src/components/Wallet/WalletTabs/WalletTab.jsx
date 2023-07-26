import React, { useState } from "react";
import { useDispatch } from "react-redux";
import NFTsListing from "../NFTsListing/NFTsListing";
import { Typography, Button, Box, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import ReceiveEtherModal from "../../ReceiveEtherModal/ReceiveEtherModal";
import CreateNftModal from "../CreateNftModal/CreateNftModal";
import { actions } from "../../../actions";
import { NFTFilters } from "../NFTsListing/NFTFilters/NFTFilters";
import MintNFTTag from "src/components/mintNftTag";
import { useSelector } from "react-redux";
import NFTPreviewMobileModal from "../NFTsListing/NFTPreviewMobileModal";

const WalletTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const profileReducer = useSelector(
    (state) => (state && state.profileReducer) || {}
  );
  const commonReducer = useSelector(
    (state) => (state && state.commonReducer) || {}
  );

  const [showReceive, setShowReceive] = useState(false);
  const [mintNftTag, setMintNftTag] = useState(false);
  const [receiveNftTag, setReceiveNftTag] = useState(false);
  const [showMintNftModal, setShowMintNftModal] = useState(false);
  const [showMintNFTFromCompModal, setShowMintNFTFromCompModal] =
    useState(false);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const dispatch = useDispatch();

  const handleReceive = () => {
    setReceiveNftTag(true);
    setShowReceive(true);
    setTimeout(() => {
      setReceiveNftTag(false);
    }, 500);
  };

  const handleNftModal = () => {
    if (isMobile) return setShowMintNFTFromCompModal(true);

    setMintNftTag(true);
    setShowMintNftModal(true);
    setTimeout(() => {
      setMintNftTag(false);
    }, 500);
  };

  const closeReceive = () => {
    dispatch(actions.commonActions.setModalState(false));
    setShowReceive(false);
  };

  const closenftModal = () => {
    setShowMintNftModal(false);
  };
  const [openSendNFT, setOpenSendNFT] = React.useState(false);

  React.useEffect(() => {
    if (commonReducer?.createModalOpen) {
      setShowMintNftModal(true);
    }
  }, [commonReducer?.createModalOpen]);

  return (
    <Box sx={{ minHeight: "80vh", padding: matches ? "3rem" : "16px" }}>
      {mintNftTag && (
        <MintNFTTag
          email={
            profileReducer &&
            profileReducer.userProfile &&
            profileReducer.userProfile.email
          }
        />
      )}
      {receiveNftTag && (
        <receiveNftTag
          email={
            profileReducer &&
            profileReducer.userProfile &&
            profileReducer.userProfile.email
          }
          walletAddress={
            profileReducer &&
            profileReducer.userProfile &&
            profileReducer.userProfile.wallet &&
            profileReducer.userProfile.wallet.address
          }
        />
      )}
      {showReceive && (
        <ReceiveEtherModal
          showReceive={showReceive}
          handleClose={closeReceive}
          title={"Show this QR code to receive ERC-721 and ERC-1155 NFTs"}
          isNFT={true}
        />
      )}
      <CreateNftModal
        open={showMintNftModal}
        handleClose={closenftModal}
        setOpen={setShowMintNftModal}
      />

      <NFTPreviewMobileModal
        open={showMintNFTFromCompModal}
        heading="You can only mint NFTs on desktop."
        buttonLabel="return"
        description="In order to access the tools to create your NFT, please proceed with your computer."
        handleClick={() => setShowMintNFTFromCompModal(false)}
      />

      <Grid
        container
        mb={isMobile ? "24px" : "12px"}
        sx={{
          pb: "20px",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <Grid item xs={12} md={8} sx={{ flexBasis: "unset" }}>
          <Typography
            style={{
              margin: "0px 8px",
              fontSize: "28px",
              fontWeight: 900,
              marginLeft: "0",
            }}
          >
            NFTs
          </Typography>
        </Grid>

        <Grid
          item
          sx={
            isTab || isMobile
              ? { float: "left", ml: "5px" }
              : { float: "right" }
          }
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleNftModal}
            style={{ margin: isTab || isMobile ? "0px 4px" : "0px" }}
            id="my-third-step-mobile"
          >
            Mint NFT
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{
              margin: isTab || isMobile ? "0px 4px" : "0px 10px 0 16px",
            }}
            onClick={handleReceive}
          >
            Receive NFT
          </Button>
        </Grid>
      </Grid>

      <NFTFilters />

      <NFTsListing openSendNFT={openSendNFT} setOpenSendNFT={setOpenSendNFT} />
    </Box>
  );
};

export default WalletTab;
