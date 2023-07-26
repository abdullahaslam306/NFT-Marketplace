const abi721 = [
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'owner',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'approved',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'Approval',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'owner',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'bool',
        'name': 'approved',
        'type': 'bool',
      },
    ],
    'name': 'ApprovalForAll',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'LazyMintedTransfer',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'OwnershipTransferred',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'string',
        'name': '_uri',
        'type': 'string',
      },
    ],
    'name': 'TokenURIUpdated',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'Transfer',
    'type': 'event',
  },
  {
    'inputs': [
      {
        'internalType': 'string',
        'name': 'name',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': 'symbol',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': 'version',
        'type': 'string',
      },
    ],
    'name': 'InitializeERC721UpgradeableBlocommerce',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'approve',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'owner',
        'type': 'address',
      },
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'burn',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'getApproved',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'getCreator',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'owner',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
    ],
    'name': 'isApprovedForAll',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'tokenID',
        'type': 'uint256',
      },
      {
        'internalType': 'string',
        'name': '_uri',
        'type': 'string',
      },
    ],
    'name': 'mint',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_to',
        'type': 'address',
      },
      {
        'components': [
          {
            'internalType': 'address',
            'name': 'creator',
            'type': 'address',
          },
          {
            'internalType': 'uint256',
            'name': 'tokenId',
            'type': 'uint256',
          },
        ],
        'internalType': 'struct LibERC721LazyMint.NFT',
        'name': '_nft',
        'type': 'tuple',
      },
      {
        'internalType': 'string',
        'name': '_tokenURI',
        'type': 'string',
      },
      {
        'internalType': 'address',
        'name': '_signer',
        'type': 'address',
      },
      {
        'internalType': 'bytes',
        'name': '_signature',
        'type': 'bytes',
      },
    ],
    'name': 'mintAndTransfer',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'name',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'ownerOf',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'safeTransferFrom',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
      {
        'internalType': 'bytes',
        'name': '_data',
        'type': 'bytes',
      },
    ],
    'name': 'safeTransferFrom',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
      {
        'internalType': 'bool',
        'name': 'approved',
        'type': 'bool',
      },
    ],
    'name': 'setApprovalForAll',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'bytes4',
        'name': 'interfaceId',
        'type': 'bytes4',
      },
    ],
    'name': 'supportsInterface',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'symbol',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'index',
        'type': 'uint256',
      },
    ],
    'name': 'tokenByIndex',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'owner',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'index',
        'type': 'uint256',
      },
    ],
    'name': 'tokenOfOwnerByIndex',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'tokenURI',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'totalSupply',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'transferFrom',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
      {
        'internalType': 'string',
        'name': '_uri',
        'type': 'string',
      },
    ],
    'name': 'updateMetadata',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
];
const abi1155 = [
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'account',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'bool',
        'name': 'approved',
        'type': 'bool',
      },
    ],
    'name': 'ApprovalForAll',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256',
      },
    ],
    'name': 'LazyMintedTransfer',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'OwnershipTransferred',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256[]',
        'name': 'ids',
        'type': 'uint256[]',
      },
      {
        'indexed': false,
        'internalType': 'uint256[]',
        'name': 'values',
        'type': 'uint256[]',
      },
    ],
    'name': 'TransferBatch',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'id',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'TransferSingle',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'string',
        'name': 'value',
        'type': 'string',
      },
      {
        'indexed': true,
        'internalType': 'uint256',
        'name': 'id',
        'type': 'uint256',
      },
    ],
    'name': 'URI',
    'type': 'event',
  },
  {
    'inputs': [
      {
        'internalType': 'string',
        'name': '_name',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': '_symbol',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': '_uri',
        'type': 'string',
      },
      {
        'internalType': 'string',
        'name': '_version',
        'type': 'string',
      },
    ],
    'name': 'InitializeERC1155UpgradeableBlocommerce',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'account',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'id',
        'type': 'uint256',
      },
    ],
    'name': 'balanceOf',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address[]',
        'name': 'accounts',
        'type': 'address[]',
      },
      {
        'internalType': 'uint256[]',
        'name': 'ids',
        'type': 'uint256[]',
      },
    ],
    'name': 'balanceOfBatch',
    'outputs': [
      {
        'internalType': 'uint256[]',
        'name': '',
        'type': 'uint256[]',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': 'tokenId',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': 'editions',
        'type': 'uint256',
      },
    ],
    'name': 'burn',
    'outputs': [
      {
        'internalType': 'bool',
        'name': 'success',
        'type': 'bool',
      },
    ],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'name': 'creators',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'account',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
    ],
    'name': 'isApprovedForAll',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_editions',
        'type': 'uint256',
      },
      {
        'internalType': 'string',
        'name': '_tokenUri',
        'type': 'string',
      },
    ],
    'name': 'mint',
    'outputs': [
      {
        'internalType': 'bool',
        'name': 'success',
        'type': 'bool',
      },
    ],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_to',
        'type': 'address',
      },
      {
        'components': [
          {
            'internalType': 'address',
            'name': 'creator',
            'type': 'address',
          },
          {
            'internalType': 'uint256',
            'name': 'tokenId',
            'type': 'uint256',
          },
          {
            'internalType': 'uint256',
            'name': 'editions',
            'type': 'uint256',
          },
        ],
        'internalType': 'struct LibERC1155LazyMint.NFT',
        'name': '_nft',
        'type': 'tuple',
      },
      {
        'internalType': 'string',
        'name': '_tokenUri',
        'type': 'string',
      },
      {
        'internalType': 'address',
        'name': '_signer',
        'type': 'address',
      },
      {
        'internalType': 'bytes',
        'name': '_signature',
        'type': 'bytes',
      },
    ],
    'name': 'mintAndTransfer',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256[]',
        'name': '_tokenIDs',
        'type': 'uint256[]',
      },
      {
        'internalType': 'uint256[]',
        'name': '_editions',
        'type': 'uint256[]',
      },
      {
        'internalType': 'string[]',
        'name': '_tokenUri',
        'type': 'string[]',
      },
    ],
    'name': 'mintBatch',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'name',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'owner',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'internalType': 'uint256[]',
        'name': 'ids',
        'type': 'uint256[]',
      },
      {
        'internalType': 'uint256[]',
        'name': 'amounts',
        'type': 'uint256[]',
      },
      {
        'internalType': 'bytes',
        'name': 'data',
        'type': 'bytes',
      },
    ],
    'name': 'safeBatchTransferFrom',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'id',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256',
      },
      {
        'internalType': 'bytes',
        'name': 'data',
        'type': 'bytes',
      },
    ],
    'name': 'safeTransferFrom',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'operator',
        'type': 'address',
      },
      {
        'internalType': 'bool',
        'name': 'approved',
        'type': 'bool',
      },
    ],
    'name': 'setApprovalForAll',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'bytes4',
        'name': 'interfaceId',
        'type': 'bytes4',
      },
    ],
    'name': 'supportsInterface',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [],
    'name': 'symbol',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'totalSupply',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': 'newOwner',
        'type': 'address',
      },
    ],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
      {
        'internalType': 'string',
        'name': '_newUri',
        'type': 'string',
      },
    ],
    'name': 'updateURI',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_tokenId',
        'type': 'uint256',
      },
    ],
    'name': 'uri',
    'outputs': [
      {
        'internalType': 'string',
        'name': '',
        'type': 'string',
      },
    ],
    'stateMutability': 'view',
    'type': 'function',
  },
];

module.exports = {
  abi721,
  abi1155,
};
