import { aws_lambda_nodejs as lambda_nodejs } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Auth } from './auth';
import { Users } from './users';

export interface LambdaProps {}


export class Lambda extends Construct {

  readonly authHandler: lambda_nodejs.NodejsFunction
  readonly getUsersHandler: lambda_nodejs.NodejsFunction
  readonly getUserHandler: lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props?: LambdaProps) {
    super(scope, id);

    this.authHandler = new Auth(this, "Auth").authHandler

    const users = new Users(this, "Users")
    this.getUsersHandler = users.getUsersHandler
    this.getUserHandler = users.getUserHandler 

  }
}