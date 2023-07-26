import { Typography, Box, Grid, Button, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/styles";
import { CircularProgress } from "@mui/material";
import {
  MetaMaskIcon,
  BloCommerceGreenIcon,
  MetaMaskIconSmall,
} from "../../BloIcons";
import Settings from "@mui/icons-material/Settings";
import { useSelector, useDispatch } from "react-redux";
import Menu from "../Menu/Menu";
import SuccessModal from "../successModal";
import SmartContract from "../SmartContracts/SmartContract";
import RenameWalletModal from "./RenameWalletModal/RenameWalletModal";
import { actions } from "../../actions";
import { commonActions } from "../../actions/commonActions";
import { walletService } from "../../services/walletService";
import AddWalletTag from "../addWallet";
let { displaySnackbar } = commonActions;

let anchorEl = null;

export default function WalletManagement() {
  const theme = useTheme();
  const [haha, setHaha] = useState(false);
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState();
  const [openRenameModal, setOpenRenameModal] = useState(false);
  const [walletTag, setWalletTag] = useState("");
  const [disconnectingWalletLoading, setDisconnectingWalletLoading] =
    useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const walletReducer = useSelector(
    (state) => (state && state.walletReducer) || {}
  );
  const dispatch = useDispatch();
  

  const handleMenuClick = (e, item) => {
    setHaha(item.id);
    setSelectedWallet(item);
    anchorEl = e.currentTarget;
    setOpen(true);
  };

  const clickedRenameModal = (wt) => {
    setOpenRenameModal(true);
    setOpen(false);
  };

  const closeModal = () => {
    setOpenRenameModal(false);
    setSelectedWallet(null);
  };

  const handleDisconnectWallet = async () => {
    try {
      setDisconnectingWalletLoading(true);
      const res = await walletService.disconnectExternalWallet(haha, {
        status: "disconnected",
      });
      setOpen(false);
      dispatch(actions.walletActions.getWallets());
      setDisconnectingWalletLoading(false);
      dispatch(displaySnackbar(res?.data?.response, "success"));
    } catch (error) {
      setDisconnectingWalletLoading(false);
      displaySnackbar(error.message || "An error has occured!");
    }
  };

  const menuProps = {
    anchorEl,
    onClose: () => setOpen(false),
    open,
    menuItems: [
      {
        label: "Rename",
      },
      {
        label: disconnectingWalletLoading ? (
          <CircularProgress size={28} sx={{ margin: "0 1.3rem" }} />
        ) : (
          "Disconnect"
        ),
        onClick: handleDisconnectWallet,
      },
    ],
  };

  const connectMetamask = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setWalletTag(result[0]);
          dispatch(
            actions.walletActions.connectExternalWallet(
              { address: result[0] },
              setOpenSuccessModal
            )
          );
          setTimeout(() => {
            setWalletTag("");
            setOpenSuccessModal(false);
          }, 4000);
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      setWalletTag("Please install MetaMask browser extension to interact.");
      dispatch(
        displaySnackbar(
          "Please install MetaMask browser extension to interact."
        )
      );
      setTimeout(() => {
        setWalletTag("");
      }, 500);
    }
  };

  useEffect(() => {
    dispatch(actions.walletActions.getWallets());
  }, []);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        padding: matches ? "3rem" : "16px",
        overflow: "hidden",
      }}
    >
      {walletTag && <AddWalletTag walletAddress={walletTag} />}
      <SuccessModal
        open={openSuccessModal}
        text="Congratulations!"
        subText={successMessage || 'Your wallet has been successfully added"'}
        subTextDisplay={true}
        onClose={() => {
          setOpenSuccessModal(false);
        }}
        closeButtonEnable={true}
      />
      <RenameWalletModal
        closeModal={closeModal}
        open={openRenameModal}
        wallet={selectedWallet}
        setOpenSuccessModal={setOpenSuccessModal}
        setSuccessMessage={setSuccessMessage}
      />
      <Typography
        sx={{
          fontSize: "28px",
          fontWeight: 900,
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          pb: "20px",
        }}
      >
        Wallet Management
      </Typography>

      <Grid
        container
        sx={matches ? { float: "right" } : { mt: "10px", float: "left" }}
        style={{ marginTop: "0.75rem" }}
      >
        <Grid item md={6} sm={6} xs={9}>
          <Typography variant="h4" sx={{ mt: "20px" }}>
          Wallets
          </Typography>
        </Grid>
        <Grid item md={6} sm={6} xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={connectMetamask}
            startIcon={<MetaMaskIconSmall />}
            id="my-first-step"
            style={
              matches
                ? { float: "right", margin: "15px 0px 15px 0px" }
                : { margin: "16px 0px 16px 0px" }
            }
           
          >
            ADD A WALLET
          </Button >
          
        </Grid>
      </Grid>
      <>
        <Grid
          container
          direction="column"
          sx={{ flexWrap: "wrap", marginTop: "2%" }}
        >
          
          {walletReducer?.walletList?.map((item) => {
            menuProps.menuItems[1].onClick = () =>
              handleDisconnectWallet(item.id);
            menuProps.menuItems[0].onClick = () => clickedRenameModal(item);

            menuProps.menuItems[1].label = disconnectingWalletLoading ? (
              <CircularProgress size={28} sx={{ margin: "0 1.3rem" }} />
            ) : (
              "Disconnect"
            );

            if (item?.attributes?.walletType?.toLowerCase() === "blocommerce") {
              return (<Grid
                container
                item
                spacing={0}
                // sx={
                //   matches
                //     ? { float: "right" }
                //     : { mt: "30px", float: "left", mb: "30px" }
                // }
                // xs={12}
                // sm={3}
                // md={6}
                lg={12}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "15px",
                  flexWrap: "nowrap",
                  backgroundColor: "#383F4E",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <Grid item sx={{ mr: "15px" }} md={0.5}>
                  <BloCommerceGreenIcon />
                </Grid>
                <Grid item sm={11.5}>
                  <Typography style={{ fontSize: "18px" }}>
                    Blocommerce (Default)
                  </Typography>
                  <Typography
                    style={
                      matches
                        ? {
                            fontSize: "14px",
                            color: "rgba(255, 255, 255, 0.5)",
                          }
                        : {
                            fontSize: "11px",
                            color: "rgba(255, 255, 255, 0.5)",
                          }
                    }
                  >
                   {item.attributes.address}
                  </Typography>
                </Grid>
              </Grid>);
            } else
              return (
                <Grid
                  container
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "15px",
                    flexWrap: "nowrap",
                    backgroundColor: "#383F4E",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                >
                  <Grid item sx={{ mr: "15px" }} md={0.5}>
                    <MetaMaskIcon />
                  </Grid>
                  <Grid item sm>
                    <Typography style={{ fontSize: "18px" }}>
                      {item.attributes.name}
                    </Typography>
                    <Typography
                      style={
                        matches
                          ? {
                              fontSize: "14px",
                              color: "rgba(255, 255, 255, 0.5)",
                            }
                          : {
                              fontSize: "11px",
                              color: "rgba(255, 255, 255, 0.5)",
                            }
                      }
                    >
                      {item.attributes.address}
                    </Typography>
                  </Grid>
                  <Menu wallet={item} {...menuProps} />

                  <Settings
                    color="active"
                    onClick={(e) => handleMenuClick(e, item)}
                    sx={{ cursor: "pointer" }}
                  />
                </Grid>
              );
          })}
        </Grid>
      </>
      <SmartContract />
    </Box>
  );
}
