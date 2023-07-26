const pagination = {
  offset: 0,
  limit: 10,
};

const MoralisApiResultLimit = 100;

const region = 'us-east-1';

const ORDERBY = {
  DESC: 'DESC',
  ASC: 'ASC',
};

const NftSecondarySaleRoyalty = {
  MIN: 0,
  MAX: 10,
};

const MaxNftSectionsCount = 10;

const NftStorageImageMimeType = 'image/*';

const BlocommerceWalletName = 'Blocommerce';

const BlocommerceSmartContractPlatformName = 'Blocommerce';

const EthereumNullAddress = '0x0000000000000000000000000000000000000000';

const DateFormat = 'YYYY-MM-DD';

const MoralisApiWaitTime = 5000;

const MoralisApiRetryCount = 3;

const QueueBatchSize = 10;

const BASE_GAS_PRICE = 21000;

module.exports = {
  region,
  ORDERBY,
  pagination,
  DateFormat,
  BASE_GAS_PRICE,
  QueueBatchSize,
  MoralisApiWaitTime,
  EthereumNullAddress,
  MaxNftSectionsCount,
  MoralisApiRetryCount,
  MoralisApiResultLimit,
  BlocommerceWalletName,
  NftStorageImageMimeType,
  NftSecondarySaleRoyalty,
  BlocommerceSmartContractPlatformName,
};
