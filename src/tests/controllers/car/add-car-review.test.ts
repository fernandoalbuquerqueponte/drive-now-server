/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { AddCarReviewController } from "../../../controllers/car/add-car-review.js";
import type { AddCarReviewUseCase } from "../../../use-cases/car/add-car-review.js";
import { CarNotFoundError } from "../../../errors/car.js";

describe("AddCarReviewController", () => {
  const userId = faker.string.uuid();
  const carId = faker.string.uuid();

  class AddCarReviewUseCaseStub {
    async execute() {
      return {
        id: "review-id",
        carId: "car-id",
        userId: "user-id",
        rating: 5,
        comment: "Excelente",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "user-id",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          imageUrl: "http://example.com/image.jpg",
        },
      };
    }
  }

  const makeSut = () => {
    const addCarReviewUseCase =
      new AddCarReviewUseCaseStub() as unknown as AddCarReviewUseCase;

    const sut = new AddCarReviewController(addCarReviewUseCase);

    return {
      sut,
      addCarReviewUseCase,
    };
  };

  const httpRequest = {
    userId: userId,
    carId: carId,
    body: {
      rating: 5,
      comment: "Excelente",
    },
  };

  it("should return 201 when review is created successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
  });

  it("should return 400 if carId is missing", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      carId: undefined,
    } as any);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if userId is missing", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      userId: undefined,
    } as any);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      userId: "invalid_user_id",
    } as any);

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      ...httpRequest,
      carId: "invalid_car_id",
    } as any);

    expect(response.statusCode).toBe(400);
  });

  it("should call AddCarReviewUseCase with correct params", async () => {
    const { sut, addCarReviewUseCase } = makeSut();
    const executeSpy = jest.spyOn(addCarReviewUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(carId, userId, httpRequest.body);
  });

  it("should return 400 when request body is invalid", async () => {
    const { sut } = makeSut();

    const invalidHttpRequest = {
      userId: userId,
      carId: carId,
      body: {
        rating: "invalid_rating",
        comment: 3,
      },
    };

    const response = await sut.execute(invalidHttpRequest as any);

    expect(response.statusCode).toBe(400);
  });

  it("should return 404 if throw CarNotFoundError", async () => {
    const { sut, addCarReviewUseCase } = makeSut();
    jest
      .spyOn(addCarReviewUseCase, "execute")
      .mockRejectedValueOnce(new CarNotFoundError());

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(404);
  });

  it("should return 500 if throw generic error", async () => {
    const { sut, addCarReviewUseCase } = makeSut();
    jest
      .spyOn(addCarReviewUseCase, "execute")
      .mockRejectedValueOnce(new Error());

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(500);
  });
});
