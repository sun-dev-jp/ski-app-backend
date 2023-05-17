import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda"

const USERS = [
  { id: "1", name: "田中" },
  { id: "2", title: "佐藤" },
  { id: "3", title: "山田" },
]

/** GET /users */
export const getUsers: APIGatewayProxyHandler = async (event) => {
  console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))

  return createResponse(USERS)
}

/** GET /users/{id} */
export const getUser: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))
  
  const id = event.pathParameters?.["id"]
  
  return createResponse(USERS.find((b) => b.id === id))
}

/** レスポンスデータを生成する */
function createResponse(body: any): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
    }, 
  }
}