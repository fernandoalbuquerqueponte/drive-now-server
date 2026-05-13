import prismaClient from "../../../../prisma/prisma.js";
import type { IUpdateUserRepository } from "../../../types/user.js";
import type { UpdateUserSchema } from "../../../schemas/user.js";
import { Prisma } from "@prisma/client";

export class PostgresUpdateUserRepository implements IUpdateUserRepository {
  async execute(userId: string, params: UpdateUserSchema) {
    try {
      const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: params,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          imageUrl: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return null;
        }
      }
      throw error;
    }
  }
}
