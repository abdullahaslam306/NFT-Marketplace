import React from "react";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { waitFor } from "@testing-library/dom";
import NFTsListing from "../src/components/Wallet/NFTsListing/NFTsListing";
import { NFTSendComponent } from "src/components/Wallet/SendNftModal/SendNftModal";

jest.mock("@mui/styles", () => {
  const original = jest.requireActual("@mui/styles");
  return {
    ...original,
    useTheme: () => {
      return {
        breakpoints: {
          up: (param) => (param ? false : true),
        },
      };
    },
  };
});

jest.mock("@mui/material/useMediaQuery", () =>
  jest.fn().mockResolvedValue(false)
);

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
      <NFTsListing />
    </Provider>
  );

  getByTestId("nftListcard");
  await waitFor(() => expect(getByTestId("nftListcard")).toBeTruthy());
});

test("Renders NFT send modals success", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore({});
  const { getByTestId } = render(
    <Provider store={store}>
      <NFTSendComponent />
    </Provider>
  );

  getByTestId("nftListcard");
  await waitFor(() => expect(getByTestId("nftListcard")).toBeTruthy());
});
