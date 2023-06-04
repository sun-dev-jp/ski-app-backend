import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { createResponse } from "../../lib/response";

// サブスクプランが複数ある場合、フロントからprice_idを受け取る


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))

  // user_idを取得
  // DBからUserを取得
  // 既に加入済みの場合エラーを返す

  // バリデーション
  // if (!event.body) {
  //   return createErrorResponse('Request body is missing.');
  // }
  // const requestData = JSON.parse(event.body);

  // プロパティの存在チェック
  // return createErrorResponse('Invalid request data. Required fields are missing.');
  // const { address, amount, plan, token } = requestData;

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      client_reference_id: "", // user_idを入れる
      success_url: `${process.env.CLIENT_HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_HOST}/?canceled=true`,
    })

    // エラーハンドリング
    return createResponse(session.url);
  } catch (err) {
    return createResponse(err);
  }
}
