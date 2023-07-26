const { expect } = require('chai');
const { handler } = require('../custom-message');

const createEvent = triggerSource => ({
  triggerSource,
  request: {
    userAttributes: {
      email: 'a@test.com',
    },
    codeParameter: 654987,
  },
});
const emailCheck = ['<html>', '<body', '<a'];

describe('Custom Message Trigger', () => {
  it('should PASS if trigger is CustomMessage_SignUp', async () => {
    const event = createEvent('CustomMessage_SignUp');
    const res = await handler(event);
    expect(res.response).not.undefined;
    const template = res.response.emailMessage;
    expect(template).to.a.string;
    emailCheck.push(event.request.userAttributes.email);
    emailCheck.push(event.request.codeParameter);
    expect(template).to.satisfy(template => emailCheck.every(bit => template.includes(bit)));
  });

  it('should PASS if trigger is CustomMessage_ResendCode', async () => {
    const event = createEvent('CustomMessage_ResendCode');
    const res = await handler(event);
    expect(res.response).not.undefined;
    const template = res.response.emailMessage;
    expect(template).to.a.string;
    emailCheck.push(event.request.userAttributes.email);
    emailCheck.push(event.request.codeParameter);
    expect(template).to.satisfy(template => emailCheck.every(bit => template.includes(bit)));
  });

  it('should PASS if trigger is CustomMessage_ForgotPassword', async () => {
    const event = createEvent('CustomMessage_ForgotPassword');
    const res = await handler(event);
    expect(res.response).not.undefined;
    const template = res.response.emailMessage;
    expect(template).to.a.string;
    emailCheck.push(event.request.userAttributes.email);
    emailCheck.push(event.request.codeParameter);
    expect(template).to.satisfy(template => emailCheck.every(bit => template.includes(bit)));
  });

  it('should FAIL if trigger is not CustomMessage_SignUp, CustomMessage_ResendCode or CustomMessage_ForgotPassword', async () => {
    const event = createEvent('CustomMessage');
    const res = await handler(event);
    expect(res.response).undefined;
  });
});
