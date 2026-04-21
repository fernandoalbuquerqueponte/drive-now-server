import { faker } from "@faker-js/faker";
import { DeleteUserController } from "../../../controllers/index.js";
import type { DeleteUserUseCase } from "../../../use-cases/index.js";

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
    userId: faker.string.uuid(),
  };

  it("should delete an user successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
  });

  it("should return 400 id userId is invalid", () => {
    const { sut } = makeSut();
    const invalidHttpRequest = {
      userId: "invalid-uuid",
    };

    return sut.execute(invalidHttpRequest).then((response) => {
      expect(response.statusCode).toBe(400);
    });
  });

  it("should return 404 if user to delete is not found", async () => {
    const { sut, deleteUserUseCase } = makeSut();
    jest.spyOn(deleteUserUseCase, "execute").mockResolvedValueOnce(null);

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(404);
  });

  it("should throw 500 if DeleteUserUseCase throws", async () => {
    const { sut, deleteUserUseCase } = makeSut();
    jest.spyOn(deleteUserUseCase, "execute").mockRejectedValueOnce(new Error());

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(500);
  });
});
