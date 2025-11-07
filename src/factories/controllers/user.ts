import { PasswordHasherAdapter } from "../../adapters/index.js";
import {
  CreateUserController,
  GetUserByIdController,
} from "../../controllers/index.js";
import {
  PostgresCreateUserRepository,
  PostgresEmailIsAlreadyInUseUserRepository,
  PostgresGetUserByIdRepository,
} from "../../repositories/postgres/index.js";
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
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
