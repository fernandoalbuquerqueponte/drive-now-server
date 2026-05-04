import prismaClient from "../../../../prisma/prisma.js";

export class GetCarRepository {
  async execute() {
    const cars = await prismaClient.car.findMany({
      include: {
        specifications: true,
        reviews: true,
      },
    });

    return cars;
  }
}
