import {
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
  aws_s3 as s3
} from 'aws-cdk-lib';
import { Construct } from "constructs";

export type UsersProps = {
  bucket: s3.Bucket
}


export class Users extends Construct {

  readonly getUsers: lambda_nodejs.NodejsFunction
  readonly getUser: lambda_nodejs.NodejsFunction
  readonly postUser: lambda_nodejs.NodejsFunction

  constructor(scope: Construct, id: string, props: UsersProps) {
    super(scope, id);

    /** GET users */
    const getUsers = new lambda_nodejs.NodejsFunction(this, "getUsers", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "getUsers",
      entry: "src/lambda/users.ts",
      handler: "getUsers",
      environment: {
        SUPABASE_URL: process.env.SUPABASE_URL!,
        SUPABASE_API_KEY: process.env.SUPABASE_API_KEY!,
        BUCKET_NAME: props.bucket.bucketName
      },
    })
    this.getUsers = getUsers;
    props.bucket.grantReadWrite(getUsers);

    /** GET users/{id} */
    const getUser = new lambda_nodejs.NodejsFunction(this, "getUser", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "getUser",
      entry: "src/lambda/users.ts",
      handler: "getUser",
    })
    this.getUser = getUser;
    props.bucket.grantReadWrite(getUser);

    /** POST users */
    const postUser = new lambda_nodejs.NodejsFunction(this, "postUser", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "postUser",
      entry: "src/lambda/users.ts",
      handler: "postUser",
      environment: {
        SUPABASE_URL: process.env.SUPABASE_URL!,
        SUPABASE_API_KEY: process.env.SUPABASE_API_KEY!,
        BUCKET_NAME: props.bucket.bucketName
      },
    })
    this.postUser = postUser;
    props.bucket.grantReadWrite(postUser);

  }
}