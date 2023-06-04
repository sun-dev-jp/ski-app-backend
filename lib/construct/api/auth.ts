import { aws_apigateway as apigateway, aws_lambda_nodejs as lambda_nodejs } from 'aws-cdk-lib';
import { Construct } from "constructs";

export interface AuthProps {
  handler: lambda_nodejs.NodejsFunction
}


export class Auth extends Construct {
  readonly authorizer: apigateway.TokenAuthorizer

  constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id);

    this.authorizer = new apigateway.TokenAuthorizer(this, 'lambdaAuthorizer', {
      authorizerName: 'lambdaAuthorizer',
      handler: props.handler,
      identitySource: apigateway.IdentitySource.header('Authorization'), //アクセストークンを渡すためのヘッダーを指定
    });
    
  }
}