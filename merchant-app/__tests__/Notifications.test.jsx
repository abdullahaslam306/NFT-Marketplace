import React from "react";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { waitFor } from "@testing-library/dom";
import NotificationComponent from "src/components/NotificationComponent";

afterAll(() => {
  cleanup();
});

test("Renders Notifications", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  let store;

  store = mockStore({});
  const { getByTestId } = render(
    <Provider store={store}>
      <NotificationComponent />
    </Provider>
  );
  getByTestId("notification-component");
  await waitFor(() => expect(getByTestId("notification-component")).toBeTruthy());
});

