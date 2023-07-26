/**
 * @jest-environment jsdom
 */

import React from "react";
import { cleanup, render } from "@testing-library/react";
import { PreviewNFTModal } from "../src/components/Wallet/PreviewNFTModal/PreviewNFTModal";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { waitFor } from "@testing-library/dom";

afterAll(() => {
  cleanup();
});

test("Preview NFT open modal", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const initialState = {
    nftInfoById: {},
    blockChainInfo: [],
    trasactionHistory: [],
    loadingPreview: false,
    sectionList: [],
  };

  let store;

  store = mockStore(initialState);
  const { getByTestId } = render(
    <Provider store={store}>
      <PreviewNFTModal open={true} />
    </Provider>
  );
  getByTestId("preview-Open");
  await waitFor(() => expect(getByTestId("preview-Open")).toBeTruthy());
});

test("Preview NFT with Data modal", async () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const initialState = {
    nftInfoById: {
      assets: [],
      collaborators: [
        {
          username: null,
          picture: null,
          bio: null,
          twitter: null,
          facebook: null,
        },
      ],
      createdAt: "2021-12-17T12:31:30.953Z",
      description: "This is description for NFT",
      id: "bd98fd53-f70c-4ada-b1df-666055b1240e",
      owner: {
        username: null,
        picture: null,
        bio: null,
        twitter: null,
        facebook: null,
      },
      properties: (3)[{ name: "test-nft", value: "temp1" }],
      status: "draft",
      tags: (3)[("test-nft", "1@2V|,", "ABC_56789")],
      title: "Blocommerce-v0.1.7.0",
      totalEditions: 10,
    },
    blockChainInfo: [
      {
        nftId: 73,
        network: "eth",
        tokenId: 23,
        tokenProtocol: "erc721",
        contractAddress: "0x8807E576dA633f8431098d0a098d0a0EEDe3b8d6819B76",
        ipfsAddress: "0x8807E576dA633f8431098d0a0EEDe3b8d6819B76",
        mintedAt: "2021-12-20T19:00:00.000Z",
      },
    ],
    trasactionHistory: [
      {
        meta: { offset: 0, limit: 5, totalRecords: 2 },
        data: [
          {
            type: "NftTransactionHistories",
            id: "7",
            attributes: {
              nftId: 73,
              eventName: "sell",
              price: 0.678,
              fromWalletAddress: "0x8807E576dA633f8431098d0a0EEDe3b8d6819BDJFH",
              toWalletAddress: "0xE576dJH234FD3f8431098d0aASD3b8d6SKASFD",
              eventTime: "2021-12-20T19:00:00.000Z",
              ipfsLink: "0xE576dJH234FD3f8431098d0aASDSLKFAASFJ",
              gasFees: 0.2,
              editions: 3,
            },
          },
        ],
      },
    ],
    loadingPreview: false,
    sectionList: [
      {
        attributes: {
          content: "Testing NFt section",
          title: "Test NFT",
        },
      },
    ],
  };

  let store;

  store = mockStore(initialState);
  const { getByTestId } = render(
    <Provider store={store}>
      <PreviewNFTModal open={true} />
    </Provider>
  );
  await waitFor(() => expect(getByTestId("preview-Open")).toBeTruthy());
  getByTestId("preview-Open");
});
