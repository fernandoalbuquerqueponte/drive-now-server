import { PasswordHasherAdapter } from "../../adapters/password-hasher.js";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../../errors/user.js";
import type { UpdateUserSchema } from "../../schemas/user.js";
import type {
  IGetUserByEmailRepository,
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from "../../types/user.js";

export class UpdateUserUseCase {
  constructor(
    private updateUserRepository: IUpdateUserRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private passwordHasherAdapter: PasswordHasherAdapter,
  ) {
    this.getUserByIdRepository = getUserByIdRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.updateUserRepository = updateUserRepository;
  }
  async execute(userId: string, params: UpdateUserSchema) {
    //verificar se o user existe
    const userExists = await this.getUserByIdRepository.execute(userId);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    //verificar se o email ja esta em uso
    if (params.email) {
      const hasUserWithEmail = await this.getUserByEmailRepository.execute(
        params.email,
      );

      if (hasUserWithEmail && hasUserWithEmail.id !== userId) {
        throw new UserAlreadyExistsError(params.email);
      }
    }

    //senha for passada, hashear a nova senha
    if (params.password) {
      params.password = await this.passwordHasherAdapter.execute(
        params.password,
      );
    }

    //atualizar o user
    const updatedUser = await this.updateUserRepository.execute(userId, params);

    return updatedUser;
  }
}
