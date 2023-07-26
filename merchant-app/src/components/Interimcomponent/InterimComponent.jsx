import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../Layout";
import { actions } from "../../actions";
import { getSavedUserSession } from "../../services/localStorage";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";
import { useRouter } from "next/router";

function InterimComponent({ pageName = "/login", element }) {
  const authReducer = useSelector((state) => state.authReducer || {});
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window != "undefined") {
      dispatch(actions.authActions.setUserSession(getSavedUserSession()));
    }
  }, []);

  if (typeof window != "undefined" && pageName !== "login") {
    if (authReducer.isAuthenticated) {
      return element;
    } else if (authReducer.setAuth) {
      router.push("/register", undefined, { shallow: true });
    } else {
      return (
        <Layout bgImg={"/images/BackgroundV2.jpg"}>
          <LoadingIndicator isModal={true} title={"Getting Ready.."} />
        </Layout>
      );
    }
  } else if (typeof window != "undefined") {
    if (authReducer.setAuth) {
      router.push("/register", undefined, { shallow: true });
    } else {
      return (
        <Layout bgImg={"/images/BackgroundV2.jpg"}>
          <LoadingIndicator isModal={true} title={"Getting Ready.."} />
        </Layout>
      );
    }
  }

  return (
    <Layout bgImg={"/images/BackgroundV2.jpg"}>
      <LoadingIndicator isModal={true} title={"Getting Ready... "} />
    </Layout>
  );
}

export default InterimComponent;
