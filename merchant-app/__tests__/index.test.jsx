/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import CustomDrawer from "../src/pages/dashboard";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import * as redux from "react-redux";
import thunk from "redux-thunk";
import * as nextRouter from "next/router";

describe("Home", () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const initialState = { output: 10 };
  let store;
  it("renders a heading", () => {
    store = mockStore(initialState);
    const { getByText } = render(
      <Provider store={store}>
        <CustomDrawer />
      </Provider>
    );

    screen.getByText(/Getting Ready../i);
  });
});
