import prismaClient from "../../../../prisma/prisma.js";
import type { CreateCarSchema } from "../../../schemas/car.js";
import type { ICreateCarRepository } from "../../../types/car.js";

export class PostgresCreateCarRepository implements ICreateCarRepository {
  async execute(params: CreateCarSchema) {
    const { images, ...rest } = params;
    const createdCar = await prismaClient.car.create({
      data: {
        ...rest,
        ...(images && {
          images: { create: images },
        }),
      },
    });

    return createdCar;
  }
}
