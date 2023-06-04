import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from "constructs";

export interface GatewayResponseProps {
  api: apigateway.RestApi
}

export class GatewayResponse extends Construct {

  constructor(scope: Construct, id: string, props: GatewayResponseProps) {
    super(scope, id);

    props.api.addGatewayResponse('unauthorized-response', {
      type: apigateway.ResponseType.UNAUTHORIZED,
      statusCode: '401',
      responseHeaders: {
        'Access-Control-Allow-Origin' : "'*'",
        'Access-Control-Allow-Headers': "'*'"
      },
    });

    props.api.addGatewayResponse('access-denied-response', {
      type: apigateway.ResponseType.ACCESS_DENIED,
      statusCode: '403',
      responseHeaders: {
        'Access-Control-Allow-Origin' : "'*'",
        'Access-Control-Allow-Headers': "'*'"
      },
    });
  }
}