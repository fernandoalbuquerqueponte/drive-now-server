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
});
