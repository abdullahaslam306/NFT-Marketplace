const { helpers } = require('backend-utility');
const { database } = require('data-access-utility');

const { action: merchantInfoHandler } = require('./merchant/get-info');
const { action: signup, validationSchema: signupValidationSchema } = require('./merchant/signup');
const { action: sendMfaHandle, validationSchema: sendMfaValidationSchema } = require('./auth/send-mfa');
const { action: resendMfaHandle, validationSchema: resendMfaValidationSchema } = require('./auth/resend-mfa');
const { action: addPhoneHandler, validationSchema: addPhoneValidationSchema } = require('./merchant/add-phone');
const { action: profileUpdateHandler, validationSchema: profileUpdateValidationSchema } = require('./profile/update');
const { action: emailStatus, validationSchema: emailStatusValidationSchema } = require('./merchant/email-availability');
const { action: verifyPhoneHandler, validationSchema: verifyPhoneValidationSchema } = require('./merchant/verify-phone');
const { action: tempCredentialHandler, validationSchema: tempCredentialValidationSchema } = require('./auth/get-temp-credential');
const { action: forgotPasswordHandler, validationSchema: forgotPasswordValidationSchema } = require('./merchant/forgot-password');
const { action: verifyUpdatePhoneHandler, validationSchema: verifyUpdatePhoneValidationSchema } = require('./profile/update-phone');
const { action: verifyUpdatePasswordHandler, validationSchema: verifyUpdatePasswordValidationSchema } = require('./profile/update-password');
const { action: profileUniqueUsernameHandler, validationSchema: profileUniqueUsernameValidationSchema } = require('./profile/unique-username');
const { action: tempCredentialPublicHandler, validationSchema: tempCredentialPublicValidationSchema } = require('./auth/get-temp-credentials-public');

let dbConnection = {};

/**
 * Merchant info handler
 */
const merchantInfoHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET((event, context) => merchantInfoHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Merchant handler
 */
const merchantHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .POST(signupValidationSchema(), (event, context) => signup(event, context, dbConnection))
  .GET(emailStatusValidationSchema(), (event, context) => emailStatus(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Phone handler
 */
const phoneHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .POST(verifyPhoneValidationSchema(), (event, context) => verifyPhoneHandler(event, context, dbConnection))
  .PATCH(addPhoneValidationSchema(), (event, context) => addPhoneHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Auth handler
 */
const authHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .POST(sendMfaValidationSchema(), (event, context) => sendMfaHandle(event, context, dbConnection))
  .PUT(sendMfaValidationSchema(), (event, context) => sendMfaHandle(event, context, dbConnection))
  .PATCH(resendMfaValidationSchema(), (event, context) => resendMfaHandle(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Merchant Temporary credentials handler
 */
const tempCredentialsHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(tempCredentialValidationSchema(), (event, context) => tempCredentialHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Profile handler
 */
const profileHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .PATCH(profileUpdateValidationSchema(), (event, context) => profileUpdateHandler(event, context, dbConnection))
  .GET(profileUniqueUsernameValidationSchema(), (event, context) => profileUniqueUsernameHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Verify update password handler
 */
const verifyUpdatePasswordHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .PATCH(forgotPasswordValidationSchema(), (event, context) => forgotPasswordHandler(event, context, dbConnection))
  .PUT(verifyUpdatePasswordValidationSchema(), (event, context) => verifyUpdatePasswordHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Verify update phone handler
 */
const verifyUpdatePhoneHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .PUT(verifyUpdatePhoneValidationSchema(), (event, context) => verifyUpdatePhoneHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

/**
 * Merchant Temporary credentials public handler
 */
 const tempCredentialsPublicHandle = helpers.vandium.init(database)
  .before(() => { dbConnection = database.openConnection(); })
  .GET(tempCredentialPublicValidationSchema(), (event, context) => tempCredentialPublicHandler(event, context, dbConnection))
  .finally(() => database.closeConnection(dbConnection));

module.exports = {
  authHandle,
  phoneHandle,
  profileHandle,
  merchantHandle,
  merchantInfoHandle,
  tempCredentialsHandle,
  verifyUpdatePhoneHandle,
  verifyUpdatePasswordHandle,
  tempCredentialsPublicHandle,
};
