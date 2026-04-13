import prismaClient from "./prisma/prisma.js";

beforeEach(async () => {
  await prismaClient.user.deleteMany({});
  await prismaClient.car.deleteMany({});
});
