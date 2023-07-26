import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import { actions } from "../actions";
import InterimComponent from "../components/Interimcomponent/InterimComponent";

const NFTPortfolioAnalysis = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.commonActions.setDrawerState("NFTPortfolioAnalysis"));
  }, []);

  return (
    <InterimComponent
      pageName={"NFTPortfolioAnalysis"}
      element={
        <Layout>
          <CustomDrawer />
        </Layout>
      }
    />
  );
};

export default NFTPortfolioAnalysis;
