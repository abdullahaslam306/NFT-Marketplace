import * as React from "react";
import { Container, CircularProgress, Box, useMediaQuery } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useSectionStyle, useNFTStyles } from "./NFTsListingStyles";
import CreateNftModal from "../CreateNftModal/CreateNftModal";
import { useDispatch, useSelector } from "react-redux";
import NFTCard from "./NFTsCard";
import { LoadingIndicator } from "../../LoadingIndicator/LoadingIndicator";
import { useCallback, useEffect, useRef, useState } from "react";
import { actions } from "../../../actions";
import {
  deleteNft,
  getTempCredentialsForNft,
} from "../../../services/nftServices";
import { NFTSendComponent } from "../SendNftModal/SendNftModal";
import { PreviewNFTModal } from "../PreviewNFTModal/PreviewNFTModal";
import SuccessFileDeletedModal from "../../SuccessFileDeletedModal";
import DeleteNftModal from "../DeleteNftModal/DeleteNftModal";
import { useTheme } from "@mui/material/styles";
import NFTPreviewMobileModal from "./NFTPreviewMobileModal";
import MintNFTTag from "src/components/mintNftTag";

const NFTsListing = ({ setOpenSendNFT, openSendNFT }) => {
  const theme = useTheme();
  const classes = useSectionStyle();
  const dispatch = useDispatch();
  const nftManageClasses = useNFTStyles();
  const [open, setOpen] = React.useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [listedNfts, setListedNfts] = useState([]);
  const [tempCred, setTempCredentials] = useState({});
  const { nftReducer } = useSelector((state) => state);
  const isLoading = useSelector((state) => state?.nftReducer?.loadingNftList);
  const profileReducer = useSelector(
    (state) => (state && state.profileReducer) || {}
  );
  const commonReducer = useSelector(
    (state) => (state && state.commonReducer) || {}
  );
  const [deletingNft, setDeletingNft] = useState(false);
  const [showDeleteNftModal, setShowDeleteNftModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState({});
  const [isNftTransfered, setIsNftTransfered] = useState(false);
  const [showSuccessDeleteNftModal, setShowSuccessDeleteNftModal] =
    useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showMintNFTFromCompModal, setShowMintNFTFromCompModal] =
    useState(false);
  const [showMintNftModal, setShowMintNftModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [nftId, setNftId] = useState("");
  const [nftSearchVal, setnftSearchVal] = useState("");
  const [mintNftTag, setMintNftTag] = useState(false);
  const { nftList, total, filters, pageNumber: pageNumberNFT } = nftReducer;
  let { displaySnackbar } = actions.commonActions;

  const handleClose = () => {
    setOpen(false);
  };
  const closenftModal = () => {
    setShowMintNftModal(false);
  };
  React.useEffect(() => {
    if (commonReducer?.createModalOpen) {
      setShowMintNftModal(true);
    }
  }, [commonReducer?.createModalOpen]);

  const observer = useRef();

  const lastCardElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (total > listedNfts.length) {
            let pg = pageNumberNFT + 1;
            dispatch(actions.nftActions.updateNFTPageNumber(pg));
            setPageNumber(pg);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, total]
  );

  const firstRender = React.useRef(true);
  useEffect(() => {
    if (isNftTransfered) {
      dispatch(actions.nftActions.setNftTransferResponse());
      dispatch(actions.nftActions.clearNFTList());
      setListedNfts([]);
      setPageNumber(0);
      dispatch(actions.nftActions.updateNFTPageNumber(0));
      const { walletUids, smartContractUids } = filters;
      dispatch(
        actions.nftActions.getNFTListAction(true, {
          pageNumber: 0,
          walletUids,
          smartContractUids,
        })
      );
      setIsNftTransfered(false);
    }
  }, [isNftTransfered]);

  useEffect(() => {
    setListedNfts([]);
  }, [filters]);

  useEffect(() => {
    return () => {
      dispatch(actions.nftActions.updateNFTPageNumber(0));
      dispatch(actions.nftActions.clearNFTList());
    };
  }, []);

  useEffect(() => {
    firstRender.current = false;
    const { walletUids, smartContractUids } = filters;
    dispatch(
      actions.nftActions.getNFTListAction(true, {
        pageNumber: pageNumberNFT,
        walletUids,
        smartContractUids,
      })
    );
    dispatch(actions.profileActions.getUserProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumberNFT, filters]);

  useEffect(() => {
    getTempCredentialsForNft().then((res) => {
      setTempCredentials(res);
    });
  }, []);

  useEffect(() => {
    if (nftReducer.hasFilter) {
      setListedNfts(nftList);
      dispatch(actions.nftActions.updateNFTHasFilter(false));
      return;
    }
    if (nftReducer.search !== nftSearchVal) {
      setnftSearchVal(nftReducer.search);
      setListedNfts(nftList);
      return;
    }

    if (nftList.length === 0) return;

    let arr = listedNfts.concat(nftList);
    let resp = [];
    const unique = [...new Set(arr.map((item) => item.id))];
    unique.map((item) => {
      resp.push(arr.find((x) => x.id === item));
    });

    resp
      ?.sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      })
      ?.reverse();

    setListedNfts(resp);
  }, [nftList]);

  const handleClickPreviewAPICall = (data) => {
    dispatch(actions.nftActions.getNFTInfoByID(true, data?.id));
    dispatch(actions.nftActions.getBlockChainInfoByIDAction(true, data?.id));
    dispatch(
      actions.nftActions.getTransactionHistoryByIDAction(true, data?.id)
    );
    dispatch(actions.nftActions.getSectionListAction(true, data?.id));
    setPreviewOpen(!previewOpen);
    setNftId(data?.id);
  };

  const closeModals = () => {
    setShowDeleteNftModal(false);
  };

  const deleteNftClicked = (nft) => {
    setShowDeleteNftModal(true);
    setNftId(nft?.id);
  };

  const handleDeleteNft = async () => {
    try {
      setDeletingNft(true);
      await deleteNft(nftId);
      setShowSuccessDeleteNftModal(true);
      setShowDeleteNftModal(false);
      setDeletingNft(false);
      setListedNfts([]);
      setPageNumber(0);
      dispatch(actions.nftActions.updateNFTPageNumber(0));
      dispatch(actions.nftActions.getNFTListAction());
      // To auto close success modal
      setTimeout(() => {
        setShowSuccessDeleteNftModal(false);
      }, 4800);
    } catch (error) {
      dispatch(displaySnackbar(error?.message));
      setDeletingNft(false);
    }
  };

  if (nftReducer.loadingNftList && nftReducer.nftList.length === 0) {
    return <CircularProgress className={classes.loading} color="primary" />;
  }
  const handleNFTModal = () => {
    if (isMobile) return setShowMintNFTFromCompModal(true);
    setMintNftTag(true);
    setShowMintNftModal(true);
    setTimeout(() => {
      setMintNftTag(false);
    }, 500);
  };

  return (
    <>
      <NFTPreviewMobileModal
        open={showMintNFTFromCompModal}
        heading="You can only mint NFTs on desktop."
        buttonLabel="return"
        description="In order to access the tools to create your NFT, please proceed with your computer."
        handleClick={() => setShowMintNFTFromCompModal(false)}
      />
      <CreateNftModal
        open={showMintNftModal}
        handleClose={closenftModal}
        setOpen={setShowMintNftModal}
      />
      {mintNftTag && (
        <MintNFTTag
          email={
            profileReducer &&
            profileReducer.userProfile &&
            profileReducer.userProfile.email
          }
        />
      )}
      <Container
        style={{
          minHeight: "80vh",
          padding: 0,
          display: listedNfts?.length === 0 && "grid",
          placeItems: listedNfts?.length === 0 && "center",
        }}
        className={classes.container}
      >
        {nftReducer.loading && (
          <LoadingIndicator isModal={true} title={"Minting NFT..."} />
        )}

        <CreateNftModal
          open={open}
          handleClose={handleClose}
          setOpen={setOpen}
        />
        <DeleteNftModal
          open={showDeleteNftModal}
          deletingNft={deletingNft}
          closeModal={closeModals}
          handleDeleteNft={handleDeleteNft}
        />
        <SuccessFileDeletedModal
          open={showSuccessDeleteNftModal}
          text="NFT deleted successfully"
        />
        {openSendNFT && (
          <NFTSendComponent
            openSendNFT={openSendNFT}
            handleCloseSendNFT={() => setOpenSendNFT(!openSendNFT)}
            selectedNft={selectedNft}
            setIsNftTransfered={setIsNftTransfered}
          />
        )}

        {previewOpen && (
          <PreviewNFTModal
            open={previewOpen}
            onClose={() => {
              setPreviewOpen(!previewOpen);
              dispatch(actions.nftActions.resetNftInfoDetails());
            }}
            nftId={nftId}
          />
        )}

        {!listedNfts.length > 0 ? (
          <div
            className={`${nftManageClasses.cardParent}`}
            onClick={() => handleNFTModal()}
          >
            <div>
              <ControlPointIcon
                color="primary"
                className={` ${nftManageClasses.addIcon}`}
                id="my-third-step"
              />
            </div>
            <div>
              <h1 className={nftManageClasses.uploadFile}>
                Mint your first NFT
              </h1>
            </div>
          </div>
        ) : (
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr 1fr"
                : "repeat(auto-fill, minmax(300px, 1fr))",
              gridGap: "1rem",
            }}
            data-testid="nftListcard"
          >
            {listedNfts.map((data, i) => (
              <Box key={i} className={classes.desktopGrid}>
                <div
                  ref={listedNfts.length === i + 1 ? lastCardElementRef : null}
                >
                  <NFTCard
                    classes={classes}
                    data={data}
                    tempCred={tempCred}
                    onClose={() => {
                      handleClickPreviewAPICall(data);
                    }}
                    deleteNftClicked={deleteNftClicked}
                    handleOpenSendNft={() => setOpenSendNFT(!openSendNFT)}
                    setSelectedNft={setSelectedNft}
                  />
                </div>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default NFTsListing;
