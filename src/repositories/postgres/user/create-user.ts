import prismaClient from "../../../../prisma/prisma.js";

interface CreateUserType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class PostgresCreateUserRepository {
  async execute(params: CreateUserType) {
    const user = await prismaClient.user.create({
      data: params,
    });

    return user;
  }
}
