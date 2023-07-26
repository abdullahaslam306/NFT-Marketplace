import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import SmartContracts from "../SmartContract";

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

describe("Smart Contract Component", () => {
  beforeEach(() => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const initialState = {};
    const store = mockStore(initialState);
    render(
      <Provider store={store}>
        <SmartContracts />
      </Provider>
    );
  });

  afterAll(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("Title should be in the DOM", () => {
    const button = screen.getByText("Smart Contracts");
    expect(button).toBeInTheDocument();
  });

  it("Import existing smart contract button should be in the DOM", () => {
    const button = screen.getByText("Import existing smart contract");
    expect(button).toBeInTheDocument();
  });
  it("Pagination should be in the DOM", () => {
    const text = screen.getByTestId("Rows per page");
    expect(text).toBeInTheDocument();
  });
});
