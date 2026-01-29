import type { Request } from "express";
import { UpdateCarController } from "../../../controllers/car/update-car.js";
import type { UpdateCarUseCase } from "../../../use-cases/car/update-car.js";
import type { UpdateCarSchema } from "../../../schemas/car.js";
import { faker } from "@faker-js/faker";
import { car } from "../../fixtures/index.js";

describe("UpdateCarController", () => {
  class UpdateCarUseCaseStub {
    async execute() {
      return car;
    }
  }

  const httpRequest = {
    params: {
      carId: faker.string.uuid(),
      userId: faker.string.uuid(),
    },
    body: {
      car,
    },
  } as unknown as Request<any, any, Partial<UpdateCarSchema>>;

  const makeSut = () => {
    const updateCarUseCase =
      new UpdateCarUseCaseStub() as unknown as UpdateCarUseCase;
    const sut = new UpdateCarController(updateCarUseCase);

    return { sut, updateCarUseCase };
  };

  it("should update a car successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        carId: "invalid_id",
      },
    } as unknown as Request<any, any, Partial<UpdateCarSchema>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if carId is not provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        carId: null,
      },
    } as unknown as Request<any, any, Partial<UpdateCarSchema>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        userId: "invalid_id",
      },
    } as unknown as Request<any, any, Partial<UpdateCarSchema>>);

    expect(result.statusCode).toBe(400);
  });
});
