import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Lambda } from '../lambda';
import { Auth } from './auth';
import { Users } from './users';

export interface ApiProps {
  lambda: Lambda
}


export class Api extends Construct {
  constructor(scope: Construct, id: string, props: ApiProps) {
    super(scope, id);

    const api = new apigateway.RestApi(this, "api")

    const auth = new Auth(this, 'Auth', {
      handler: props.lambda.authorizer
    });
    
    new Users(this, 'Users', {
      api,
      userHandlers: props.lambda.users,
      authorizer: auth.authorizer
    });

  }
}