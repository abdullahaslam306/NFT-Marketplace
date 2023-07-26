const { database, repositories } = require('data-access-utility');
const { configs } = require('backend-utility');
const pino = require('pino')({ level: process.env.LOG_LEVEL || 'trace' });
const ld = require('lodash');

const { CONFIRM_SIGNUP } = configs.enums.PostConfirmationTrigger;
let dbInstance = {};

/**
 * Handler for cognito post confirmation trigger
 * @param {Object} event
 * @param {Object} context
 */
const handler = async (event, context) => {
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false;
  const triggerSource = ld.get(event, 'triggerSource');
  try {
    pino.info('Event Data', event);

    dbInstance = await database.openConnection();
    switch (triggerSource) {
      case CONFIRM_SIGNUP:
        // eslint-disable-next-line no-case-declarations
        const emailVerification = ld.get(event, 'request.userAttributes.email_verified');
        if (emailVerification === 'true') {
          const email = ld.get(event, 'request.userAttributes.email');
          const userRepo = new repositories.User(dbInstance);
          const user = await userRepo.getByEmail(email);
          await userRepo.setEmailVerified(user);
        }
        break;
      default:
        break;
    }
    return Promise.resolve(event);
  } catch (exp) {
    pino.error(exp, 'Post Confirmation Lambda - Exception');
    throw exp;
  } finally {
    if (dbInstance) {
      await database.closeConnection(dbInstance);
    }
  }
};

module.exports = {
  handler,
};
