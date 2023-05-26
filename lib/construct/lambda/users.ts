import {
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Construct } from "constructs";

export interface UsersProps {}


export class Users extends Construct {

  readonly getUsersHandler: lambda_nodejs.NodejsFunction
  readonly getUserHandler: lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props?: UsersProps) {
    super(scope, id);

    /** GET users */
    const getUsersHandler = new lambda_nodejs.NodejsFunction(this, "getUsers", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "getUsers",
      entry: "src/lambda/users.ts",
      handler: "getUsers"
    })
    this.getUsersHandler = getUsersHandler

    /** GET users/{id} */
    const getUserHandler = new lambda_nodejs.NodejsFunction(this, "getUser", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "getUser",
      entry: "src/lambda/users.ts",
      handler: "getUser",
    })
    this.getUserHandler = getUserHandler

  }
}