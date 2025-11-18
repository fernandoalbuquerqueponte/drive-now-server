import type { CreateUserSchema } from "../schemas/user.js";

export type UserDTO = CreateUserSchema;

export type User = Omit<CreateUserSchema, "password">;

export interface ICreateUsersRepository {
  execute(params: User): Promise<User>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User | null>;
}

export interface IGetUserByIdRepository {
  execute(userId: string): Promise<User | null>;
}

export interface IDeleteUserRepository {
  execute(userId: string): Promise<User | null>;
}
