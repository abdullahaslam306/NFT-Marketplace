import React, { useEffect } from "react";
import InterimComponent from "../components/Interimcomponent/InterimComponent";
import Layout from "../components/Layout";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import { actions } from "../actions";
import { useDispatch } from "react-redux";
// import Head from 'next/head';

// import {Helmet} from "react-helmet";

const NFTs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.commonActions.setDrawerState("nfts"));
  }, []);

  return (
    <>
      <InterimComponent
        pageName={"nfts"}
        element={
          <Layout>
            <CustomDrawer />
          </Layout>
        }
      />
    </>
  );
};

export default NFTs;
