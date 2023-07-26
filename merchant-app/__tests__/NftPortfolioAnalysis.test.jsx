/**
 * @jest-environment jsdom
 */

import React from "react";
import { cleanup, render, fireEvent } from "@testing-library/react";
import { ProtfolioContent } from "../src/components/NFTProtflioComponent/PortfolioContent";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { waitFor } from "@testing-library/dom";
import ProtfolioGraph from "../src/components/NFTProtflioComponent/PortfolioGraph";
import CustomizedTables from "../src/components/NFTProtflioComponent/PortfolioTable";
afterAll(() => {
  cleanup();
});

test("Multi Select renders value", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore(initialState);
  const { getByTestId } = render(
    <Provider store={store}>
      <ProtfolioContent />
    </Provider>
  );
  getByTestId("select-option");
  await waitFor(() => expect(getByTestId("select-option")).toBeTruthy());
});

test("Renders Charts", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore(initialState);
  const { getByTestId } = render(
    <Provider store={store}>
      <ProtfolioGraph />
    </Provider>
  );
  getByTestId("select-option");
  await waitFor(() => expect(getByTestId("select-option")).toBeTruthy());
});

test("Renders NFT Trasaction", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore({});
  const { getByTestId } = render(
    <Provider store={store}>
      <CustomizedTables />
    </Provider>
  );
  getByTestId("apexcharts-canvas");
  await waitFor(() => expect(getByTestId("apexcharts-canvas")).toBeTruthy());
});
