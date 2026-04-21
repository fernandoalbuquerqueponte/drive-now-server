import { faker } from "@faker-js/faker";
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

  class IdGeneratorAdapterStub {
    execute() {
      return faker.string.uuid();
    }
  }

  class TokensGeneratorAdapterStub {
    async execute() {
      return {
        accessToken: faker.string.uuid(),
        refreshToken: faker.string.uuid(),
      };
    }
  }

  const makeSut = () => {
    const createUserRepository = new CreateUserRepositoryStub();
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const tokensGeneratorAdapter = new TokensGeneratorAdapterStub();

    const sut = new CreateUserUseCase(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
      tokensGeneratorAdapter,
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
    expect(createdUser).toEqual({
      ...user,
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    });
    expect(createdUser.tokens.accessToken).toBeDefined();
    expect(createdUser.tokens.refreshToken).toBeDefined();
  });

  it("should call CreateUserRepository with correct params ", async () => {
    const { sut, createUserRepository } = makeSut();

    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    await sut.execute(user);

    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      id: expect.any(String),
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

  it("should throw if PasswordHasherAdapter throws", () => {
    const { sut, passwordHasherAdapter } = makeSut();
    jest
      .spyOn(passwordHasherAdapter, "execute")
      .mockRejectedValueOnce(new Error());

    const promise = sut.execute(user);

    expect(promise).rejects.toThrow();
  });
});
