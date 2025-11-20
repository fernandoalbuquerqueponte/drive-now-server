import prismaClient from "../../../../prisma/prisma.js";
import type { IUpdateUserRepository } from "../../../types/user.js";
import type { UpdateUserSchema, User } from "../../../schemas/user.js";

export class PostgresUpdateUserRepository implements IUpdateUserRepository {
  async execute(
    userId: string,
    params: UpdateUserSchema
  ): Promise<User | null> {
    const data = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );

    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: data,
    });

    const { password, ...safeUser } = updatedUser;

    return safeUser;
  }
}
