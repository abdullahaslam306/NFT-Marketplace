import React, { useEffect } from "react";
import Layout from "../components/Layout";
import HeaderComponent from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ProfileInfo from "../components/ProfileInfo/ProfileInfo";
import InterimComponent from "../components/Interimcomponent/InterimComponent";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import { actions } from "../actions";
import { useDispatch } from "react-redux";

export default function Profile() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.commonActions.setDrawerState("profile-setting"));
    dispatch(actions.profileActions.getUserProfile());
  }, []);
  return (
    <InterimComponent
      pageName={"/profile-setting"}
      element={
        <Layout>
          <CustomDrawer />
        </Layout>
      }
    />
  );
}
