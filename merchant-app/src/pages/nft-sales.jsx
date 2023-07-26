import React, { useEffect } from "react";
import InterimComponent from "../components/Interimcomponent/InterimComponent";
import Layout from "../components/Layout";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import { actions } from "../actions";
import { useDispatch } from "react-redux";
// import Head from 'next/head';

// import {Helmet} from "react-helmet";

const NFTsales = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.commonActions.setDrawerState("nft-sales"));
  }, []);

  return (
    <>
      <InterimComponent
        pageName={"nft-sales"}
        element={
          <Layout>
            <CustomDrawer />
          </Layout>
        }
      />
    </>
  );
};

export default NFTsales;
