import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Lambda } from '../lambda';
import { Auth } from './auth';
import { Users } from './users';
import { GatewayResponse } from './gateway-response';

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

    new GatewayResponse(this, "GatewayResponse", { api });

    const auth = new Auth(this, 'Auth', {
      handler: props.lambda.authorizer
    });
    
    new Users(this, 'Users', {
      api,
      userHandlers: props.lambda.users,
      authorizer: auth.authorizer
    });

    const checkout = api.root.addResource("checkout");
    checkout.addMethod(
      "GET",
      new apigateway.LambdaIntegration(props.lambda.payment.checkout)
    );

    const webhook = api.root.addResource("webhook");
    webhook.addMethod(
      "POST",
      new apigateway.LambdaIntegration(props.lambda.payment.webhook)
    );

  }
}