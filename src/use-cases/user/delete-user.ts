import type { IDeleteUserRepository } from "../../types/user.js";

export class DeleteUserUseCase {
  constructor(private deleteUserRepository: IDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository;
  }
  async execute(userId: string) {
    const deletedUser = await this.deleteUserRepository.execute(userId);

    return deletedUser;
  }
}
