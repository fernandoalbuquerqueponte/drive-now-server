import type {
  CreateUserSchema,
  UpdateUserSchema,
  User as UserSchema,
} from "../schemas/user.js";

export type UserDTO = CreateUserSchema;

export type User = Omit<CreateUserSchema, "password">;

export interface ICreateUsersRepository {
  execute(params: CreateUserSchema): Promise<CreateUserSchema>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<UserSchema | null>;
}

export interface IGetUserByIdRepository {
  execute(userId: string): Promise<User | null>;
}

export interface IDeleteUserRepository {
  execute(userId: string): Promise<UserSchema | null>;
}

export interface IUpdateUserRepository {
  execute(userId: string, params: UpdateUserSchema): Promise<User | null>;
}
