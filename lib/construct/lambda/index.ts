import { aws_lambda_nodejs as lambda_nodejs, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Auth } from './auth';
import { Users } from './users';

export type LambdaProps = {
  bucket: s3.Bucket
}

export type UserHandlers = {
  getUsers: lambda_nodejs.NodejsFunction
  getUser: lambda_nodejs.NodejsFunction
  postUser: lambda_nodejs.NodejsFunction
}


export class Lambda extends Construct {

  readonly authorizer: lambda_nodejs.NodejsFunction
  readonly users: UserHandlers

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const auth = new Auth(this, "Auth")
    this.authorizer = auth.authorizer

    const users = new Users(this, "Users", { bucket: props.bucket })
    this.users = {
      getUsers: users.getUsers,
      getUser: users.getUser,
      postUser: users.postUser
    };

  }
}