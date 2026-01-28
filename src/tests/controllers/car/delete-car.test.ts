import { faker } from "@faker-js/faker";
import { DeleteCarController } from "../../../controllers/car/delete-car.js";
import type { DeleteCarUseCase } from "../../../use-cases/car/delete-car.js";
import type { Request } from "express";

describe("DeleteCarController", () => {
  const carId = faker.string.uuid();
  class DeleteCarUseCaseStub {
    async execute() {
      return carId;
    }
  }

  const httpRequest = {
    params: {
      carId: faker.string.uuid(),
    },
  } as unknown as Request;

  const makeSut = () => {
    const deleteCarUseCase =
      new DeleteCarUseCaseStub() as unknown as DeleteCarUseCase;
    const sut = new DeleteCarController(deleteCarUseCase);
    return {
      sut,
      deleteCarUseCase,
    };
  };

  it("should delete a car successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });
});
