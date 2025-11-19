import type { Prisma } from "@prisma/client";
import prismaClient from "../../../../prisma/prisma.js";
import type { IUpdateUserRepository, User } from "../../../types/user.js";

export class PostgresUpdateUserRepository implements IUpdateUserRepository {
  async execute(
    userId: string,
    params: Prisma.UserUpdateInput
  ): Promise<User | null> {
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: params,
    });

    return updatedUser;
  }
}
