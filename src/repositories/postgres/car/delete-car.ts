import prismaClient from "../../../../prisma/prisma.js";
import type { IPostgresDeleteCarRepository } from "../../../types/car.js";

export class PostgresDeleteCarRepository
  implements IPostgresDeleteCarRepository
{
  async execute(carId: string) {
    const deletedCar = await prismaClient.car.delete({
      where: {
        id: carId,
      },
    });

    return deletedCar;
  }
}
