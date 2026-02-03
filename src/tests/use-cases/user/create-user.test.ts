import { faker } from "@faker-js/faker";
import { CreateUserUseCase } from "../../../use-cases/index.js";
import { user } from "../../fixtures/user.js";

describe("CreateUserUseCase", () => {
  class CreateUserRepositoryStub {
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
});
