import {
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Construct } from "constructs";

export interface AuthProps {}


export class Auth extends Construct {

  readonly authHandler: lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props?: AuthProps) {
    super(scope, id);

    /** Auth */
    const authHandler = new lambda_nodejs.NodejsFunction(this, "Lambda_Authorizer_Function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "Lambda_Authorizer_Function",
      entry: 'src/lambda/lambda-authorizer.ts',
      environment: {
        AUDIENCE: process.env.AUDIENCE!,
        JWKS_URI: process.env.JWKS_URI!,
        TOKEN_ISSUER: process.env.TOKEN_ISSUER!
      },
    });
    this.authHandler = authHandler
  }
}