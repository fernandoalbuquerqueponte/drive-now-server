import type { IGetUserByEmailRepository } from "../../../types/user.js";
import { CreateUserUseCase } from "../../../use-cases/index.js";
import { user as fixturedUser } from "../../fixtures/user.js";

describe("CreateUserUseCase", () => {
  const user = {
    ...fixturedUser,
    id: undefined,
  };

  class CreateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(): Promise<any> {
      return null;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return "any_hashed_password";
    }
  }

  const makeSut = () => {
    const createUserRepository = new CreateUserRepositoryStub();
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();

    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
    );

    return {
      sut,
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
    };
  };

  it("should create an user successfully", async () => {
    const { sut } = makeSut();

    const createdUser = await sut.execute(user);

    expect(createdUser).toBeTruthy();
    expect(createdUser).toEqual(user);
  });

  it("should call CreateUserRepository with correct params ", async () => {
    const { sut, createUserRepository } = makeSut();

    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    await sut.execute(user);

    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: "any_hashed_password",
    });
  });

  it("should call GetUserByEmailRepository with correct params", async () => {
    const { sut, getUserByEmailRepository } = makeSut();

    jest.spyOn(getUserByEmailRepository, "execute");

    await sut.execute(user);

    expect(getUserByEmailRepository.execute).toHaveBeenCalledWith(user.email);
  });

  it("should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns an user", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest
      .spyOn(getUserByEmailRepository, "execute")
      .mockResolvedValueOnce(user.email);

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });
});
