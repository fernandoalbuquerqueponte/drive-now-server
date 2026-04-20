import prismaClient from "../../../../prisma/prisma.js";
import type { Car } from "@prisma/client";
import type { IPostgresUpdateCarRepository } from "../../../types/car.js";
import type { UpdateCarSchema } from "../../../schemas/car.js";

export class PostgresUpdateCarRepository implements IPostgresUpdateCarRepository {
  async execute(carId: string, data: UpdateCarSchema): Promise<Car> {
    const { gallery, ...rest } = data;
    const deletedCar = await prismaClient.car.update({
      where: {
        id: carId,
      },
      data: {
        ...rest,
        ...(gallery && {
          gallery: {
            set: gallery,
          },
        }),
      },
    });

    return deletedCar;
  }
}
