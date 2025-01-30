import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  console.log('New prisma client created');
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env['NODE_ENV'] !== 'production') globalThis.prismaGlobal = prisma;
