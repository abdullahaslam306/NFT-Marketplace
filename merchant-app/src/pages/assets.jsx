import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import { actions } from "../actions";
import InterimComponent from "../components/Interimcomponent/InterimComponent";

const Asset = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.commonActions.setDrawerState("assets"));
  }, []);

  return (
    <InterimComponent
      pageName={"assets"}
      element={
        <Layout>
          <CustomDrawer />
        </Layout>
      }
    />
  );
};

export default Asset;
