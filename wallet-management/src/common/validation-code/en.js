/**
 *  Implementation of validation codes for joi
 */

const validationMessages = {
  wallet_address: {
    walletAddress: {
      'any.only': 'Provide a valid destination wallet address.',
      'any.invalid': 'Provide a valid destination wallet address.',
      'any.empty': 'Provide a valid destination wallet address.',
      'string.base': 'Provide a valid destination wallet address.',
      'any.required': 'Provide a valid destination wallet address.',
      'string.email': 'Provide a valid destination wallet address.',
      'string.empty': 'Provide a valid destination wallet address.',
    },
    to: {
      'any.only': 'Provide a valid destination wallet address.',
      'any.invalid': 'Provide a valid destination wallet address.',
      'any.empty': 'Provide a valid destination wallet address.',
      'string.base': 'Provide a valid destination wallet address.',
      'any.required': 'Provide a valid destination wallet address.',
      'string.email': 'Provide a valid destination wallet address.',
      'string.empty': 'Provide a valid destination wallet address.',
    },
  },
  add_wallet: {
    address: {
      'any.only': 'Provide a valid wallet address.',
      'any.invalid': 'Provide a valid wallet address.',
      'any.empty': 'Provide a valid wallet address.',
      'string.base': 'Provide a valid wallet address.',
      'any.required': 'Provide a valid wallet address.',
      'string.empty': 'Provide a valid wallet address.',
    },
  },
  update_wallet: {
    uid: {
      'any.only': 'Provide a valid wallet uid.',
      'any.invalid': 'Provide a valid wallet uid.',
      'string.guid': 'Provided wallet identifier is invalid.',
      'any.empty': 'Provide a valid wallet uid.',
      'string.base': 'Provide a valid wallet uid.',
      'any.required': 'Provide a valid wallet uid.',
      'string.empty': 'Provide a valid wallet uid.',
    },
    name: {
      'any.only': 'Provide a valid wallet name.',
      'any.invalid': 'Provide a valid wallet name.',
      'any.empty': 'Provide a valid wallet name.',
      'string.base': 'Provide a valid wallet name.',
      'any.required': 'Provide a valid wallet name.',
      'string.empty': 'Provide a valid wallet name.',
    },
    status: {
      'any.only': 'Provide a valid wallet status.',
      'string.base': 'Provide a valid wallet status.',
    },
  },
  smart_contract: {
    uid: {
      'any.only': 'Provide a valid smart contract identifier.',
      'any.invalid': 'Provide a valid smart contract identifier.',
      'string.guid': 'Provided smart contract identifier is invalid.',
      'any.empty': 'Provide a valid smart contract identifier.',
      'string.base': 'Provide a valid smart contract identifier.',
      'any.required': 'Provide a valid smart contract identifier.',
      'string.empty': 'Provide a valid smart contract identifier.',
    },
    address: {
      'any.empty': 'Provide a valid smart contract address.',
      'any.invalid': 'Provide a valid smart contract address.',
      'string.base': 'Provide a valid smart contract address.',
      'any.required': 'Provide a valid smart contract address.',
      'string.empty': 'Provide a valid smart contract address.',
    },
  },
  get_crypto_rates: {
    crypto: {
      'any.only': 'Provide a valid crypto.',
      'any.invalid': 'Provide a valid crypto.',
      'any.empty': 'Provide a valid crypto.',
      'string.base': 'Provide a valid crypto.',
      'any.required': 'Provide a valid crypto.',
      'string.email': 'Provide a valid crypto.',
      'string.empty': 'Provide a valid crypto.',
    },
  },
  transfer_crypto: {
    value: {
      'any.empty': 'Provide a valid amount of crypto currency to transfer.',
      'any.unknown': 'Provide a valid amount of crypto currency to transfer.',
      'string.base': 'Provide a valid amount of crypto currency to transfer.',
      'string.empty': 'Provide a valid amount of crypto currency to transfer.',
      'any.required': 'Provide a valid amount of crypto currency to transfer.',
      'number.min': 'Provide a valid amount of crypto currency to transfer.',
      'number.positive':
        'Provide a valid amount of crypto currency to transfer.',
      'number.unsafe': 'Provide a valid amount of crypto currency to transfer.',
      'string.pattern.base':
        'Provide a valid amount of crypto currency to transfer.',
    },
    transactionUid: {
      'any.empty': 'Provided transactional ID is empty.',
      'any.required': 'Provided transactional ID is invalid.',
      'string.base': 'Provide a valid transactional ID.',
      'string.empty': 'Provided transactional ID is invalid.',
      'string.guid': 'Provided transactional ID is invalid.',
    },
    emailCode: {
      'string.base': 'Provide a valid OTP code.',
      'any.empty': 'Provided OTP code is empty.',
      'string.empty': 'Provided OTP code is empty.',
      'any.required': 'Provided OTP code is invalid.',
      'string.pattern.base': 'Provided OTP code is invalid.',
      'string.regex.base':
        'Provided OTP code contains invalid character(s)/pattern.',
    },
    phoneCode: {
      'any.required': 'Provided OTP code is invalid.',
      'string.base': 'Provide a valid code.',
      'string.empty': 'Provided OTP code is empty.',
      'any.empty': 'Provided OTP code is empty.',
      'string.pattern.base': 'Provided OTP code is invalid.',
      'string.regex.base':
        'Provided OTP code contains invalid character(s)/pattern.',
    },
  },
  currency: {
    fiat: {
      'any.required': 'Provide a valid currency.',
      'string.base': 'Provide a valid currency.',
      'any.empty': 'Provided currency is empty.',
      'string.empty': 'Provided currency is empty.',
      'any.only': 'Provided currency is not supported.',
    },
    sourceCurrency: {
      'any.required': 'Provide a valid currency.',
      'string.base': 'Provide a valid currency.',
      'any.empty': 'Provided currency is empty.',
      'string.empty': 'Provided currency is empty.',
      'any.only': 'Provided currency is not supported.',
    },
  },
  refill_wallet: {
    sourceAmount: {
      'any.empty': 'Provide a valid amount to transfer.',
      'any.unknown': 'Provide a valid amount to transfer.',
      'string.base': 'Provide a valid amount to transfer.',
      'string.empty': 'Provide a valid amount to transfer.',
      'any.required': 'Provide a valid amount to transfer.',
      'number.min': 'Provide a valid amount to transfer.',
      'number.positive': 'Provide a valid amount to transfer.',
      'number.unsafe': 'Provide a valid amount to transfer.',
      'string.pattern.base': 'Provide a valid amount to transfer.',
    },
    street1: {
      'any.only': 'Provide a valid street.',
      'any.invalid': 'Provide a valid street.',
      'any.empty': 'Provide a valid street.',
      'string.base': 'Provide a valid street.',
      'any.required': 'Provide a valid street.',
      'string.email': 'Provide a valid street.',
      'string.empty': 'Provide a valid street.',
    },
    postalCode: {
      'any.only': 'Provide a valid postalCode.',
      'any.invalid': 'Provide a valid postalCode.',
      'any.empty': 'Provide a valid postalCode.',
      'string.base': 'Provide a valid postalCode.',
      'any.required': 'Provide a valid postalCode.',
      'string.email': 'Provide a valid postalCode.',
      'string.empty': 'Provide a valid postalCode.',
    },
    address: {
      'any.only': 'Provide a valid address.',
      'any.invalid': 'Provide a valid address.',
      'any.empty': 'Provide a valid address.',
      'string.base': 'Provide a valid address.',
      'any.required': 'Provide a valid address.',
      'string.email': 'Provide a valid address.',
      'string.empty': 'Provide a valid address.',
    },
    city: {
      'any.only': 'Provide a valid city.',
      'any.invalid': 'Provide a valid city.',
      'any.empty': 'Provide a valid city.',
      'string.base': 'Provide a valid city.',
      'any.required': 'Provide a valid city.',
      'string.email': 'Provide a valid city.',
      'string.empty': 'Provide a valid city.',
    },
    state: {
      'any.only': 'Provide a valid state.',
      'any.invalid': 'Provide a valid state.',
      'any.empty': 'Provide a valid state.',
      'string.base': 'Provide a valid state.',
      'any.required': 'Provide a valid state.',
      'string.email': 'Provide a valid state.',
      'string.empty': 'Provide a valid state.',
    },
    country: {
      'string.base':
        'Provide a valid country. Wyre support Alpha‑2 code for countries',
      'any.empty':
        'Provided country is empty. Wyre support Alpha‑2 code for countries',
      'string.empty':
        'Provided country is empty. Wyre support Alpha‑2 code for countries',
      'any.only':
        'Provided country is not supported. Wyre support Alpha‑2 code for countries',
    },
  },
  gas_estimate: {
    action: {
      'any.only': 'Provided action to get gas fee is invalid.',
      'any.empty': 'Provided action to get gas fee is invalid.',
      'string.base': 'Provided action to get gas fee is invalid.',
      'any.required': 'Provided action to get gas fee is invalid.',
      'string.email': 'Provided action to get gas fee invalid.',
      'string.empty': 'Provided action to get gas fee is invalid.',
    },
    editions: {
      'any.required': 'Provide valid number of editions for nft.',
      'number.min': 'Provide valid number of editions for nft.',
      'number.base': 'Provide valid number of editions for nft.',
      'number.empty': 'Provide valid number of editions for nft.',
      'number.integer': 'Provide valid number of editions for nft.',
      'number.unsafe': 'Provided number of editions for nft are invalid.',
    },
    destinationWalletAddress: {
      'any.only': 'Provide a valid destination wallet address.',
      'any.invalid': 'Provide a valid destination wallet address.',
      'any.empty': 'Provide a valid destination wallet address.',
      'string.base': 'Provide a valid destination wallet address.',
      'any.required': 'Provide a valid destination wallet address.',
      'string.empty': 'Provide a valid destination wallet address.',
    },
    nftUid: {
      'any.empty': 'Provided nft identifier is empty.',
      'any.required': 'Provided nft identifier is invalid.',
      'string.base': 'Provide a valid nft identifier.',
      'string.empty': 'Provided nft identifier is invalid.',
      'string.guid': 'Provided nft identifier is invalid.',
    },
  },
  generic: {
    none: {
      'any.*': 'Provide valid request data.',
    },
  },
};

module.exports = {
  validationMessages,
};
