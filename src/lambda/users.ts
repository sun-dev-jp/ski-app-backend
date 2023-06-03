import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from 'aws-sdk';
import { createResponse } from "../lib/response";
import supabase from "../lib/supabase/client";

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

  const s3 = new AWS.S3();
  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: 'test.txt',
  };
  const res = await s3.getObject(params).promise();
  

  // return createResponse(USERS)
  // return createResponse(await selectUsers())
  return createResponse(res.Body?.toString());
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


/** POST /users */
export const postUser: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))

  const principalId = event.requestContext.authorizer?.principalId;

  // supabaseからuser_idで取得

  // 存在しない場合作成

  // 存在した場合更新
  
  return createResponse(event.body);
}

/** POST /users */
// export const putUser: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
//   console.log("pathParameters = " + JSON.stringify(event.pathParameters, undefined, 2))
  
//   return createResponse(event.body);
// }

