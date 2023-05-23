import { PrismaClient } from '@prisma/client';


// const prisma = new PrismaClient()
export const prisma = new PrismaClient({
  datasources: {
    db: {
      // hardcoded connection string for simplicity
      url: 'postgres://postgres:ayurrun6-5vts@db.axnnrxvahmfogpakoiyr.supabase.co:5432/postgres',
    },
  },
});

export const createUser = async (name: string) => {
  return prisma.user.create({
    data: {
      name,
    },
  });

  return name;
}

createUser("136")