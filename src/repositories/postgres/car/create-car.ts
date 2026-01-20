import prismaClient from "../../../../prisma/prisma.js";
import type { CreateCarSchema } from "../../../schemas/car.js";
import type { ICreateCarRepository } from "../../../types/car.js";

export class PostgresCreateCarRepository implements ICreateCarRepository {
  async execute(params: CreateCarSchema, userId: string) {
    const { gallery, ...rest } = params;
    const createdCar = await prismaClient.car.create({
      data: {
        ...rest,
        user_id: userId,
        ...(gallery && {
          gallery: {
            set: gallery,
          },
        }),
      },
    });

    return createdCar;
  }
}
