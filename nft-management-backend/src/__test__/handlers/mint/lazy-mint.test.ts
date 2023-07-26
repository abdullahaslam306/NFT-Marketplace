const { handler } = require('../../../handlers/mint/lazy-mint');

describe('Lazy mint NFT', () => {
    test('Lazy mint ERC721 NFT and returns a signature.', async () => {
        const pathParametersObject = {
            nftUid: 'cb484627-f436-48cf-990f-92ca35d86217'
        }

        const context = {} as AWSLambda.Context;
        const event = {} as AWSLambda.APIGatewayEvent;
        const pathParams = pathParametersObject as AWSLambda.APIGatewayProxyEventPathParameters;

        event.body = JSON.parse(`{
            "tokenId":1,
            "userId": "177",
            "editions":1
        }`);
        const result = await handler(event, context);
        expect(typeof (result)).toBe('String');
    });
});