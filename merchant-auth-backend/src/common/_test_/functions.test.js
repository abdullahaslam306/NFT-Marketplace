const { expect } = require('chai');
const { errors } = require('backend-utility');
const { StateUpdateException, CountryUpdateException, StatesNotFoundException } = errors.codes;
const { isStateAvailable, generateEncryptionKeys } = require('../functions');

describe('Testing isStateAvailable function', () => {
  let USAState = 'AL'
  let CANState = 'AB'

  it('should FAIL if state requested and country does not exist', () => {
    expect(() => isStateAvailable(undefined, USAState, null, null)).to.throw(StateUpdateException.message);
  });

  it('should FAIL if country requested and state does not exist', () => {
    expect(() => isStateAvailable('PAK', undefined, null, null)).to.throw(CountryUpdateException.message);
  });

  it('should PASS if only valid state requested and USA or CAN is saved in DB', () => {
    expect(() => isStateAvailable(undefined, USAState, 'USA', null)).to.not.throw();
    expect(() => isStateAvailable(undefined, CANState, 'CAN', null)).to.not.throw();
  });

  it('should FAIL if only invalid state requested and USA or CAN is saved in DB', () => {
    expect(() => isStateAvailable(undefined, CANState, 'USA', null)).to.throw(StatesNotFoundException.message);
    expect(() => isStateAvailable(undefined, USAState , 'CAN', null)).to.throw(StatesNotFoundException.message);
  });

  it('should PASS if only state requested and neither USA nor CAN is saved in DB', () => {
    expect(() => isStateAvailable(undefined, 'PBC' , 'ALG', null)).to.not.throw();
  });

  it('should PASS if only USA or CAN requested and state of respective country is saved in DB', () => {
    expect(() => isStateAvailable('USA', undefined, null, USAState)).to.not.throw();
    expect(() => isStateAvailable('CAN', undefined, null, CANState)).to.not.throw();
  });
  
  it('should FAIL if only USA or CAN requested and state of respective country is not saved in DB', () => {
    expect(() => isStateAvailable('USA', undefined, null, CANState)).to.throw(StatesNotFoundException.message);
    expect(() => isStateAvailable('CAN', undefined, null, USAState)).to.throw(StatesNotFoundException.message);
  });

  it('should PASS if only requested country is neither USA nor CAN and state is saved in DB', () => {
    expect(() => isStateAvailable('ALG', undefined, null, 'PBC')).to.not.throw();
  });

  it('should PASS if state and country requested, country is neither USA nor CAN', () => {
    expect(() => isStateAvailable('ALG', 'PBC', null, null)).to.not.throw();
  });

  it('should PASS if state and country requested, country is either USA or CAN and state of respective country provided', () => {
    expect(() => isStateAvailable('USA', USAState, null, null)).to.not.throw();
    expect(() => isStateAvailable('CAN', CANState, null, null)).to.not.throw();
  });

  it('should FAIL if state and country requested, country is either USA or CAN and state of respective country not provided', () => {
    expect(() => isStateAvailable('USA', CANState, null, null)).to.throw(StatesNotFoundException.message);
    expect(() => isStateAvailable('CAN', USAState, null, null)).to.throw(StatesNotFoundException.message);
  });
});

describe('Testing generateEncryptionKeys function', () => {
  it('should return public and private keys', async () => {
    const response = await generateEncryptionKeys();
    expect(response).to.not.undefined;
    expect(response).to.have.property('publicKey');
    expect(response).to.have.property('privateKey');
  })
})
