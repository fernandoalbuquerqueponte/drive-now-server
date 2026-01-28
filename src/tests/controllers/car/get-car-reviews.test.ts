import { faker } from "@faker-js/faker";
import { GetCarReviewsController } from "../../../controllers/car/get-car-reviews.js";
import type { GetCarReviewsUseCase } from "../../../use-cases/car/get-car-reviews.js";
import type { Request } from "express";

describe("GetCarReviewsController", () => {
  class GetCarReviewsUseCaseStub {
    async execute() {
      return faker.string.uuid();
    }
  }

  const httpRequest = {
    params: {
      carId: faker.string.uuid(),
    },
  } as unknown as Request;

  const makeSut = () => {
    const getCarReviewsUseCase =
      new GetCarReviewsUseCaseStub() as unknown as GetCarReviewsUseCase;
    const sut = new GetCarReviewsController(getCarReviewsUseCase);

    return {
      sut,
      getCarReviewsUseCase,
    };
  };

  it("should return return reviews successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(200);
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

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        carId: "invalid_carId",
      },
    } as unknown as Request);

    expect(result.statusCode).toBe(400);
  });

  it("should call GetCarReviewsUseCase with correct params", async () => {
    const { sut, getCarReviewsUseCase } = makeSut();
    const executeSpy = jest.spyOn(getCarReviewsUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.carId);
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it("should throw gerenric error if GetCarReviewsUseCase throws", async () => {
    const { sut, getCarReviewsUseCase } = makeSut();
    jest
      .spyOn(getCarReviewsUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
