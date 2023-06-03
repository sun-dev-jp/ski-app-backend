import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Lambda } from '../lambda';
import { Auth } from './auth';
import { Users } from './users';

export interface ApiProps {
  lambda: Lambda
}


export class Api extends Construct {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        statusCode: 200,
      },
    })

    api.addGatewayResponse('unauthorized-response', {
      type: apigateway.ResponseType.UNAUTHORIZED,
      statusCode: '401',
      responseHeaders: {
        'Access-Control-Allow-Origin' : "'*'",
        'Access-Control-Allow-Headers': "'*'"
      },
    });

    api.addGatewayResponse('access-denied-response', {
      type: apigateway.ResponseType.ACCESS_DENIED,
      statusCode: '403',
      responseHeaders: {
        'Access-Control-Allow-Origin' : "'*'",
        'Access-Control-Allow-Headers': "'*'"
      },
    });

    const auth = new Auth(this, 'Auth', {
      handler: props.lambda.authorizer
    });
    
    new Users(this, 'Users', {
      api,
      userHandlers: props.lambda.users,
      authorizer: auth.authorizer
    });
  }
}