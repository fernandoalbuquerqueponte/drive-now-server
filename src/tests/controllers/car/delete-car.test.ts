import { faker } from "@faker-js/faker";
import { DeleteCarController } from "../../../controllers/car/delete-car.js";
import type { DeleteCarUseCase } from "../../../use-cases/car/delete-car.js";
import type { Request } from "express";
import { CarNotFoundError } from "../../../errors/car.js";

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

  it("should return 400 if carId is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        carId: null,
      },
    } as unknown as Request);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        carId: "invalid_uuid",
      },
    } as unknown as Request);

    expect(result.statusCode).toBe(400);
  });

  it("should call DeleteCarUseCase with correct params", async () => {
    const { sut, deleteCarUseCase } = makeSut();
    const executeSpy = jest.spyOn(deleteCarUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.carId);
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw CarNotFoundError if DeleteCarUseCase throws it", async () => {
    const { sut, deleteCarUseCase } = makeSut();
    jest
      .spyOn(deleteCarUseCase, "execute")
      .mockRejectedValueOnce(new CarNotFoundError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(404);
  });

  it("should throw generic error if DeleteCarUseCase throws it", async () => {
    const { sut, deleteCarUseCase } = makeSut();
    jest.spyOn(deleteCarUseCase, "execute").mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
