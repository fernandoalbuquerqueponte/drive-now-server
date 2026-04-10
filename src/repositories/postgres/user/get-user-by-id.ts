import prismaClient from "../../../../prisma/prisma.js";
import type { IGetUserByIdRepository } from "../../../types/user.js";

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    const response = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    return response;
  }
}
