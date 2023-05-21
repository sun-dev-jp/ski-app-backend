// import { PrismaClient } from "@prisma/client"
import { createUser } from '/opt/client';



// export const handler = async () => {
//   const user = await createUser('Alice');

//   return {
//     statusCode: 201,
//     body: JSON.stringify({ user }),
//   };
// };

// const prisma = new PrismaClient();

// export const getUser = async () => {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: 1
//     }
//   })

//   return user;
// }

export const getUsers = async () => {
  // const users = await prisma.user.findMany();
  const user = await createUser('Alice');

  return {
    statusCode: 201,
    body: JSON.stringify({ user }),
  };
}

// export const createUser = async () => {
//   const users = await prisma.user.create({
//     data: {
//       name: "あいうえお"
//     }
//   })

//   return users;
// }


