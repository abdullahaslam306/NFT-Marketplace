/**
 * Migration - Adding new enum values ("forgotPassword", "sendNft" ) in action column in mfa_transactions table.
 */

const { configs } = require('backend-utility');

const { enums } = configs;
const {
  UPDATE_PASSWORD, UPDATE_PHONE, SEND_CRYPTO, FORGOT_PASSWORD, SEND_NFT,
} = enums.MfaTransactionAction;

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query(`ALTER TYPE enum_mfa_transactions_action RENAME TO enum_mfa_transactions_action_old;
    CREATE TYPE enum_mfa_transactions_action AS ENUM('${FORGOT_PASSWORD}', '${SEND_CRYPTO}', '${SEND_NFT}', '${UPDATE_PASSWORD}', '${UPDATE_PHONE}');
    ALTER TABLE ONLY mfa_transactions ALTER COLUMN action SET DEFAULT null;
    ALTER TABLE mfa_transactions ALTER COLUMN action TYPE enum_mfa_transactions_action USING action::text::enum_mfa_transactions_action;
    ALTER TABLE ONLY mfa_transactions ALTER COLUMN action DROP DEFAULT;
    DROP TYPE enum_mfa_transactions_action_old;`),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.query(`ALTER TYPE enum_mfa_transactions_action RENAME TO enum_mfa_transactions_action_old;
    CREATE TYPE enum_mfa_transactions_action AS ENUM('${SEND_CRYPTO}', '${UPDATE_PASSWORD}', '${UPDATE_PHONE}');
    ALTER TABLE ONLY mfa_transactions ALTER COLUMN action SET DEFAULT null;
    ALTER TABLE mfa_transactions ALTER COLUMN action TYPE enum_mfa_transactions_action USING action::text::enum_mfa_transactions_action;
    ALTER TABLE ONLY mfa_transactions ALTER COLUMN action DROP DEFAULT;
    DROP TYPE enum_mfa_transactions_action_old;`),
};
