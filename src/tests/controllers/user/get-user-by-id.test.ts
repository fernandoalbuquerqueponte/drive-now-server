import { faker } from "@faker-js/faker";
import { GetUserByIdController } from "../../../controllers/index.js";
import type { User } from "../../../types/user.js";
import { GetUserByIdUseCase } from "../../../use-cases/index.js";
import type { Request } from "express";
import type { CreateUserSchema } from "../../../schemas/user.js";

describe("GetUserByIdController", () => {
  class GetUserByIdUseCaseStub {
    async execute(): Promise<User> {
      return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      };
    }
  }

  const makeSut = () => {
    const getUserByIdUseCase =
      new GetUserByIdUseCaseStub() as unknown as GetUserByIdUseCase;
    const sut = new GetUserByIdController(getUserByIdUseCase);

    return { sut };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  } as Request<any, any, CreateUserSchema>;

  it("should return user successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const fake = {
      params: {
        userId: "faker.string.uuid()",
      },
    } as Request<any, any, CreateUserSchema>;

    const response = await sut.execute({
      params: {
        userId: "invalid_id",
      },
    } as Partial<Request> as Request);

    expect(response.statusCode).toBe(400);
  });
});
