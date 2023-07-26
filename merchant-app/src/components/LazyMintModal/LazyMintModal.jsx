import * as React from "react";
import { Box, Divider, Typography, Grid } from "@mui/material";
import Modal from "../Modal/ModalV2";
import BasicButton from "../Button/BasicButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function LazyAndMintModal({
  open,
  handleClose,
  setOpen,
  handleLazymintSubmit,
}) {
  return (
    <>
      <Modal open={open} onClose={handleClose} width={550}>
        <Box sx={{ p: 5 }}>
          <Typography
            variant="h3"
            sx={{ fontSize: "28px", fontWeight: "900", mb: 2 }}
          >
            Lazy Minting NFT
          </Typography>
          <Divider />
          <Grid container sx={{ mt: 2, mb: 5 }}>
            <Grid item xs={12}>
              <Typography sx={{ fontWeight: 400, fontSize: "16px" }}>
                You can continue to make edits to the NFT after the NFT is
                lazy-minted. No gas fee is needed for lazy-minting.
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <BasicButton
              color="primary"
              variant="contained"
              type={"submit"}
              title={"CONFIRM"}
              endIcon={<ArrowForwardIcon />}
              onClickHandler={() => handleLazymintSubmit("LAZY_MINT")}
              margin={0}
            />
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
