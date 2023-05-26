import { 
  Stack, 
  StackProps,
  aws_apigateway as apigateway,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Lambda } from './construct/lambda';
import * as dotenv from 'dotenv';

dotenv.config();

export class SkiAppBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new Lambda(this, 'Lambda');

    const api = new apigateway.RestApi(this, "api")

    // ------------------------------
    // Lambda Authorizer
    // ------------------------------
    const lambdaAuth = new apigateway.TokenAuthorizer(this, 'lambdaAuthorizer', {
      authorizerName: 'lambdaAuthorizer',
      handler: lambda.authHandler,
      identitySource: apigateway.IdentitySource.header('Authorization'), //アクセストークンを渡すためのヘッダーを指定
    });

    // ------------------------------
    // Lambda プロキシ統合
    // ------------------------------
    const users = api.root.addResource("users")

    /** (GET users */
    users.addMethod("GET", new apigateway.LambdaIntegration(lambda.getUsersHandler));
    

    /** (GET user/{id}) */
    const user = users.addResource("{id}")
    user.addMethod("GET", new apigateway.LambdaIntegration(lambda.getUserHandler), {
      authorizer: lambdaAuth
    })

  }
}
