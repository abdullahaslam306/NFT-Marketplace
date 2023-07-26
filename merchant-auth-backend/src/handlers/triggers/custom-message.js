/* eslint-disable no-param-reassign */
const { readFileSync } = require('fs');
const { configs } = require('backend-utility');

const {
  CUSTOM_MESSAGE_SIGNUP,
  CUSTOM_MESSAGE_RESEND_CODE,
  VERIFICATION_EMAIL_SUBJECT,
  FORGOT_PASSWORD_EMAIL_SUBJECT,
  CUSTOM_MESSAGE_FORGOT_PASSWORD,
} = configs.enums.CustomMessageTrigger;

/**
 * Function to load HTML template for email
 * @param {string} link
 * @param {string} templatePath
 */
const loadTemplate = async (link, templatePath) => {
  const paths = __dirname.split('\\');
  paths.splice(paths.length - 2);
  const emailPath = paths.concat(['common', 'template', templatePath]).join('/');
  const template = await readFileSync(emailPath).toString().replace(new RegExp('{link}', 'g'), link);
  return template;
};

/**
 * Handler for cognito custom message trigger
 * @param {*} event
 */
const handler = async event => {
  const { MERCHANT_APP_DOMAIN } = process.env;
  const { userAttributes, codeParameter } = event.request;
  const { email } = userAttributes;

  let link = `https://${MERCHANT_APP_DOMAIN}/authenticate?email=${email}&confirmation_code=${codeParameter}`;
  switch (event.triggerSource) {
    case CUSTOM_MESSAGE_SIGNUP:
    case CUSTOM_MESSAGE_RESEND_CODE:
      event.response = {
        emailSubject: VERIFICATION_EMAIL_SUBJECT,
        emailMessage: await loadTemplate(link, 'account-verification-email.html'),
      };
      break;
    case CUSTOM_MESSAGE_FORGOT_PASSWORD:
      link = `https://${MERCHANT_APP_DOMAIN}/forgot-password?email=${email}&confirmation_code=${codeParameter}`;
      event.response = {
        emailSubject: FORGOT_PASSWORD_EMAIL_SUBJECT,
        emailMessage: await loadTemplate(link, 'forgot-password.html'),
      };
      break;
    default:
      break;
  }

  return event;
};

module.exports = {
  handler,
};
