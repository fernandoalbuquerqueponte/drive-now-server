import type { IGetUserByIdRepository } from "../../../types/user.js";
import { GetUserByIdUseCase } from "../../../use-cases/index.js";
import { user } from "../../fixtures/user.js";

describe("GetUserByIdUseCase", () => {
  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute() {
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
});
