import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prismaClient from "../../../../prisma/prisma.js";
import type { IPostgresDeleteCarRepository } from "../../../types/car.js";
import { CarNotFoundError } from "../../../errors/car.js";

export class PostgresDeleteCarRepository
  implements IPostgresDeleteCarRepository
{
  async execute(carId: string) {
    try {
      const deletedCar = await prismaClient.car.delete({
        where: {
          id: carId,
        },
      });

      return deletedCar;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        const code = error.code;

        // p2025 = "An operation failed because it depends on one or more records that were required but not found. {cause}"
        if (code === "P2025") {
          throw new CarNotFoundError();
        }
      }
      throw error;
    }
  }
}
