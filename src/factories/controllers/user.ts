import { IdGeneratorAdapter } from "../../adapters/id-generator.js";
import { PasswordHasherAdapter } from "../../adapters/index.js";
import { PasswordComparatorAdapter } from "../../adapters/password-comparator.js";
import { TokenVerifierAdapter } from "../../adapters/token-verifier.js";
import { TokensGeneratorAdapter } from "../../adapters/tokens-generator.js";
import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from "../../controllers/index.js";
import { LoginUserController } from "../../controllers/user/login-user.js";
import { RefreshTokenController } from "../../controllers/user/refresh-token.js";
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
import { LoginUserUseCase } from "../../use-cases/user/login-user.js";
import { RefreshTokenUseCase } from "../../use-cases/user/refresh-token.js";

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository =
    new PostgresEmailIsAlreadyInUseUserRepository();

  const passwordHasherAdapter = new PasswordHasherAdapter();

  const tokensGeneratorAdapter = new TokensGeneratorAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();

  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    getUserByEmailRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
    tokensGeneratorAdapter,
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
    passwordHasherAdapter,
  );

  const updateUserController = new UpdateUserController(updateUserUseCase);

  return updateUserController;
};

export const makeLoginUserController = () => {
  const getUserByEmailRepository =
    new PostgresEmailIsAlreadyInUseUserRepository();
  const passwordComparatorAdapter = new PasswordComparatorAdapter();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();

  const loginUserUseCase = new LoginUserUseCase(
    getUserByEmailRepository,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  );

  const loginUserController = new LoginUserController(loginUserUseCase);

  return loginUserController;
};

export const makeRefreshTokenController = () => {
  const tokenGeneratorAdapter = new TokensGeneratorAdapter();
  const tokenVerifierAdapter = new TokenVerifierAdapter();
  const refreshTokenUseCase = new RefreshTokenUseCase(
    tokenGeneratorAdapter,
    tokenVerifierAdapter,
  );

  const refreshTokenController = new RefreshTokenController(
    refreshTokenUseCase,
  );

  return refreshTokenController;
};
