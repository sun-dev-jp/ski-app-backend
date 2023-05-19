import { handler } from "../src/lambda/lambda-authorizer";
import { APIGatewayAuthorizerResult } from 'aws-lambda';
import * as dotenv from 'dotenv';

dotenv.config();

const event = {
  type: "TOKEN",
  authorizationToken: process.env.TEST_TOKEN
}

describe('Lambda_Authorizer_Function', (): void => {
  it.skip('response policy', async () => {

    const expected = {
      policyDocument: {
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: undefined,
          },
        ],
        Version: '2012-10-17',
      },
    };

    const result: APIGatewayAuthorizerResult = await handler(event as any);

    // principalIdを省く
    const { principalId, ...resultWithoutPrincipalId } = result; 

    expect(resultWithoutPrincipalId).toEqual(expected);

  });
});

