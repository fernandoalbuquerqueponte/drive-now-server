import prismaClient from "./prisma/prisma.js";

beforeEach(async () => {
  await prismaClient.car.deleteMany({});
  await prismaClient.user.deleteMany({});
});
