import { 
  Stack, 
  StackProps,
  aws_apigateway as apigateway,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export class SkiAppBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const prismaLayer = new lambda.LayerVersion(this, 'PrismaLayer', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_16_X],
      description: 'Prisma Layer',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src/lambda/layers/prisma'), {
        bundling: {
          image: lambda.Runtime.NODEJS_16_X.bundlingImage,
          command: [
            'bash',
            '-c',
            [
              'npx prisma generate',
              'mkdir -p /asset-output/nodejs',
              'cp package.json package-lock.json client.js .env /asset-output/nodejs',
              'cp -r prisma /asset-output/nodejs/prisma',
              'cp -r node_modules /asset-output/nodejs/node_modules',
              'rm -rf /asset-output/nodejs/node_modules/.cache',
              'rm -rf /asset-output/node_modules/@prisma/engines/node_modules',
              'rm -rf /asset-output/nodejs/node_modules/.prisma/client/*darwin* || true',
              'rm -r /asset-output/nodejs/node_modules/@prisma/engines/*darwin* || true',
              'rm -f /asset-output/nodejs/node_modules/prisma/*darwin* || true',
              'mkdir -p /asset-output/nodejs/var/task',
              'cp -r prisma/schema.prisma /asset-output/nodejs/var/task',
            ].join(' && '),
          ],
          user: 'root',
        },
      }),
      layerVersionName: `prisma-layer`,
    });

    // ------------------------------
    // Lambda_Authorizer_Function
    // ------------------------------
    const lambdaAuthorizerFunc = new lambda_nodejs.NodejsFunction(this, "Lambda_Authorizer_Function", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "Lambda_Authorizer_Function",
      entry: 'src/lambda/lambda-authorizer.ts',
      environment: {
        AUDIENCE: process.env.AUDIENCE!,
        JWKS_URI: process.env.JWKS_URI!,
        TOKEN_ISSUER: process.env.TOKEN_ISSUER!
      },
    });

    /** GET users */
    const getUsers = new lambda_nodejs.NodejsFunction(this, "getUsers", {
      runtime: lambda.Runtime.NODEJS_16_X,
      functionName: "getUsers",
      entry: "src/lambda/users.ts",
      handler: "getUsers",
      layers: [prismaLayer],
    })

    /** GET users/{id} */
    const getUser = new lambda_nodejs.NodejsFunction(this, "getUser", {
      runtime: lambda.Runtime.NODEJS_18_X,
      functionName: "getUser",
      entry: "src/lambda/users.ts",
      handler: "getUser",
    })

    const api = new apigateway.RestApi(this, "api")

    // ------------------------------
    // Lambda Authorizer
    // ------------------------------
    const lambdaAuth = new apigateway.TokenAuthorizer(this, 'lambdaAuthorizer', {
      authorizerName: 'lambdaAuthorizer',
      handler: lambdaAuthorizerFunc,
      identitySource: apigateway.IdentitySource.header('Authorization'), //アクセストークンを渡すためのヘッダーを指定
    });

    // ------------------------------
    // Lambda プロキシ統合
    // ------------------------------
    const users = api.root.addResource("users")

    /** (GET users */
    users.addMethod("GET", new apigateway.LambdaIntegration(getUsers));
    

    /** (GET user/{id}) */
    const user = users.addResource("{id}")
    user.addMethod("GET", new apigateway.LambdaIntegration(getUser), {
      authorizer: lambdaAuth
    })

  }
}
