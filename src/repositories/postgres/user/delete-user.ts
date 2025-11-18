import prismaClient from "../../../../prisma/prisma.js";
import type { IDeleteUserRepository } from "../../../types/user.js";

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
  async execute(userId: string) {
    const deletedUser = await prismaClient.user.delete({
      where: { id: userId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        imageUrl: true,
      },
    });

    return deletedUser;
  }
}
