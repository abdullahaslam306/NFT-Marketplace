const { configs } = require('backend-utility');

const { enums } = configs;
const { SmartContractTypes, TokenProtocol, SmartContractIdentity } = enums;
const { PLATFORM } = SmartContractTypes;
const { EXTERNAL } = SmartContractIdentity;
const { ERC721, ERC1155 } = TokenProtocol;

exports.smartContracts = [
  {
    'address': '0x60f80121c31a0d46b5279700f9df786054aa5ee5',
    'platform_name': 'Rarible',
    'token_protocol': ERC721,
    'type': PLATFORM,
    'identity': EXTERNAL,
  },
  {
    'address': '0xd07dc4262BCDbf85190C01c996b4C06a461d2430',
    'platform_name': 'Rarible',
    'token_protocol': ERC1155,
    'type': PLATFORM,
    'identity': EXTERNAL,
  },
  {
    'address': '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    'platform_name': 'Bored Ape Yacht',
    'token_protocol': ERC721,
    'type': PLATFORM,
    'identity': EXTERNAL,
  },
  {
    'address': '0xb932a70a57673d89f4acffbe830e8ed7f75fb9e0',
    'platform_name': 'Superrare',
    'token_protocol': ERC721,
    'type': PLATFORM,
    'identity': EXTERNAL,
  },
  {
    'address': '0xa3bcf0e6aed1851a8612f34f90947c2a0eeef28d',
    'platform_name': 'Mintable',
    'token_protocol': ERC721,
    'type': PLATFORM,
    'identity': EXTERNAL,
  },
  {
    'address': '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b',
    'platform_name': 'OpenSea',
    'token_protocol': ERC721,
    'type': PLATFORM,
    'identity': EXTERNAL,
  },
  {
    'address': '0x495f947276749ce646f68ac8c248420045cb7b5e',
    'platform_name': 'OpenSea',
    'token_protocol': ERC1155,
    'type': PLATFORM,
    'identity': EXTERNAL,
  },
];
