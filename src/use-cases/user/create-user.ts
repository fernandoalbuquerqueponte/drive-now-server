import type {
  IGetUserByEmailRepository,
  ICreateUsersRepository,
} from "../../types/user.ts";

import type { CreateUserSchema } from "../../schemas/user.js";
import { UserAlreadyExistsError } from "../../errors/user.js";
import type { PasswordHasherAdapter } from "../../adapters/password-hasher.js";
import type { TokensGeneratorAdapter } from "../../adapters/tokens-generator.js";
import type { IdGeneratorAdapter } from "../../adapters/id-generator.js";

export class CreateUserUseCase {
  constructor(
    private createUserRepository: ICreateUsersRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private passwordHasherAdapter: PasswordHasherAdapter,
    private idGeneratorAdapter: IdGeneratorAdapter,
    private tokensGeneratorAdapter: TokensGeneratorAdapter,
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(params: CreateUserSchema) {
    const emailIsAlreadyInUse = await this.getUserByEmailRepository.execute(
      params.email,
    );

    if (emailIsAlreadyInUse) {
      throw new UserAlreadyExistsError(params.email);
    }

    const hashedPassword = await this.passwordHasherAdapter.execute(
      params.password,
    );

    const userId = this.idGeneratorAdapter.execute();

    const userParams = {
      id: userId,
      first_name: params.first_name,
      last_name: params.last_name,
      imageUrl: params.imageUrl,
      email: params.email,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(userParams);

    return {
      ...createdUser,
      tokens: this.tokensGeneratorAdapter.execute(userId),
    };
  }
}
