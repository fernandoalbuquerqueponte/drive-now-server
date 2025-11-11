import type { Request } from "express";
import { faker } from "@faker-js/faker";

import { CreateUserController } from "../../../controllers/index.js";
import { CreateUserUseCase } from "../../../use-cases/index.js";

import type { User } from "../../../types/user.js";
import type { CreateUserSchema } from "../../../schemas/user.js";

describe("Create User Controller", () => {
  class CreateUserUseCaseStub {
    async execute(user: CreateUserSchema): Promise<User> {
      return user;
    }
  }

  const makeSut = () => {
    const createUserUseCase = new CreateUserUseCaseStub() as CreateUserUseCase;
    const sut = new CreateUserController(createUserUseCase);

    return { sut };
  };

  const httpRequest = {
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      imageUrl: faker.image.url(),
      password: faker.internet.password({
        length: 10,
      }),
    },
  } as Request<any, any, CreateUserSchema>;

  it("should create user with valid data", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(httpRequest.body);
  });
});
