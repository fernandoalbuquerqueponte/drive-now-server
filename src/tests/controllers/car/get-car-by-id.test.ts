import { faker } from "@faker-js/faker";
import { GetCarByIdController } from "../../../controllers/car/get-car-by-id.js";
import type { GetCarByIdUseCase } from "../../../use-cases/car/get-car-by-id.js";
import type { Request } from "express";

describe("GetCarByIdController", () => {
  const carId = faker.string.uuid();
  const car = { id: carId, brand: "Brand", model: "Model" };

  class GetCarByIdUseCaseStub {
    async execute() {
      return car;
    }
  }

  const httpRequest = {
    params: {
      carId,
    },
  } as unknown as Request;

  const makeSut = () => {
    const getCarByIdUseCase =
      new GetCarByIdUseCaseStub() as unknown as GetCarByIdUseCase;
    const sut = new GetCarByIdController(getCarByIdUseCase);

    return { sut, getCarByIdUseCase };
  };

  it("should return car details successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(car);
  });

  it("should return 400 if carId is missing", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      params: {
        carId: null,
      },
    } as unknown as Request);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      params: {
        carId: "invalid-car-id",
      },
    } as unknown as Request);

    expect(response.statusCode).toBe(400);
  });

  it("should call GetCarByIdUseCase with correct params", async () => {
    const { sut, getCarByIdUseCase } = makeSut();
    const executeSpy = jest.spyOn(getCarByIdUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(carId);
  });

  it("should return 500 if GetCarByIdUseCase throws", async () => {
    const { sut, getCarByIdUseCase } = makeSut();
    jest.spyOn(getCarByIdUseCase, "execute").mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
