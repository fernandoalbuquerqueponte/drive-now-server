import prismaClient from "../../../../prisma/prisma.js";
import type { IPostgresGetCarByIdRepository } from "../../../types/car.js";

export class PostgresGetCarByIdRepository
  implements IPostgresGetCarByIdRepository
{
  async execute(carId: string) {
    const car = await prismaClient.car.findUnique({
      where: {
        id: carId,
      },
    });

    return car ?? undefined;
  }
}
