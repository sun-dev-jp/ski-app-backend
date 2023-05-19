import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const create = async () => {
  const users = await prisma.user.create({
    data: {
      name: "あいうえお"
    }
  })

  return users;
}