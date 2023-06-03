import { APIGatewayProxyResult } from "aws-lambda"

export const createResponse = (body: any): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
    }, 
  }
}