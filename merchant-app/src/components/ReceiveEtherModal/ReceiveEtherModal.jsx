import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import ContentCopySharpIcon from "@mui/icons-material/ContentCopySharp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import QRCode from "react-qr-code";
import CustomModal from "../Modal/Modal";
import { actions } from "../../actions";
import { useTheme } from "@mui/styles";

export default function ReceiveEtherModal({
  showReceive,
  handleClose,
  title = "Show this QR code to receive ETH",
  isNFT = false,
}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const matchesSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const profile = useSelector((state) => state.profileReducer || {});
  const walletaddress =
    (profile &&
      profile.userProfile &&
      profile.userProfile.wallet &&
      profile.userProfile.wallet.address) ||
    "";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletaddress);
  };

  useEffect(() => {
    dispatch(actions.commonActions.setModalState(true));
  }, []);

  return (
    <CustomModal
      showModal={showReceive}
      isCloseButton={true}
      customStyle={{
        width: "432px",
        maxWidth: matchesSmDown ? "358px" : "unset",
      }}
      onClose={handleClose}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: matches ? "550px" : "100%",
          padding: "48px",
        }}
      >
        <Typography
          variant="h4"
          style={{
            fontSize: "28px",
            textAlign: "left",
          }}
        >
          {isNFT ? "Receive NFT" : "Receive Crypto"}
        </Typography>
        <Typography sx={{ mt: "10px", mb: "20px", textAlign: "left" }}>
          {title}
        </Typography>
        {isNFT && (
          <Grid
            container
            style={{
              background: "#383F4E",
              borderRadius: "4px",
              padding: "10px",
              maxWidth: "100%",
              margin: "20px auto",
            }}
          >
            <Grid item xs={1} flexWrap={"nowrap"}>
              <WarningAmberIcon
                color="warning"
                style={{ marginRight: "10px", marginTop: "10px" }}
              />
            </Grid>
            <Grid
              item
              sm
              style={{
                color: "#ebb440",
                fontSize: "14px",
                fontWeight: 400,
                textAlign: "left",
              }}
            >
              {`In order to properly display your NFTs in your wallet, please make sure the 
              smart contracts for minting the NFTs are supported in your account. Please visit wallet management to configure.`}
            </Grid>
          </Grid>
        )}
        <QRCode
          fgColor="#FFF"
          size={matchesSmDown ? 222 : 330}
          bgColor="transparent"
          value={walletaddress}
        />

        <div className="walletfield">
          <TextField
            variant="filled"
            disabled
            style={{
              background: "#383F4E",
              borderBottom: "0px",
              width: "100%",
              margin: "20px 0",
              borderRadius: "4px",
              borderColor: "transparent",
              padding: 0,
              WebkitTextFillColor: "#FFF",
              marginBottom: "0",
            }}
            multiline
            id="wallet-address"
            value={walletaddress}
            inputProps={{
              style: {
                fontSize: "13px",
                color: "#FFF",
                padding: "16px",
                WebkitTextFillColor: "#FFF",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    color="primary"
                    style={{
                      margin: "0",
                      justifyContent: "center",
                    }}
                    onClick={handleCopy}
                  >
                    <ContentCopySharpIcon />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Box>
    </CustomModal>
  );
}
