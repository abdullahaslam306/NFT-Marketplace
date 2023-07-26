/**
 *  Implementation of helper methods related AWS
 */

const aws = require('aws-sdk');

const { REGION } = process.env;

aws.config.update({ region: REGION });

/**
 * Helper function for sending email
 * @param {String} phoneNumber
 * @param {String} message
 * @returns
 */
async function sendSMS(phoneNumber, message) {
  const sns = new aws.SNS({ apiVersion: '2010-03-31' });
  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };
  await setSMSAttribute();
  return sns.publish(params).promise();
}

async function setSMSAttribute() {
  const sns = new aws.SNS({ apiVersion: '2010-03-31' });
  // Create SMS Attribute parameters
  const params = {
    attributes: { /* required */
      'DefaultSMSType': 'Transactional', /* highest reliability */
      // 'DefaultSMSType': 'Promotional' /* lowest cost */
      'DefaultSenderID': 'Blocommerce',
    },
  };

  return sns.setSMSAttributes(params).promise();
}

module.exports = {
  sendSMS,
  setSMSAttribute,
};
