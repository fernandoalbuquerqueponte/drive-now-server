import type { CreateUserSchema } from "../schemas/user.js";

export type UserDTO = Omit<CreateUserSchema, "password"> & {
  hashedPassword: string;
};

export type User = Omit<CreateUserSchema, "password"> & {
  id: string;
};

export interface ICreateUsersRepository {
  execute(params: UserDTO): Promise<User>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<User | null>;
}
