import { errors } from 'backend-utility';

import { action } from '../handlers/asset/update';

const { EmptyAttributeException } = errors.codes;

const createEvent = triggerSource => ({
    pathParameters: {
      uid: triggerSource,
    },
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

describe(`Update API Invalid asset uid`, async () => {
  test(`Invalid Asset Uid`, async() => {
    // const event = {};
    const uid = '479b418d-0c7e-4506-8c47-8c9af2800b7';
    const event = createEvent(uid);
    const context = createContext();
    const connection = '';

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined();
    expect(result.statusCode).not.toBeUndefined();
    expect(result.statusCode).toEqual(400);
    const { response, responseType } = result.body;
    expect(responseType).toEqual('Error');
    expect(response).toEqual('Provided asset identifier is invalid.');
      });
});