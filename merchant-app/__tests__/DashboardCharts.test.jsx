import React from "react";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { waitFor } from "@testing-library/dom";
import Dashboard from "src/components/DashboardV2";
import SpendingsGraph from "src/components/DashboardV2/Graph/Spendings";
import TransactionsGraph from "src/components/DashboardV2/Graph/Transactions";
import EarningsGraph from "src/components/DashboardV2/Graph/Earnings";

afterAll(() => {
  cleanup();
});

test("Renders dashboard charts", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore({});
  const { getByTestId } = render(
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
  getByTestId("apexcharts-canvas");
  await waitFor(() => expect(getByTestId("apexcharts-canvas")).toBeTruthy());
});

test("Renders Spending Graph", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore({});
  const { getByTestId } = render(
    <Provider store={store}>
      <SpendingsGraph />
    </Provider>
  );
  getByTestId("apexcharts-canvas");
  await waitFor(() => expect(getByTestId("apexcharts-canvas")).toBeTruthy());
});

test("Renders Earnings  Graph", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore({});
  const { getByTestId } = render(
    <Provider store={store}>
      <EarningsGraph />
    </Provider>
  );
  getByTestId("apexcharts-canvas");
  await waitFor(() => expect(getByTestId("apexcharts-canvas")).toBeTruthy());
});

test("Renders Transactions Graph", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore({});
  const { getByTestId } = render(
    <Provider store={store}>
      <TransactionsGraph />
    </Provider>
  );
  getByTestId("apexcharts-canvas");
  await waitFor(() => expect(getByTestId("apexcharts-canvas")).toBeTruthy());
});
