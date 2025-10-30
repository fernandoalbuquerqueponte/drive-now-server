import prismaClient from "../../../../prisma/prisma.js";
import type { CreateUserSchema } from "../../../schemas/user.js";
import type { ICreateUsersRepository } from "../../../types/user.js";

type CreateUserRepositoryParams = Omit<CreateUserSchema, "password"> & {
  hashedPassword: string;
};

export class PostgresCreateUserRepository implements ICreateUsersRepository {
  async execute(params: CreateUserRepositoryParams) {
    const user = await prismaClient.user.create({
      data: {
        first_name: params.first_name,
        last_name: params.last_name,
        email: params.email,
        imageUrl: params.imageUrl ?? null,
        password: params.hashedPassword,
      },
    });

    return user;
  }
}
