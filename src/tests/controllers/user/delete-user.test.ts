import { faker } from "@faker-js/faker";
import { DeleteUserController } from "../../../controllers/index.js";
import type { DeleteUserUseCase } from "../../../use-cases/index.js";
import type { Request } from "express";

describe("DeleteUserController", () => {
  const userId = faker.string.uuid();
  class DeleteUserUseCaseStub {
    async execute() {
      return userId;
    }
  }
  const makeSut = () => {
    const deleteUserUseCase =
      new DeleteUserUseCaseStub() as unknown as DeleteUserUseCase;
    const sut = new DeleteUserController(deleteUserUseCase);
    return { sut, deleteUserUseCase };
  };

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  } as Request<any, any, any>;

  it("should delete an user successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
  });
});
