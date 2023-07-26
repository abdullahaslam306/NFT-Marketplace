import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import DisconnectModal from "../DisconnectModal";

    describe("Disconnect Smart Contract Modal", () => {
        
        beforeEach(() => {
            const middlewares = [thunk];
            const mockStore = configureMockStore(middlewares);
            const initialState = {};
            const store = mockStore(initialState);
            render(
                <Provider store={store}>
                    <DisconnectModal open={true} />
                </Provider>
            );
        });

        afterAll(() => {
            cleanup();
            jest.clearAllMocks();
        });
        
        it('Check the text', () => {
            const button = screen.getByText('Disconnect smart contract?');
            expect(button).toBeInTheDocument();
        })

        it('Disconnect button should be in the DOM', () => {
            const button = screen.getByText('Disconnect');
            expect(button).toBeInTheDocument();
        })

        it('Cancel button should be in the DOM', () => {
            const button = screen.getByText('Cancel');
            expect(button).toBeInTheDocument();
        })
    })