import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Edit, Delete, Send, LocalFireDepartment } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/system";
import { actions } from "../../../actions";
import { useMediaQuery } from "@mui/material";

const StyledMenu = styled((props) => (
  <Menu
    elevation={1}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    background: "#383F4E",
    boxShadow:
      " 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
    borderRadius: "4px",
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "background: #383F4E;"
        : theme.palette.grey[300],
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function NFTCardMenu({
  data,
  open,
  anchorEl,
  handleClose,
  deleteNftClicked,
  handleOpenSendNft,
  setSelectedNft,
  showPreview,
}) {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const editButtonClicked = () => {
    if (isMobile) {
      showPreview();
      handleClose();
      return;
    }

    dispatch(actions.nftActions.resetNftInfoDetails());
    router.push(`/nft/${data.id}/draft`);
  };

  const handleSendNft = () => {
    if (
      data &&
      data.owners &&
      data.owners[0] &&
      !data.owners[0].editionsOwned
    ) {
      dispatch(
        actions.commonActions.displaySnackbar(
          "The user is not able to send NFT from external wallet.",
          "error"
        )
      );
    } /* if (
      data?.smartContract?.platformName?.toLowerCase() === "blocommerce"
    ) */ else {
      dispatch(actions.nftActions.getNFTInfoByID(false, data.id));
      handleOpenSendNft();
      handleClose();
      setSelectedNft({
        title: data.title,
        totalEditions: data.totalEditions,
        owners: data.owners,
        assets: data.assets,
        id: data.id,
      });
    }
  };

  const deleteButtonClicked = () => {
    deleteNftClicked(data);
  };

  return (
    <React.Fragment>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {(data.status === "draft" || data.status === "lazy") && (
          <MenuItem onClick={editButtonClicked}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
        )}
        {data.status === "live" && (
          <MenuItem
            onClick={handleSendNft}
            disabled={
              data.owners?.[0]?.editionsOwned < 1 ||
              data.owners?.[0]?.walletType !== "blocommerce"
            }
          >
            <ListItemIcon>
              <Send fontSize="small" />
            </ListItemIcon>
            Send
          </MenuItem>
        )}
        {(data.status === "draft" || data.status === "lazy") && (
          <MenuItem onClick={deleteButtonClicked}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}
      </StyledMenu>
    </React.Fragment>
  );
}
