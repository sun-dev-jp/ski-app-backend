import { aws_apigateway as apigateway } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { UserHandlers } from '../lambda';

export interface UsersProps {
  api: apigateway.RestApi
  userHandlers: UserHandlers
  authorizer: apigateway.TokenAuthorizer
}

export class Users extends Construct {
  readonly authorizer: apigateway.TokenAuthorizer

  constructor(scope: Construct, id: string, props: UsersProps) {
    super(scope, id);

    const users = props.api.root.addResource("users");

    /** GET users */
    users.addMethod(
      "GET",
      new apigateway.LambdaIntegration(props.userHandlers.getUsers)
    );

    /** GET user/{id} */
    const user = users.addResource("{id}")
    user.addMethod(
      "GET",
      new apigateway.LambdaIntegration(props.userHandlers.getUser),
      {
        authorizer: props.authorizer
      }
    )

    
  }
}