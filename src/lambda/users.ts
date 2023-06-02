import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from "aws-lambda"
import supabase from "../lib/supabase/client"

const TABLE_NAME = 'User'

const USERS = [
  { id: "1", name: "田中" },
  { id: "2", title: "佐藤" },
  { id: "3", title: "山田" },
]


/** GET /users */
export const getUsers: APIGatewayProxyHandler = async (event) => {
  console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))

  const selectUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select();
    
    if (error) {
      throw error;
    }
    
    console.log(data)
    return data;
  }
  // await selectUsers();

  const insertUsers = async () => {
    const { error } = await supabase
      .from('users')
      .insert({ user_id: "hogehoge", })
    
    if (error) {
      throw error;
    }
  }
  // await insertUsers();

  const joinSelectUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, user_profiles (last_name)')
    
    if (error) {
      throw error;
    }

    console.log(data)
  }
  // await joinSelectUsers();
  

  // return createResponse(USERS)
  return createResponse(await selectUsers())
}

/** GET /users/{id} */
export const getUser: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))

  // ユーザーID
  const principalId = event.requestContext.authorizer?.principalId
  
  const id = event.pathParameters?.["id"]
  
  // return createResponse(USERS.find((b) => b.id === id))
  return createResponse(event)
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
