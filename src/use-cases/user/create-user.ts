import bcrypt from "bcrypt";
import type {
  IGetUserByEmailRepository,
  ICreateUsersRepository,
} from "../../types/user.ts";

import type { CreateUserSchema } from "../../schemas/user.js";
import { UserAlreadyExistsError } from "../../errors/user.js";

export class CreateUserUseCase {
  constructor(
    private createUserRepository: ICreateUsersRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
  }

  async execute(params: CreateUserSchema) {
    const emailIsAlreadyInUse = await this.getUserByEmailRepository.execute(
      params.email
    );

    if (emailIsAlreadyInUse) {
      throw new UserAlreadyExistsError(params.email);
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);

    const userParams = {
      first_name: params.first_name,
      last_name: params.last_name,
      imageUrl: params.imageUrl,
      email: params.email,
      hashedPassword: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(userParams);

    return createdUser;
  }
}
