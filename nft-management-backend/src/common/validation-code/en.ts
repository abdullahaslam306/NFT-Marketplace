
const validationMessages = {
  nft: {
    title: {
      'any.required': 'Provided nft title is invalid.',
      'string.base': 'Provide a valid nft title.',
      'string.empty': 'Provided nft title is invalid.',
    },
    totalEditions: {
      'any.required': 'Provide valid number of editions for nft.',
      'number.min': 'Provide valid number of editions for nft.',
      'number.base': 'Provide valid number of editions for nft.',
      'number.empty': 'Provide valid number of editions for nft.',
      'number.integer': 'Provide valid number of editions for nft.',
      'number.unsafe': 'Provided number of editions for nft are invalid.',
    },
    secondarySaleRoyalty: {
      'any.required': 'Provide valid a value for nft secondary sale royalty.',
      'number.min': 'Provide valid a value for nft secondary sale royalty.',
      'number.base': 'Provide valid a value for nft secondary sale royalty.',
      'number.empty': 'Provide valid a value for nft secondary sale royalty.',
      'number.integer': 'Provide valid a value for nft secondary sale royalty.',
      'number.unsafe': 'Provide valid a value for nft secondary sale royalty.',
      'number.max': 'Secondary sale royalty cannot exceed 10 percent of the total sale amount.',
    },
    walletUids: {
      'any.empty': 'Provided wallet identifier is empty.',
      'string.base': 'Provided wallet identifiers information is invalid.',
      'string.guid': 'Provided wallet identifiers information is invalid.',
      'string.empty': 'Provided wallet identifier is empty.',
      'array.unique': 'Provided information for one or more given wallet identifiers is invalid.',
    },
    smartContractUids: {
      'any.empty': 'Provided smart contract identifier is empty.',
      'string.base': 'Provided smart contract identifiers information is invalid.',
      'string.guid': 'Provided smart contract identifiers information is invalid.',
      'string.empty': 'Provided smart contract identifier is empty.',
      'array.unique': 'Provided information for one or more given smart contracts is invalid.',
    },
  },
  nft_info: {
    uid: {
      'any.empty': 'Provided nft identifier is empty.',
      'any.required': 'Provided nft identifier is invalid.',
      'string.base': 'Provide a valid nft identifier.',
      'string.empty': 'Provided nft identifier is invalid.',
      'string.guid': 'Provided nft identifier is invalid.',
    },
    title: {
      'string.base': 'Provide a valid nft title.',
      'any.empty': 'Provided nft title is empty.',
      'string.empty': 'Provided nft title is empty.',
      'any.required': 'nft title is not provided.',
    },
    offset: {
      'number.empty': 'Provided offset is empty',
      'number.base': 'Provide a valid offset.',
      'number.integer': 'Provided offset is not an integer value',
      'number.min': 'Provided offset is lesser than allowed limit',
      'any.empty': 'Provided offset is empty',
    },
    limit: {
      'number.empty': 'Provided limit is empty',
      'number.base': 'Provide a valid limit.',
      'number.integer': 'Provided limit is not an integer value',
      'number.min': 'Provided limit is lesser than allowed limit',
      'any.empty': 'Provided limit is empty',
    },
    orderBy: {
      'string.empty': 'Provided orderBy is empty',
      'any.only': 'Provided orderBy value is invalid.',
      'any.empty': 'Provided orderBy is empty',
    },
  },
  nft_section: {
    title: {
      'string.base': 'Provide a valid section title.',
    },
    content: {
      'string.base': 'Provide a valid section content.',
    },
    sectionUid: {
      'any.empty': 'Provided section identifier is empty.',
      'any.required': 'Provided section identifier is invalid.',
      'string.base': 'Provide a valid section identifier.',
      'string.empty': 'Provided section identifier is invalid.',
      'string.guid': 'Provided section identifier is invalid.',
    },
  },
  update_nft: {
    uid: {
      'any.empty': 'Provided nft identifier is empty.',
      'any.required': 'Provided nft identifier is invalid.',
      'string.base': 'Provide a valid nft identifier.',
      'string.empty': 'Provided nft identifier is invalid.',
      'string.guid': 'Provided nft identifier is invalid.',
    },
    description: {
      'string.base': 'Provided nft description is invalid.',
    },
    status: {
      'any.only': 'Provided nft status is invalid.',
      'string.base': 'Provided nft status is invalid.',
    },
    hasUnlockableContent: {
      'boolean.base': 'Provided valid value whether nft contains unlockable content or not.',
    },
    unlockableContent: {
      'string.base': 'Provided information for unlockable content is invalid.',
    },
    tags: {
      'array.unique': 'Provided nft tags should not repeat.',
      'string.base': 'One or more nft tags are using invalid format.',
      'array.base': 'One or more nft tags are using invalid format.',
      'string.empty': 'One or more nft tags are using invalid format.',
    },
    assets: {
      'array.base': 'Provided nft associated assets information is invalid.',
      'array.empty': 'Provided nft associated asset information is invalid.',
      'any.required': 'Provided nft associated asset information is invalid.',
      'any.only': 'Provided nft associated asset information is invalid.',
      'any.allow': 'Provided information for one or more given nft associated assets is invalid.',
      'array.unique': 'Provided information for one or more given nft associated assets is invalid.',
    },
    'assets.assetType': {
      'any.required': 'Provided information for one or more nft associated assets is invalid.',
      'any.only': 'Provided information for one or more nft associated assets is invalid.',
    },
    'assets.assetUid': {
      'any.required': 'Provided information for one or more nft associated assets is invalid.',
      'string.base': 'Provided information for one or more nft associated assets is invalid.',
      'string.empty': 'Provided information for one or more nft associated assets is invalid.',
      'string.guid': 'Provided information for one or more nft associated assets is invalid.',
    },
    collaborators: {
      'array.includesRequiredUnknowns': 'Provided collaborators are empty.',
      'string.guid': 'Provided collaborators information is invalid.',
      'array.unique': 'Provided information for one or more given collaborators is invalid.',
    },
    properties: {
      'array.base': 'Provided nft properties information is invalid.',
      'object.base': 'Provided nft properties information is invalid.',
      'array.empty': 'Provided nft properties information is invalid.',
      'any.required': 'Provided nft properties information is invalid.',
      'any.only': 'Provided nft properties information is invalid.',
      'any.allow': 'Provided nft properties information is invalid.',
      'array.unique': 'Provided nft properties information is invalid.',
    },
    'properties.name': {
      'any.required': 'Provided information for one or more nft associated property name is invalid.',
      'string.base': 'Provided information for one or more nft associated property name is invalid.',
      'string.empty': 'Provided information for one or more nft associated property name is invalid.',
    },
    'properties.value': {
      'any.required': 'Provided information for one or more nft associated property value is invalid.',
      'string.base': 'Provided information for one or more nft associated property value is invalid.',
    },
  },
  transfer_nft: {
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
      'string.regex.base': 'Provided OTP code contains invalid character(s)/pattern.',
    },
    phoneCode: {
      'any.required': 'Provided OTP code is invalid.',
      'string.base': 'Provide a valid code.',
      'string.empty': 'Provided OTP code is empty.',
      'any.empty': 'Provided OTP code is empty.',
      'string.pattern.base': 'Provided OTP code is invalid.',
      'string.regex.base': 'Provided OTP code contains invalid character(s)/pattern.',
    },
    editions: {
      'any.required': 'Provide a valid edition number.',
      'any.empty': 'Provided editions number is empty.',
      'number.empty': 'Provided edition number is empty.',
      'number.min': 'Provide a valid editions of NFT to transfer.',
      'number.positive': 'Provide a valid editions of NFT to transfer.',
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
  public_nft: {
    contractAddress: {
      'any.required': 'Provide a valid contract address.',
      'any.invalid': 'Provide a valid contract address.',
      'any.empty': 'Provide a valid contract address.',
    },
    signature: {
      'any.invalid': 'Provide either valid signature or token id.',
      'any.empty': 'Provide either valid signature or token id.',
    },
    tokenId: {
      'any.invalid': 'Provide either valid signature or token id.',
      'any.empty': 'Provide either valid signature or token id.',
    },
  },
  generic: {
    none: {
      'any.*': 'Provide valid request data.',
    },
  },
  transactions_stats: {
    filter: {
      'any.only': 'Provide a valid filter.',
      'any.empty': 'Provide a valid filter.',
      'any.required': 'Provide a valid filter.',
      'string.required': 'Provide a valid filter.',
      'string.empty': 'Provide a valid filter.',
      'any.invalid': 'Provide a valid filter.',
    },
    startDate: {
      'date.only': 'Provide a valid start date.',
      'date.base': 'Provide a valid start date.',
      'any.required': 'Provide a valid start date.',
      'date.required': 'Provide a valid start date.',
      'string.invalid': 'Provide a valid start date.',
    },
    endDate: {
      'date.only': 'Provide a valid end date.',
      'date.base': 'Provide a valid end date.',
      'any.required': 'Provide a valid end date.',
      'date.required': 'Provide a valid end date.',
      'string.invalid': 'Provide a valid end date.',
    },
  }
};

export default validationMessages;
