import type { UpdateUserSchema } from "../../../schemas/user.js";
import type { UpdateUserUseCase } from "../../../use-cases/index.js";
import { UpdateUserController } from "../../../controllers/index.js";
import type { Request } from "express";
import { faker } from "@faker-js/faker";

describe("UpdateUserController", () => {
  class UpdateUserUseCaseStub {
    async execute(userId: string, user: UpdateUserSchema) {
      return {
        id: userId,
        ...user,
      };
    }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
    },
  } as Request<any, any, UpdateUserSchema>;

  const makeSut = () => {
    const updateUserUseCase =
      new UpdateUserUseCaseStub() as unknown as UpdateUserUseCase;

    const sut = new UpdateUserController(updateUserUseCase);

    return {
      sut,
      updateUserUseCase,
    };
  };

  it("should update user successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: httpRequest.params.userId,
      ...httpRequest.body,
    });
  });
});
