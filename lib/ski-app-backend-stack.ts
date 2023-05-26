import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Lambda } from './construct/lambda';
import { Api } from './construct/api';
import * as dotenv from 'dotenv';

dotenv.config();

export class SkiAppBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new Lambda(this, 'Lambda');

    new Api(this, 'Api', { lambda });
  }
}
