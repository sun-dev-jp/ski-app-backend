import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';
import * as jwks from 'jwks-rsa';
import * as util from 'util';
import ms = require('ms');

export const handler = async ( event: APIGatewayAuthorizerEvent ): Promise<APIGatewayAuthorizerResult> => {
  console.log('event', JSON.stringify(event, undefined, 2));

  try {
    const token = getToken(event);
    const res = await verifyToken(token);
    return generatePolicy(res.sub as string, 'Allow', event.methodArn); //methodARNにリクエストのメソッドとリソースパスが入っている
  } catch (error) {
    console.log(error);
    return generatePolicy(" ", 'Deny', event.methodArn);
  }
};

// event内のアクセストークンを取得
const getToken = (event: APIGatewayAuthorizerEvent) => { // event内のアクセストークンを取得
  if (event.type !== 'TOKEN') // イベントタイプチェック
    throw new Error(`event.type parameter must have value TOKEN , but actual value is ${event.type}`);

  const token = event.authorizationToken;

  if (!token) // トークンの存在チェック
    throw new Error("event.authorizationToken parameter must be set, but got null");

  return token
};

// アクセストークンの検証
const verifyToken = async(token: string): Promise<string | jwt.JwtPayload> => {
  // jwt形式のアクセストークンをデコード
  const decodedToken = jwt.decode(token, { complete: true });
  if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
    throw new jwt.JsonWebTokenError('invalid token');
  }

  const client = new jwks.JwksClient({
    cache: true,
    cacheMaxAge:ms('1h') ,
    jwksUri: process.env.JWKS_URI as string,
  });

  try {
    const getSigningKey = util.promisify(client.getSigningKey);
    const key = await getSigningKey(decodedToken.header.kid);
    const signingKey =
      (key as jwks.CertSigningKey).publicKey ||
      (key as jwks.RsaSigningKey).rsaPublicKey;
    const tokenInfo = jwt.verify(token, signingKey, {
      audience: process.env.AUDIENCE,
      issuer: process.env.TOKEN_ISSUER,
    });
    return tokenInfo;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error('token expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new Error('token is invalid');
    }
    throw err;
  }
}

// 認可ポリシーの生成
const generatePolicy = (
  principal: string,
  effect: 'Allow' | 'Deny',
  resource: string,
): APIGatewayAuthorizerResult =>{
  return {
    principalId: principal,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke', // API Gateway にデプロイした API を呼び出しするアクション
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}


