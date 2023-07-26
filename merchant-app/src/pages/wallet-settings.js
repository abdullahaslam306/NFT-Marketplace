import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "../actions";
import Layout from "../components/Layout";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import InterimComponent from "../components/Interimcomponent/InterimComponent";

const CryptoCurrencyPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.commonActions.setDrawerState("wallet-settings"));
    dispatch(actions.profileActions.getUserProfile());
  }, []);

  return (
    <InterimComponent
      pageName={"wallet-settings"}
      element={
        <Layout>
          <CustomDrawer />
        </Layout>
      }
    />
  );
};

export default CryptoCurrencyPage;
