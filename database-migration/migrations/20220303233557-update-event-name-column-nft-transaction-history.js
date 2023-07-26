/**
 * Migration - Adding new enum value "transfer" in event_name column in nft_transaction_history table.
 */

const { configs } = require('backend-utility');

const {
  BUY, LIVE_LOCKED, LAZY_MINTED, RECEIVE, SELL, SEND, TRANSFER,
} = configs.enums.NftTransactionEvents;

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query(`ALTER TYPE enum_nft_transaction_history_event_name RENAME TO enum_nft_transaction_history_event_name_old;
     CREATE TYPE enum_nft_transaction_history_event_name AS ENUM('${BUY}', '${LIVE_LOCKED}', '${LAZY_MINTED}', '${RECEIVE}', '${SELL}', '${SEND}', '${TRANSFER}');
     ALTER TABLE ONLY nft_transaction_history ALTER COLUMN event_name SET DEFAULT null;
     ALTER TABLE nft_transaction_history ALTER COLUMN event_name TYPE enum_nft_transaction_history_event_name USING event_name::text::enum_nft_transaction_history_event_name;
     ALTER TABLE ONLY nft_transaction_history ALTER COLUMN event_name DROP DEFAULT;
     DROP TYPE enum_nft_transaction_history_event_name_old;`),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.query(`ALTER TYPE enum_nft_transaction_history_event_name RENAME TO enum_nft_transaction_history_event_name_old;
     CREATE TYPE enum_nft_transaction_history_event_name AS ENUM('${BUY}', '${LIVE_LOCKED}', '${LAZY_MINTED}', '${RECEIVE}', '${SELL}', '${SEND}');
     ALTER TABLE ONLY nft_transaction_history ALTER COLUMN event_name SET DEFAULT null;
     ALTER TABLE nft_transaction_history ALTER COLUMN event_name TYPE enum_nft_transaction_history_event_name USING event_name::text::enum_nft_transaction_history_event_name;
     ALTER TABLE ONLY nft_transaction_history ALTER COLUMN event_name DROP DEFAULT;
     DROP TYPE enum_nft_transaction_history_event_name_old;`),
};
