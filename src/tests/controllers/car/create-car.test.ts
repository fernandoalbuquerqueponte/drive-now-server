/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { CreateCarController } from "../../../controllers/car/create-car.js";
import { CreateCarUseCase } from "../../../use-cases/car/create-car.js";
import type { CreateCarSchema } from "../../../schemas/car.js";
import { car } from "../../fixtures/index.js";

describe("CreateCarController", () => {
  class CreateCarUseCaseStub {
    async execute(carData: CreateCarSchema, userId: string) {
      return {
        id: faker.string.uuid(),
        ...carData,
        user_id: userId,
      };
    }
  }

  const makeSut = () => {
    const createCarUseCase =
      new CreateCarUseCaseStub() as unknown as CreateCarUseCase;

    const sut = new CreateCarController(createCarUseCase);

    return {
      sut,
      createCarUseCase,
    };
  };

  const httpRequest = {
    userId: faker.string.uuid(),
    body: {
      ...car,
      id: undefined,
    },
  } as any;

  it("should create a car successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(201);
  });

  it("should return 400 if invalid data is provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        brand: null,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: null,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if specifications are invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        specifications: [{ label: "Motor" }],
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if features are invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        features: "invalid_features",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if image is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        image: "invalid_url",
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if gallery is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        gallery: ["invalid_url1", "invalid_url2"],
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if brand is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        brand: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if model is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        model: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if category is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        category: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if year is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        year: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if pricePerHour is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        pricePerHour: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if description is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        description: undefined,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 500 if throws generic error", async () => {
    const { sut, createCarUseCase } = makeSut();

    jest.spyOn(createCarUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it("should call CreateCarUseCase with correct params", async () => {
    const { sut, createCarUseCase } = makeSut();
    const executeSpy = jest.spyOn(createCarUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.body,
      httpRequest.userId,
    );
  });
});
