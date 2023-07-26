const jsonSerializer = require("jsonapi-serializer");

const { Deserializer } = jsonSerializer;

const serialized = {
  meta: {
    offset: 0,
    limit: 1,
    total: 1,
  },
  data: [
    {
      type: "Nfts",
      id: "2",
      attributes: {
        title: "Test NFT",
        status: "draft",
        totalEditions: 1,
        createdAt: "2021-09-29T23:07:03.794Z",
      },
      relationships: {
        owners: {
          data: [
            {
              type: "owners",
              id: "2",
            },
          ],
        },
        assets: {
          data: [
            {
              type: "assets",
              id: "2",
            },
          ],
        },
      },
    },
  ],
  included: [
    {
      type: "nft_owners",
      id: "2",
      attributes: {
        nftId: 2,
        editionsOwned: 1,
        editionsToSell: 0,
      },
    },
    {
      type: "nft_assets",
      id: "2",
      attributes: {
        nftId: 2,
        asset: {
          id: 4,
          uid: "1a0a1f4e-0b5e-4ea5-bfb5-e017ee6170d3",
          user_id: null,
          name: "car",
          type: "audio",
          file_extension: "mp3",
          size: 50,
          original_path: null,
          thumbnail_path: null,
          compressed_path: null,
          status: "draft",
          createdAt: "2021-11-02T22:55:14.571Z",
          updatedAt: "2021-11-02T22:55:14.571Z",
        },
        assetType: "main",
      },
    },
  ],
};

const options = {
  keyForAttribute: "camelCase",
};

export const deSerializedNftList = (resp) => {
  return new Deserializer(options).deserialize(resp);
};
// const deSerialized = new Deserializer(options).deserialize(serialized)
