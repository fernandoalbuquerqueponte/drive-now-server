import { faker } from "@faker-js/faker";
import type {
  IGetUserByEmailRepository,
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from "../../../types/user.js";
import { UpdateUserUseCase } from "../../../use-cases/index.js";
import { user } from "../../fixtures/user.js";
import type { User } from "../../../schemas/user.js";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../../../errors/user.js";

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

  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    async execute(): Promise<User | null> {
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

  it("should throw an erro if the email is already in use by another user", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();

    jest
      .spyOn(getUserByEmailRepositoryStub, "execute")
      .mockResolvedValueOnce(user);

    const promise = sut.execute(faker.string.uuid(), {
      ...user,
      email: user.email,
    });

    await expect(promise).rejects.toThrow(
      new UserAlreadyExistsError(user.email),
    );
  });

  it("should hash the password on update user", async () => {
    const { sut, passwordHasherAdapterStub } = makeSut();
    const passwordHasherAdapterSpy = jest.spyOn(
      passwordHasherAdapterStub,
      "execute",
    );

    const password = faker.internet.password();

    const response = await sut.execute(faker.string.uuid(), {
      password: password,
    });

    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
    expect(passwordHasherAdapterSpy).toHaveBeenCalledTimes(1);
    expect(response).toEqual(user);
  });

  it("should update user with email successfully", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();

    const getUserByEmailSpy = jest.spyOn(
      getUserByEmailRepositoryStub,
      "execute",
    );
    const email = faker.internet.email();

    const response = await sut.execute(faker.string.uuid(), {
      ...user,
      email,
    });

    expect(getUserByEmailSpy).toHaveBeenCalledWith(email);
    expect(response).toEqual(user);
  });

  it("should not throw an error if the email already belongs to the user being updated", async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();

    const userId = faker.string.uuid();

    jest
      .spyOn(getUserByEmailRepositoryStub, "execute")
      .mockResolvedValueOnce({ ...user, id: userId });

    const promise = sut.execute(userId, { email: user.email });

    await expect(promise).resolves.not.toThrow();
  });
});
