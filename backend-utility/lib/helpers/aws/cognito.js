/**
 *  Implementation of helper methods related AWS Cognito
 */

const AWS = require('aws-sdk');

/**
 * Update password for given user in cognito using admin access
 * @param {String} username
 * @param {String} password
 * @param {String} userPoolId
 */
async function adminSetCognitoUserPassword(username, password, userPoolId) {
  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  const params = {
    Username: username,
    Password: password,
    UserPoolId: userPoolId,
    Permanent: true,
  };
  await cognitoIdentityServiceProvider.adminSetUserPassword(params).promise();
}

/**
 * Update phone number for given user in cognito using admin access
 * Also mark the updated phone number as verified
 * @param {String} username
 * @param {String} phone
 * @param {String} userPoolId
 * @param {Boolean} markPhoneAsVerified
 */
async function adminUpdateCognitoUserPhone(username, phone, userPoolId, markPhoneAsVerified = false) {
  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  const params = {
    UserAttributes: [
      {
        Name: 'phone_number',
        Value: phone,
      },
    ],
    Username: username,
    UserPoolId: userPoolId,
  };

  if (markPhoneAsVerified === true) {
    const markPhoneVerifiedParams = {
      Name: 'phone_number_verified',
      Value: 'true',

    };
    params.UserAttributes.push(markPhoneVerifiedParams);
  }
  await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
}

module.exports = {
  adminSetCognitoUserPassword,
  adminUpdateCognitoUserPhone,
};
