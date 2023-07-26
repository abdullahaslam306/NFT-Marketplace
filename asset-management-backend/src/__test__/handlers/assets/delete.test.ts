import { errors } from 'backend-utility';

import { action } from '../../../handlers/asset/delete';

const { EmptyAttributeException } = errors.codes;

const createEvent = triggerSource => ({
    pathParameters: {
      uid: triggerSource,
    },
  });

const createEventBody = (triggerSource, name) => ({
  pathParameters: {
    uid: triggerSource,
  },
  request:{
    body:{
      name: name,
    },
  }
});
const createContext = () => ({
    event: {
      requestContext: { 
        authorizer: {
          uid: 'c50e932a-b780-44c6-badc-709b7cef800c'
        }
      }
    }
  })

describe(`Delete API Empty request parameters`, async () => {
  test(`Require at least on parameter`, async() => {
    // const event = {};
    const uid = 'c50e932a-b780-44c6-badc-709b7cef800c';
    const event = createEvent(uid);
    const context = createContext();
    const connection = '';

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined();
    expect(result.statusCode).not.toBeUndefined();
    expect(result.statusCode).toEqual(400);
    const { response, responseCode } = result.body;
    expect(responseCode).toEqual(EmptyAttributeException.code);
    expect(response).toEqual(EmptyAttributeException.message);
      });
});

describe(`Delete API Empty name parameter`, async () => {
  test(`Require name parameter`, async() => {
    // const event = {};
    const uid = 'c50e932a-b780-44c6-badc-709b7cef800c';
    
    const event = createEventBody(uid,'');
    const context = createContext();
    const connection = '';

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined();
    expect(result.statusCode).not.toBeUndefined();
    expect(result.statusCode).toEqual(400);
    const { response, responseType } = result.body;
    expect(responseType).toEqual('Error');
    expect(response).toEqual('Provided asset name is empty.');
      });
});