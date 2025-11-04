import prismaClient from "../../../../prisma/prisma.js";
import type { IGetUserByIdRepository } from "../../../types/user.js";

export class PostgresGetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string) {
    const response = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        imageUrl: true,
        created_at: true,
        updated_at: true,
      },
    });

    return response;
  }
}
