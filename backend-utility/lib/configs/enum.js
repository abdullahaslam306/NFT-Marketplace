const AccountStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
  LOCKED: 'locked',
  PENDING: 'pending',
  APPROVED: 'approved',
  INITIATED: 'initiated',
};

const CryptoSymbols = {
  ETH: 'eth',
  BTC: 'btc',
  XRP: 'xrp',
};

const WalletTypes = {
  BLOCOMMERCE: 'blocommerce',
  EXTERNAL: 'external',
};

const WalletStatus = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
};

const MfaTransactionAction = {
  SEND_NFT: 'send_nft',
  SEND_CRYPTO: 'send_crypto',
  UPDATE_PHONE: 'update_phone',
  UPDATE_PASSWORD: 'update_password',
  FORGOT_PASSWORD: 'forgot_password',
};

const InitializeMFAFor = {
  SEND_NFT: 'sendNft',
  SEND_CRYPTO: 'sendCrypto',
  UPDATE_PHONE: 'updatePhone',
  UPDATE_PASSWORD: 'updatePassword',
  FORGOT_PASSWORD: 'forgotPassword',
};

const MfaChannel = {
  EMAIL: 'email',
  PHONE: 'phone',
  BOTH: 'both',
};

const BlockChainNetwork = {
  ETHEREUM: 'eth',
  RINKEBY: 'rinkeby',
};

const TokenProtocol = {
  ERC721: 'erc721',
  ERC1155: 'erc1155',
};

const NftAssetType = {
  MAIN: 'main',
  AUXILIARY: 'auxiliary',
};

const PostConfirmationTrigger = {
  CONFIRM_SIGNUP: 'PostConfirmation_ConfirmSignUp',
};

const TempCredentialActions = {
  UPLOAD_ASSET: 'uploadAsset',
  GET_UPLOADED_NFTS: 'getAllNfts',
  GET_UPLOADED_ASSETS: 'getAllAssets',
  GET_PROFILE_IMAGE: 'getProfileImage',
  UPLOAD_PROFILE_IMAGE: 'uploadProfileImage',
  UPLOAD_ASSET_THUMBNAIL: 'uploadAssetThumbnail',
  GET_NFT_ASSETS: 'getNftAssets',
};

const CredentialPermission = {
  S3_FILE_UPLOAD: 's3:PutObject',
  S3_GET_OBJECT: 's3:GetObject',
  S3_ABORT_UPLOAD: 's3:AbortMultipartUpload',
};

const StateCountries = {
  USA: 'USA',
  CANADA: 'CAN',
};

const CustomMessageTrigger = {
  CUSTOM_MESSAGE_SIGNUP: 'CustomMessage_SignUp',
  CUSTOM_MESSAGE_RESEND_CODE: 'CustomMessage_ResendCode',
  CUSTOM_MESSAGE_FORGOT_PASSWORD: 'CustomMessage_ForgotPassword',
  VERIFICATION_EMAIL_SUBJECT: 'BLOCommerce | Please activate your BLOCommerce account',
  FORGOT_PASSWORD_EMAIL_SUBJECT: 'BLOCommerce | Reset your BLOCommerce account password',
};

const AssetStatus = {
  DRAFT: 'draft',
  PROCESSED: 'processed',
};

const AssetTypes = {
  AUDIO: 'audio',
  VIDEO: 'video',
  IMAGE: 'image',
  THREED_MODEL: '3d_model',
};

const AssetTypeExtensions = {
  AUDIO: {
    MP3: 'mp3',
    WAV: 'wav',
  },
  VIDEO: {
    MP4: 'mp4',
    MOV: 'mov',
    WEBM: 'webm',
  },
  IMAGE: {
    JPG: 'jpg',
    PNG: 'png',
    GIF: 'gif',
    SVG: 'svg',
    JPEG: 'jpeg',
  },
  THREED_MODEL: {
    GLB: 'glb',
    GLTF: 'gltf',
  },
};

const NftStatus = {
  DRAFT: 'draft',
  LIVE_LOCKED: 'live',
  LAZY_MINTED: 'lazy',
  PENDING: 'pending',
};

const MoralisNftTokenIdFormat = {
  DECIMAL: 'decimal',
  HEX: 'hex',
};

const LambdaInvocationType = {
  EVENT: 'Event',
  DRYRUN: 'DryRun',
  REQUEST_RESPONSE: 'RequestResponse ',
};

const NftTransactionEvents = {
  BUY: 'buy',
  SEND: 'send',
  SELL: 'sell',
  RECEIVE: 'receive',
  LIVE_LOCKED: 'live',
  LAZY_MINTED: 'lazy',
  TRANSFER: 'transfer',
};

const SmartContractTypes = {
  CUSTOM: 'custom',
  PLATFORM: 'platform',
};

const SmartContractIdentity = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
};

const FinancialFilter = {
  SPENDINGS: 'spendings',
  EARNINGS: 'earnings',
};

const AggregateFilters = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
};

const NftSyncStatus = {
  DRAFT: 'draft',
  FAILED: 'failed',
  COMPLETED: 'completed',
  INPROGRESS: 'inprogress',
};

const NftSyncStage = {
  NFT_ASSET_SYNC: 'nft_asset_sync',
  OWNED_NFT_SYNC: 'owned_nft_sync',
  HISTORICAL_NFT_SYNC: 'historical_nft_sync',
  NFT_TRANSACTION_SYNC: 'nft_transaction_sync',
};

const BlockchainSyncItemType = {
  NFT_ASSET_SYNC: 'nft_asset_sync',
  OWNED_NFT_SYNC: 'owned_nft_sync',
  HISTORICAL_NFT_SYNC: 'historical_nft_sync',
  NFT_TRANSACTION_SYNC: 'nft_transaction_sync',
};

const MoralisWatchType = {
  WATCH: 'watch',
  UNWATCH: 'unwatch',
};

const GasFeeEstimationActions = {
  MINT_NFT: 'mintNft',
  SEND_NFT: 'sendNft',
  SEND_CRYPTO: 'sendCrypto',
};

module.exports = {
  NftStatus,
  AssetTypes,
  MfaChannel,
  WalletTypes,
  AssetStatus,
  NftSyncStage,
  WalletStatus,
  NftSyncStatus,
  NftAssetType,
  CryptoSymbols,
  TokenProtocol,
  AccountStatus,
  StateCountries,
  FinancialFilter,
  AggregateFilters,
  InitializeMFAFor,
  MoralisWatchType,
  BlockChainNetwork,
  SmartContractTypes,
  AssetTypeExtensions,
  CredentialPermission,
  CustomMessageTrigger,
  LambdaInvocationType,
  MfaTransactionAction,
  NftTransactionEvents,
  SmartContractIdentity,
  TempCredentialActions,
  BlockchainSyncItemType,
  GasFeeEstimationActions,
  PostConfirmationTrigger,
  MoralisNftTokenIdFormat,
};
