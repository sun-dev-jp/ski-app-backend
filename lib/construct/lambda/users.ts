import {
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Construct } from "constructs";

export interface UsersProps {}


export class Users extends Construct {

  readonly getUsers: lambda_nodejs.NodejsFunction
  readonly getUser: lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props?: UsersProps) {
    super(scope, id);

    /** GET users */
    this.getUsers = new lambda_nodejs.NodejsFunction(this, "getUsers", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "getUsers",
      entry: "src/lambda/users.ts",
      handler: "getUsers",
      environment: {
        SUPABASE_URL: process.env.SUPABASE_URL!,
        SUPABASE_API_KEY: process.env.SUPABASE_API_KEY!,
      },
    })

    /** GET users/{id} */
    this.getUser = new lambda_nodejs.NodejsFunction(this, "getUser", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "getUser",
      entry: "src/lambda/users.ts",
      handler: "getUser",
    })

  }
}