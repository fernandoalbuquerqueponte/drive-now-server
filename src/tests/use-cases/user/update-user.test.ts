import { faker } from "@faker-js/faker";
import type { IUpdateUserRepository } from "../../../types/user.js";
import { UpdateUserUseCase } from "../../../use-cases/index.js";
import { user } from "../../fixtures/user.js";

describe("UpdateUserUseCase", () => {
  class UpdateUserRepositoryStub implements IUpdateUserRepository {
    async execute() {
      return user;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
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
});
