import { UserNotFoundError } from "../../errors/user.js";
import type { IGetUserByIdRepository } from "../../types/user.js";

export class GetUserByIdUseCase {
  constructor(private getUserByIdRepository: IGetUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async execute(userId: string) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
