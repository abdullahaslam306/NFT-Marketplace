const { expect } = require('chai');
const functions = require('../function.js');
const { IncorrectCredentialsException } = require('../errors/error-code');
const {
  isValid,
  getUserId,
  isUndefined,
  isEmptyArray,
  isValidArray,
  isValidObject,
  isValidErrorCode,
  getUserCognitoSid,
} = functions;

describe('Testing functions in function.js', () => {
  const emptyArray = [];
  const populatedArray = ['test'];
  const emptyObject = {};
  const populatedObject = { value: 9 };
  const number = 8;
  const str = 'test';
  const errorCodeValue = {}
  const context = {
    event:{
      requestContext: {
        authorizer: {
          user_cognito_sid: '059a51c7-08e0-44d5-9027-53adb87d0a0d',
          user_id: '12',
        },
      },
    },
  };

  describe('Testing isEmptyArray', () => {
    it('should PASS if array is empty', () => {
      expect(isEmptyArray(emptyArray)).equal(true);
    });
    it('should FAIL if array is not empty', () => {
      expect(isEmptyArray(populatedArray)).equal(false);
      expect(isEmptyArray(emptyObject)).equal(false);
    });
  });

  describe('Testing isValidArray', () => {
    it('should PASS if array is valid', () => {
      expect(isValidArray(populatedArray)).equal(true);
    });
    it('should FAIL if array is invalid', () => {
      expect(isValidArray(emptyArray)).equal(false);
    });
  });

  describe('Testing isValid', () => {
    it('should PASS if value is valid', () => {
      expect(isValid(number)).equal(true);
      expect(isValid(str)).equal(true);
    });
    it('should FAIL if value is invalid', () => {
      expect(isValid('')).equal(false);
      expect(isValid(undefined)).equal(false);
      expect(isValid(null)).equal(false);
    });
  });

  describe('Testing isUndefined', () => {
    it('should PASS if value is valid', () => {
      expect(isUndefined(undefined)).equal(true);
      expect(isUndefined(null)).equal(true);
    });
    it('should FAIL if value is invalid', () => {
      expect(isUndefined(number)).equal(false);
      expect(isUndefined(str)).equal(false);
    });
  });

  describe('Testing isValidObject', () => {
    it('should PASS if value is valid', () => {
      expect(isValidObject(populatedObject)).equal(true);
      expect(isValidObject({})).equal(true);
    });
    it('should FAIL if value is invalid', () => {
      expect(isValidObject(number)).equal(false);
      expect(isValidObject(str)).equal(false);
    });
  });

  describe('Testing isValidErrorCode', () => {
    it('should PASS if error code is valid', () => {
      expect(isValidErrorCode(IncorrectCredentialsException)).equal(true);
    });
    it('should FAIL if error code is invalid', () => {
      expect(isValidErrorCode(errorCodeValue)).equal(false);
    });
  });

  describe('Testing getUserId', () => {
    it('should PASS if userId', () => {
      expect(getUserId(context)).equal('12');
    });
  });

  describe('Testing getUserCognitoSid', () => {
    it('should PASS if userId', () => {
      expect(getUserCognitoSid(context)).equal('059a51c7-08e0-44d5-9027-53adb87d0a0d');
    });
  });

  describe('Testing checkCodeExpiry', () => {
    const date = new Date();
    it('should PASS if timestamp is lesser than 3 minutes', () => {
      const timestamp = date.toString();
      expect(checkExpiryDate(timestamp)).to.be.true;
    });
    it('should FAIL if timestamp is older than 3 minutes', () => {
      date.setMinutes(date.getMinutes()-3);
      const timestamp = date.toString();
      expect(checkExpiryDate(timestamp)).to.be.false;
    });
  });
});
