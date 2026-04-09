import { faker } from "@faker-js/faker";
import type {
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from "../../../types/user.js";
import { UpdateUserUseCase } from "../../../use-cases/index.js";
import { user } from "../../fixtures/user.js";
import type { User } from "../../../schemas/user.js";
import { UserNotFoundError } from "../../../errors/user.js";

describe("UpdateUserUseCase", () => {
  class UpdateUserRepositoryStub implements IUpdateUserRepository {
    async execute() {
      return user;
    }
  }

  class GetUserByIdRepositoryStub implements IGetUserByIdRepository {
    async execute(): Promise<User | null> {
      return user;
    }
  }

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return "hashed_password";
    }
  }

  const makeSut = () => {
    const updateUserRepositoryStub = new UpdateUserRepositoryStub();
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub();
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const passwordHasherAdapterStub = new PasswordHasherAdapterStub();

    const sut = new UpdateUserUseCase(
      updateUserRepositoryStub,
      getUserByIdRepositoryStub,
      getUserByEmailRepositoryStub,
      passwordHasherAdapterStub,
    );

    return {
      sut,
      updateUserRepositoryStub,
      getUserByIdRepositoryStub,
      getUserByEmailRepositoryStub,
      passwordHasherAdapterStub,
    };
  };

  it("should update a user successfully", async () => {
    const { sut } = makeSut();

    const updatedUser = await sut.execute(faker.string.uuid(), user);

    expect(updatedUser).toEqual(user);
  });

  it("should throw an error if the user does not exist", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();
    jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockResolvedValueOnce(null);

    const promise = sut.execute(faker.string.uuid(), user);

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  it("should call getUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut();
    const getUserByIdSpy = jest.spyOn(getUserByIdRepositoryStub, "execute");

    const userId = faker.string.uuid();
    await sut.execute(userId, user);

    expect(getUserByIdSpy).toHaveBeenCalledWith(userId);
  });

  it("should call updateUserRepository with correct params", async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    const updateUserSpy = jest.spyOn(updateUserRepositoryStub, "execute");

    const userId = faker.string.uuid();
    await sut.execute(userId, user);

    expect(updateUserSpy).toHaveBeenCalledWith(userId, user);
  });
});
