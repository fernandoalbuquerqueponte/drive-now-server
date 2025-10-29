import type { User } from "@prisma/client";

export interface IUsersRepository {
  execute(params: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<User>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User | null>;
}

export interface ICreateUserUseCase {
  execute(params: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<User>;
}
