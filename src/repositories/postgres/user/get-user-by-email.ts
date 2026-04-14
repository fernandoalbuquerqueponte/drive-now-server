import prismaClient from "../../../../prisma/prisma.js";
import type { IGetUserByEmailRepository } from "../../../types/user.js";

export class PostgresEmailIsAlreadyInUseUserRepository implements IGetUserByEmailRepository {
  async execute(email: string) {
    const response = await prismaClient.user.findFirst({
      where: { email },
    });

    if (!response) {
      return null;
    }

    return response;
  }
}
