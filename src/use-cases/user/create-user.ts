import bcrypt from "bcrypt";
import type {
  IGetUserByEmailRepository,
  IUsersRepository,
} from "../../types/user.ts";

import { v4 as uuidv4 } from "uuid";

interface CreateUserUseCaseType {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class CreateUserUseCase {
  constructor(
    private createUserRepository: IUsersRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
  }

  async execute(params: CreateUserUseCaseType) {
    const emailIsAlreadyInUse = await this.getUserByEmailRepository.execute(
      params.email
    );

    if (emailIsAlreadyInUse) {
      throw new Error("Email já está em uso");
    }

    const hashedPassword = bcrypt.hash(params.password, 10);
    const userId = uuidv4();

    const user = {
      ...params,
      id: userId,
      password: await hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return createdUser;
  }
}
