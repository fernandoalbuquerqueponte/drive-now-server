import type { IDeleteUserRepository } from "../../../types/user.js";
import { DeleteUserUseCase } from "../../../use-cases/index.js";
import { user } from "../../fixtures/user.js";

describe("DeleteUserUseCase", () => {
  class DeleteUserRepositoryStub implements IDeleteUserRepository {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub();
    const sut = new DeleteUserUseCase(deleteUserRepository);

    return {
      sut,
      deleteUserRepository,
    };
  };

  it("should delete a user", async () => {
    const { sut } = makeSut();

    const deletedUser = await sut.execute(user.id);

    expect(deletedUser).toBeTruthy();
    expect(deletedUser).toEqual(user);
  });

  it("should call deleteUserRepository with correct params", async () => {
    const { sut, deleteUserRepository } = makeSut();

    const deleteUserRepositorySpy = jest.spyOn(deleteUserRepository, "execute");
    deleteUserRepositorySpy.mockResolvedValue(user);

    await sut.execute(user.id);

    expect(deleteUserRepositorySpy).toHaveBeenCalledWith(user.id);
  });
});
