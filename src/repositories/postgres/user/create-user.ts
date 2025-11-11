import prismaClient from "../../../../prisma/prisma.js";

import type { CreateUserSchema } from "../../../schemas/user.js";
import type { ICreateUsersRepository } from "../../../types/user.js";

export class PostgresCreateUserRepository implements ICreateUsersRepository {
  async execute(params: CreateUserSchema) {
    const user = await prismaClient.user.create({
      data: {
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        imageUrl: params.imageUrl ?? null,
        password: params.password,
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

    return user;
  }
}
