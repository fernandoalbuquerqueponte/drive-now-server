import type { User } from "../../../schemas/user.js";
import type { IGetUserByIdRepository } from "../../../types/user.js";
import { GetUserByIdUseCase } from "../../../use-cases/index.js";
import { user } from "../../fixtures/user.js";

describe("GetUserByIdUseCase", () => {
  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(): Promise<User | null> {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();

    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return {
      sut,
      getUserByIdRepository,
    };
  };

  it("should return a user when a valid id is provided", () => {
    const { sut } = makeSut();

    const fetchedUser = sut.execute(user.id);

    expect(fetchedUser).resolves.toBeTruthy();
    expect(fetchedUser).resolves.toEqual(user);
  });

  it("should throw if user is not found", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValue(null);

    const fetchedUser = sut.execute(user.id);

    await expect(fetchedUser).rejects.toThrow();
  });
});
