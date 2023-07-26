const { StatusCodes } = require('http-status-codes');

module.exports = {
  EmptyAttributeException: { code: 'EmptyAttributeException', message: 'Update requires atleast one attribute.', status: StatusCodes.BAD_REQUEST },
  InvalidThumbnailPathException: { code: 'InvalidThumbnailPathException', message: 'Provided thumbnail already exist for given asset.', status: StatusCodes.BAD_REQUEST },
  InvalidOriginalPathException: { code: 'InvalidOriginalPathException', message: 'Asset in processed state can not be modified.', status: StatusCodes.BAD_REQUEST },

  S3DeleteObjectException: { code: 'S3DeleteObjectException', message: 'Failed to delete s3 object.', status: StatusCodes.BAD_REQUEST },

  AssetIsNftException: { code: 'AssetIsNftException', message: 'Asset is associated with nft, cannot be deleted.', status: StatusCodes.BAD_REQUEST },
  AssetsNotFoundException: { code: 'AssetsNotFoundException', message: 'Assets not found.', status: StatusCodes.NOT_FOUND },
  AssetNotFoundException: { code: 'AssetNotFoundException', message: 'Asset not found.', status: StatusCodes.NOT_FOUND },
  AssetFileNotFoundException: { code: 'AssetFileNotFoundException', message: 'Asset not found on s3.', status: StatusCodes.NOT_FOUND },

  InvalidUsernameException: { code: 'InvalidUsernameException', message: 'Invalid username provided.', status: StatusCodes.BAD_REQUEST },
  InvalidPasswordException: { code: 'InvalidPasswordException', message: 'Invalid password provided.', status: StatusCodes.BAD_REQUEST },
  StrongPasswordException: { code: 'StrongPasswordException', message: 'Password is less than 8 characters.', status: StatusCodes.BAD_REQUEST },
  InvalidVerificationCodeException: { code: 'InvalidVerificationCodeException', message: 'Invalid verification code.', status: StatusCodes.BAD_REQUEST },

  CountryNotFoundException: { code: 'CountryNotFoundException', message: 'Invalid country code provided.', status: StatusCodes.BAD_REQUEST },
  StatesNotFoundException: { code: 'StatesNotFoundException', message: 'States for provided country code does not exist.', status: StatusCodes.NOT_FOUND },
  StateUpdateException: { code: 'StateUpdateException', message: 'State cannot be updated without providing a country.', status: StatusCodes.NOT_FOUND },
  CountryUpdateException: { code: 'CountryUpdateException', message: 'Country cannot be updated without providing a state.', status: StatusCodes.NOT_FOUND },

  GenerateMfaException: { code: 'GenerateMfaException', message: 'Unable to generate MFA.', status: StatusCodes.BAD_REQUEST },
  MfaTransactionNotFoundException: { code: 'MfaTransactionNotFoundException', message: 'Given MFA transaction does not exist.', status: StatusCodes.BAD_REQUEST },
  UpdatedPhoneMismatchException: { code: 'UpdatedPhoneMismatchException', message: 'Provided phone number is mismatched.', status: StatusCodes.BAD_REQUEST },
  InvalidMFAActionSpecified: { code: 'InvalidMFAActionSpecified', message: 'Provided request action is invalid', status: StatusCodes.BAD_REQUEST },
  InvalidMfaChannelException: { code: 'InvalidMfaChannelException', message: 'Provided channel for sending MFA is invalid', status: StatusCodes.BAD_REQUEST },

  UsernameAlreadyExists: { code: 'UsernameAlreadyExists', message: 'Username already exists.', status: StatusCodes.BAD_REQUEST },
  UserNotFoundException: { code: 'UserNotFoundException', message: 'User account does not exist.', status: StatusCodes.NOT_FOUND },
  CreateUserException: { code: 'CreateUserException', message: 'User account can not be created.', status: StatusCodes.BAD_REQUEST },
  UserAlreadyVerifiedException: { code: 'UserAlreadyVerifiedException', message: 'User phone is already verified.', status: StatusCodes.BAD_REQUEST },
  ProfilePictureNotSetException: { code: 'ProfilePictureNotSetException', message: 'Profile picture has not been set.', status: StatusCodes.BAD_REQUEST },
  InvalidActionSpecified: { code: 'InvalidActionSpecified', message: 'Provided request action is invalid', status: StatusCodes.BAD_REQUEST },
  EmailNotFoundException: { code: 'EmailNotFoundException', message: 'Provided email address does not exist.', status: StatusCodes.BAD_REQUEST },
  CreateCognitoUserException: { code: 'CreateCognitoUserException', message: 'Unable to create cognito user.', status: StatusCodes.INTERNAL_SERVER_ERROR },

  MerchantNotFoundException: { code: 'MerchantNotFoundException', message: 'Merchant account does not exist.', status: StatusCodes.NOT_FOUND },
  MerchantAccountExistsException: { code: 'MerchantAccountExistsException', message: 'Merchant account already exist.', status: StatusCodes.BAD_REQUEST },
  CreateMerchantException: { code: 'CreateMerchantException', message: 'Merchant account cannot be created.', status: StatusCodes.BAD_REQUEST },
  WalletNotFoundException: { code: 'WalletNotFoundException', message: 'Wallet not found.', status: StatusCodes.BAD_REQUEST },
  WalletAddressAlreadyExistException: { code: 'WalletAddressAlreadyExistException', message: 'Wallet Address already exist.', status: StatusCodes.BAD_REQUEST },

  LimitExceededException: { code: 'LimitExceededException', message: 'Limit exceeded.', status: StatusCodes.BAD_REQUEST },
  IncorrectCredentialsException: { code: 'IncorrectCredentialsException', message: 'Incorrect credentials provided.', status: StatusCodes.BAD_REQUEST },
  InternalServerError: { code: 'InternalServerError', message: 'Something went wrong on our end. Please contact admin.', status: StatusCodes.INTERNAL_SERVER_ERROR },

  CodeExpiredException: { code: 'CodeExpiredException', message: 'Verification codes have been expired.', status: StatusCodes.BAD_REQUEST },
  CreateWalletException: { code: 'CreateWalletException', message: 'Wallet cannot be created.', status: StatusCodes.BAD_REQUEST },

  CreateSmartContractException: { code: 'CreateSmartContractException', message: 'Smart contract cannot be created.', status: StatusCodes.BAD_REQUEST },

  CreateCryptoRatesException: { code: 'CreateCryptoRatesException', message: 'Crypto rate record cannot be created.', status: StatusCodes.BAD_REQUEST },
  CryptoRateNotFoundException: { code: 'CryptoRateNotFoundException', message: 'Crypto rate does not exist.', status: StatusCodes.NOT_FOUND },

  CreateKmsKeysException: { code: 'CreateKmsKeysException', message: 'KMS key record cannot be created.', status: StatusCodes.BAD_REQUEST },
  KmsKeysNotFoundException: { code: 'KmsKeysNotFoundException', message: 'KMS key does not exist.', status: StatusCodes.NOT_FOUND },

  CreateContractAbiException: { code: 'CreateContractAbiException', message: 'Smart contract abi record cannot be created.', status: StatusCodes.BAD_REQUEST },
  ContractAbiNotFoundException: { code: 'ContractAbiNotFoundException', message: 'Smart contract abi does not exist.', status: StatusCodes.NOT_FOUND },

  InsufficientFundsException: { code: 'InsufficientFundsException', message: 'The account you tried to send transaction from does not have enough funds.', status: StatusCodes.NOT_FOUND },

  CreateAssetException: { code: 'CreateAssetException', message: 'Asset cannot be created.', status: StatusCodes.BAD_REQUEST },

  NftAssetNotFoundException: { code: 'NftAssetNotFoundException', message: 'Nft asset not found.', status: StatusCodes.BAD_REQUEST },

  PasswordDecryptionException: { code: 'PasswordDecryptionException', message: 'Unable to process request, please refresh your page.', status: StatusCodes.BAD_REQUEST },

  CreateNftException: { code: 'CreateNftException', message: 'Nft cannot be created.', status: StatusCodes.BAD_REQUEST },
  NoAssociatedWalletException: { code: 'NoAssociatedWalletException', message: 'No associated wallet found.', status: StatusCodes.BAD_REQUEST },
  NftNotFoundException: { code: 'NftNotFoundException', message: 'Nft does not exist.', status: StatusCodes.NOT_FOUND },
  NoNftsFoundException: { code: 'NoNftsFoundException', message: 'No Nfts found.', status: StatusCodes.NOT_FOUND },
  NftBlockChainInfoNotFoundException: { code: 'NftBlockChainInfoNotFoundException', message: 'Nft blockchain information does not exist.', status: StatusCodes.NOT_FOUND },
  CreateNftBlockChainInfoException: { code: 'CreateNftBlockChainException', message: 'Unable to create Nft blockchain info.', status: StatusCodes.BAD_REQUEST },
  UpdateNftBlockChainInfoException: { code: 'UpdateNftBlockChainInfoException', message: 'Unable to update Nft blockchain info.', status: StatusCodes.BAD_REQUEST },
  MinAssetsNftException: { code: 'MinAssetsNftException', message: 'Atleast one asset is required for updating Nft.', status: StatusCodes.BAD_REQUEST },
  AssetsUserNftException: { code: 'AssetsUserNftException', message: 'One or more given assets does not exists.', status: StatusCodes.BAD_REQUEST },
  NftAssetDeleteObjectException: { code: 'NftAssetDeleteObjectException', message: 'Unable to update Nft asset information.', status: StatusCodes.BAD_REQUEST },
  CreateNftAssetException: { code: 'CreateNftAssetException', message: 'Unable to update Nft asset information.', status: StatusCodes.BAD_REQUEST },
  CreateNftCollaboratorException: { code: 'CreateNftCollaboratorException', message: 'One or more given collaborators does not exists.', status: StatusCodes.BAD_REQUEST },
  AssetCountByTypeException: { code: 'AssetCountByTypeException', message: 'Only one main and upto four auxiliary assets can be assigned to Nft.', status: StatusCodes.BAD_REQUEST },
  NftNotInEditStateException: { code: 'NftNotInEditStateException', message: 'Nft with draft and lazy-minted state can be updated.', status: StatusCodes.BAD_REQUEST },
  CannotSetNftUnlockableContentException: { code: 'CannotSetNftUnlockableContentException', message: 'Unlockable content cannot be updated.', status: StatusCodes.BAD_REQUEST },
  NftDeleteException: { code: 'NftDeleteException', message: 'Only NFTs with draft and lazy-minted state can be deleted.', status: StatusCodes.BAD_REQUEST },
  TransferNftNotLiveException: { code: 'TransferNftNotLiveException', message: 'Only Nft in live and locked state can be transferred.', status: StatusCodes.BAD_REQUEST },
  NftOwnershipNotFoundException: { code: 'NftOwnershipNotFoundException', message: 'Nft must be owned before its transfer can take place.', status: StatusCodes.BAD_REQUEST },

  InvalidAssetPathException: { code: 'InvalidAssetPathException', message: 'Asset not found on specified path.', status: StatusCodes.NOT_FOUND },

  CreateNftSectionException: { code: 'CreateNftSectionException', message: 'Unable to create section for nft.', status: StatusCodes.BAD_REQUEST },
  NftSectionNotFoundException: { code: 'NftSectionNotFoundException', message: 'Nft section not found.', status: StatusCodes.NOT_FOUND },
  MaxNftSectionException: { code: 'MaxNftSectionException', message: 'Maximum 10 sections can be created.', status: StatusCodes.BAD_REQUEST },
  NftSectionNotInEditStateException: { code: 'NftSectionNotInEditStateException', message: 'Section for nft with only draft and lazy-minted state can be updated.', status: StatusCodes.BAD_REQUEST },
  NftTransactionHistoryNotFoundException: { code: 'NftTransactionHistoryNotFoundException', message: 'Nft transaction history does not exist.', status: StatusCodes.NOT_FOUND },
  NftSectionUpdateException: { code: 'NftSectionUpdateException', message: 'Unable to update nft section.', status: StatusCodes.NOT_FOUND },
  NftSectionDeleteException: { code: 'NftSectionDeleteException', message: 'Only sections associated with NFT with draft and lazy-minted state can be deleted.', status: StatusCodes.BAD_REQUEST },
  WalletUpdateException: { code: 'WalletUpdateException', message: 'Unable to update wallet.', status: StatusCodes.BAD_REQUEST },
  InvalidWalletStatusException: { code: 'InvalidWalletStatusException', message: 'Provided wallet status is invalid.', status: StatusCodes.BAD_REQUEST },
  UpdateThumbnailPathException: { code: 'UpdateThumbnailPathException', message: 'Thumbnail path cannot be changed.', status: StatusCodes.BAD_REQUEST },
  SmartContractNotFoundException: { code: 'SmartContractNotFoundException', message: 'Smart contract does not exist.', status: StatusCodes.NOT_FOUND },
  CreateUserSmartContractException: { code: 'CreateUserSmartContractException', message: 'Unable to create user smart contract.', status: StatusCodes.BAD_REQUEST },

  SmartContractForUserNotFoundException: { code: 'SmartContractForUserNotFoundException', message: 'Smart contract for this user does not exist.', status: StatusCodes.NOT_FOUND },

  InvalidWalletAddressException: { code: 'InvalidWalletAddressException', message: 'One or more given wallets are invalid.', status: StatusCodes.BAD_REQUEST },
  SameNftDestinationAddressException: { code: 'SameNftDestinationAddressException', message: 'You cannot send cryptocurrency to the same wallet address.', status: StatusCodes.BAD_REQUEST },
  SameEthDestinationAddressException: { code: 'SameEthDestinationAddressException', message: 'You cannot send crypt to the same wallet address.', status: StatusCodes.BAD_REQUEST },

  WalletUnavailableException: { code: 'WalletUnavailableException', message: 'One or more selected wallets are unavailable.', status: StatusCodes.BAD_REQUEST },
  SmartContractUnavailableException: { code: 'SmartContractUnavailableException', message: 'One or more selected smart contracts are unavailable.', status: StatusCodes.BAD_REQUEST },
  InvalidSmartContractException: { code: 'InvalidSmartContractException', message: 'One or more provided smart contracts are invalid.', status: StatusCodes.BAD_REQUEST },

  PubNubDataException: { code: 'PubNubDataException', message: 'Channel name and message is required for pubnub notifications.', status: StatusCodes.BAD_REQUEST },

  SmartContractAlreadyExistsException: { code: 'SmartContractAlreadyExistsException', message: 'Provided smart contract already exists.', status: StatusCodes.BAD_REQUEST },
  ImportSmartContractFailureException: { code: 'ImportSmartContractFailureException', message: 'Unable to import provided smart contract.', status: StatusCodes.BAD_REQUEST },

  CreateSyncException: { code: 'CreateSyncException', message: 'Unable to create sync.', status: StatusCodes.BAD_REQUEST },
  SyncNotFoundException: { code: 'SyncNotFoundException', message: 'Sync does not exist.', status: StatusCodes.NOT_FOUND },
  NftSyncAlreadyInprogressException: { code: 'NftSyncAlreadyInprogressException', message: 'Previous nft sync already in progress.', status: StatusCodes.BAD_REQUEST },
  NftTransactionSyncAlreadyInprogressException: { code: 'NftTransactionSyncAlreadyInprogressException', message: 'Previous nft transaction sync already in progress.', status: StatusCodes.BAD_REQUEST },
  UserSyncDataNotAvailableException: { code: 'UserSyncDataNotAvailableException', message: 'Users do not have any associated smart contract or wallets to sync data from.', status: StatusCodes.BAD_REQUEST },
  NoNftFoundException: { code: 'NoNftFoundException', message: 'No NFT found for storing.', status: StatusCodes.BAD_REQUEST },
  NftSyncBatchNotFoundException: { code: 'NftSyncBatchNotFoundException', message: 'Nft sync batch not found', status: StatusCodes.NOT_FOUND },
  NftSyncInfoMissingException: { code: 'NftSyncInfoMissingException', message: 'Nft sync identifier missing.', status: StatusCodes.NOT_FOUND },
  HistoricalNftSyncAlreadyInprogressException: { code: 'HistoricalNftSyncAlreadyInprogressException', message: 'Previous historical nft sync already in progress.', status: StatusCodes.BAD_REQUEST },
  HistoricalNftSyncDataNotAvailableException: { code: 'HistoricalNftSyncDataNotAvailableException', message: 'Historical NFT transactions do not have any associated smart contract or token id to sync data from.', status: StatusCodes.BAD_REQUEST },

  NftAlreadyMintedException: { code: 'NftAlreadyMinted', message: 'Nft already live and locked.', status: StatusCodes.BAD_REQUEST },
};
