import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
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

const getToken = (event: APIGatewayAuthorizerEvent) => {

   // イベントタイプの型ガード
  if (event.type !== 'TOKEN')
    throw new Error(`event.type parameter must have value TOKEN , but actual value is ${event.type}`);

  const token = event.authorizationToken;

  if (!token)
    throw new Error("event.authorizationToken parameter must be set, but got null");

  return token
};

const verifyToken = async(token: string): Promise<string | jwt.JwtPayload> => {
  const tokenWithoutBearer = token.replace("Bearer ", "");
  const decodedToken = jwt.decode(tokenWithoutBearer, { complete: true });

  if (!decodedToken || !decodedToken.header || !decodedToken.header.kid)
    throw new jwt.JsonWebTokenError('invalid token');

  const client = new jwks.JwksClient({
    cache: true,
    cacheMaxAge:ms('1h') ,
    jwksUri: process.env.JWKS_URI as string,
  });

  try {
    const getSigningKey = util.promisify(client.getSigningKey); // promise関数化
    const key = await getSigningKey(decodedToken.header.kid); // kidを元にjwksからキー情報を取得
    const signingKey = (key as jwks.CertSigningKey).publicKey || (key as jwks.RsaSigningKey).rsaPublicKey; // 公開鍵を取得

    // 検証（署名・有効期限）してペイロードを取得
    // オプション： 発行元（Issuer）、受信者（Audience）
    const tokenInfo = jwt.verify(tokenWithoutBearer, signingKey, {
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
const generatePolicy = (principal: string, effect: 'Allow' | 'Deny', resource: string): APIGatewayAuthorizerResult =>{
  return {
    principalId: principal,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}
