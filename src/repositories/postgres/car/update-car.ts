import prismaClient from "../../../../prisma/prisma.js";
import type { Car, Prisma } from "@prisma/client";
import type { IPostgresUpdateCarRepository } from "../../../types/car.js";

export class PostgresUpdateCarRepository implements IPostgresUpdateCarRepository {
  async execute(carId: string, data: Prisma.CarUpdateInput): Promise<Car> {
    const deletedCar = await prismaClient.car.update({
      where: {
        id: carId,
      },
      data,
    });

    return deletedCar;
  }
}
