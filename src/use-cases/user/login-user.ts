import type { PasswordComparatorAdapter } from "../../adapters/password-comparator.js";
import type { TokensGeneratorAdapter } from "../../adapters/tokens-generator.js";
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from "../../errors/user.js";
import type { IGetUserByEmailRepository } from "../../types/user.js";

export class LoginUserUseCase {
  constructor(
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private passwordComparatorAdapter: PasswordComparatorAdapter,
    private tokensGeneratorAdapter: TokensGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordComparatorAdapter = passwordComparatorAdapter;
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
  }

  async execute(email: string, password: string) {
    const user = await this.getUserByEmailRepository.execute(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const isPasswordValid = await this.passwordComparatorAdapter.execute(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    return {
      ...user,
      tokens: await this.tokensGeneratorAdapter.execute(user.id),
    };
  }
}
