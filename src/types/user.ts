import type { CreateUserSchema } from "../schemas/user.js";

export type UserDTO = Omit<CreateUserSchema, "password"> & {
  password_hash: string;
};

export type User = Omit<CreateUserSchema, "password"> & {
  id: string;
};

export interface IUsersRepository {
  execute(params: UserDTO): Promise<User>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User | null>;
}

export interface ICreateUserUseCase {
  execute(params: UserDTO): Promise<User>;
}
