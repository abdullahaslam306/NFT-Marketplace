import * as React from "react";
import { Grid } from "@mui/material";
import Modal from "../Modal/ModalV2";
import BasicButton from "../Button/BasicButton";

import AssetManagement from "../AssetManagement/AssetManagement";

import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../actions";
import { useState } from "react";

export default function SelectAssetModal({ setSelectedAsset }) {
  const dispatch = useDispatch();
  const [pointerAsset, setPointerAsset] = useState(null);
  const nftReducer = useSelector((state) => (state && state.nftReducer) || {});

  const handleClose = async () => {
    dispatch(actions.nftActions.closeSelectAssetsForNFT());
  };

  const handleSelectedAssetForNFT = (data) => {
    setPointerAsset(data);
    // setSelectedAsset(data);
    nftReducer.nftEditData["assets"] = [
      {
        assetUid: data.id,
        assetType: "main",
      },
    ];
  };

  React.useEffect(() => {
    return () => handleClose();
  }, []);

  return (
    <Modal
      width={"100%"}
      open={nftReducer && nftReducer.assetsModalOpen}
      onClose={handleClose}
    >
      <Grid container direction="column">
        <Grid item md={12} sm={6}>
          <div
            style={{
              padding: "10px",
              overflow: "auto",
              height: "92vh",
              width: "100%",
              marginLeft: "1rem",
            }}
          >
            <AssetManagement
              isModal={true}
              heading="Select your NFT main file"
              handleSelectedAssetForNFT={handleSelectedAssetForNFT}
            />
          </div>
        </Grid>
        <Grid
          item
          md={12}
          sm={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "3rem",
          }}
        >
          <BasicButton
            onClickHandler={() => {
              setSelectedAsset(null);
              handleClose();
            }}
            title="Cancel"
            color="secondary"
            sx={{ mr: 0 }}
          ></BasicButton>
          <BasicButton
            onClickHandler={() => {
              setSelectedAsset(pointerAsset);
              handleClose();
            }}
            title="Select"
            color="primary"
            variant="contained"
          ></BasicButton>
        </Grid>
      </Grid>
    </Modal>
  );
}
