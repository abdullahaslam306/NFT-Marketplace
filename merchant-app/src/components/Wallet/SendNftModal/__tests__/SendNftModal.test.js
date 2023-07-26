import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { NFTSendComponent } from "../SendNftModal";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

    jest.mock('../../../../actions/walletActions', () => ({
        gasEstimate: jest.fn()
    }))

    jest.mock('../SendNftModalStyles', () => ({
        useSendNFTStyles: jest.fn().mockResolvedValue({
                container: {},
                messageWalletAddress: {},
                divider: {},
                gasfeesWrapper: {},
                dflex: {},
                mobileViewSendNFT: {}
            })
        })
    );

    jest.mock('@mui/material/useMediaQuery', () => jest.fn().mockResolvedValue(false))

    describe("Send NFT Modal", () => {
        
        beforeAll(() => {
            const middlewares = [thunk];
            const mockStore = configureMockStore(middlewares);
            const initialState = {};
            const store = mockStore(initialState);
            render(
                <Provider store={store}>
                    <NFTSendComponent openSendNFT={true} />
                </Provider>
            );
        });

        afterAll(() => {
            cleanup();
            jest.clearAllMocks();
        });
        
        it('Title should be in the DOM', () => {
            const title = screen.getByTestId('send-nft-modal-title');
            expect(title).toBeInTheDocument();
            expect(title.textContent).toEqual('Send NFT ');
        })
    })