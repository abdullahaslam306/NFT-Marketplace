import { errors } from 'backend-utility';
import { mockDatabase } from '../../mock';
import { action } from '../../../handlers/asset/list';


describe(`List API for listing assets by name`, () => {
  test(`works OK if returns the matching assets`, async() => {
    const context = {} as AWSLambda.Context;
    const event = {} as AWSLambda.APIGatewayEvent;
    context['event'] = {
      requestContext: {
        authorizer: {
          user_id: 5,
        },
      },
    };
    event['queryStringParameters'] = {
     name: 'My Assets',
    };
    
    const connection = mockDatabase.openConnection();

    const result = await action(event, context, connection);
    expect(result).not.toBeUndefined();
    expect(result.statusCode).not.toBeUndefined();
    expect(result.statusCode).toEqual(200);
      });
   

  test(`works OK if cant find matching asset`, async() => {
        const context = {} as AWSLambda.Context;
        const event = {} as AWSLambda.APIGatewayEvent;
        context['event'] = {
          requestContext: {
            authorizer: {
              user_id: 5,
            },
          },
        };
        event['queryStringParameters'] = {
          name: 'Mmy Assets',
         };
        const connection = mockDatabase.openConnection();
    
        const result = await action(event, context, connection);
        expect(result).not.toBeUndefined();
        expect(result.statusCode).not.toBeUndefined();
        expect(result.statusCode).toEqual(404);
        const { response} = result.body;
        expect(response).toEqual('Assets not found.');
          });   
        }
    )
