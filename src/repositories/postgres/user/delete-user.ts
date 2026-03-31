import prismaClient from "../../../../prisma/prisma.js";
import type { IDeleteUserRepository } from "../../../types/user.js";

export class PostgresDeleteUserRepository implements IDeleteUserRepository {
  async execute(userId: string) {
    try {
      const deletedUser = await prismaClient.user.delete({
        where: { id: userId },
      });

      return deletedUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
