import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import { createResponse } from "../../lib/response";


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const signature = event.headers["Stripe-Signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    const client_reference_id = stripeEvent.data.object.client_reference_id;
  } catch (err) {
    console.log(err)
    new Error("Bad Request");
    return createResponse("failed");
  }

  // 処理が成功した場合UserにIDを格納

  return createResponse(stripeEvent);
}