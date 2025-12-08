import { PasswordHasherAdapter } from "../../adapters/index.js";
import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from "../../controllers/index.js";
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresEmailIsAlreadyInUseUserRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateUserRepository,
} from "../../repositories/postgres/index.js";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../../use-cases/index.js";

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository =
    new PostgresEmailIsAlreadyInUseUserRepository();

  const passwordHasherAdapter = new PasswordHasherAdapter();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    passwordHasherAdapter
  );
  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

  return getUserByIdController;
};

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserUseCase);

  return deleteUserController;
};

export const makeUpdateUserController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository();

  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByEmailRepository =
    new PostgresEmailIsAlreadyInUseUserRepository();
  const passwordHasherAdapter = new PasswordHasherAdapter();

  const updateUserUseCase = new UpdateUserUseCase(
    updateUserRepository,
    getUserByIdRepository,
    getUserByEmailRepository,
    passwordHasherAdapter
  );

  const updateUserController = new UpdateUserController(updateUserUseCase);

  return updateUserController;
};
