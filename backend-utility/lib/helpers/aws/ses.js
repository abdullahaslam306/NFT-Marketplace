/**
 *  Implementation of helper methods related AWS
 */

const aws = require('aws-sdk');

const { REGION } = process.env;

/**
 * Helper function for sending email
 * @param {String} emailAddress
 * @param {String} subject
 * @param {String} content
 * @param {String} sourceEmail
 * @returns
 */
async function sendEmail(emailAddress, subject, content, sourceEmail = 'BLOCommerce Support <hello@blocommerce.com>') {
  const ses = new aws.SES({ region: REGION });
  const params = {
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Body: {
        Html: { Data: content },
      },

      Subject: { Data: subject },
    },
    Source: sourceEmail,
  };

  return ses.sendEmail(params).promise();
}

module.exports = {
  sendEmail,
};
