/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateCarController } from "../../../controllers/car/update-car.js";
import type { UpdateCarUseCase } from "../../../use-cases/car/update-car.js";
import { faker } from "@faker-js/faker";
import { car } from "../../fixtures/index.js";
import { ForbiddenError } from "../../../errors/user.js";

describe("UpdateCarController", () => {
  class UpdateCarUseCaseStub {
    async execute() {
      return car;
    }
  }

  const httpRequest = {
    carId: faker.string.uuid(),
    userId: faker.string.uuid(),
    body: {
      brand: "Porsche",
      model: "911 Carrera",
      category: "esportivo",
      description: "Carro esportivo de altíssimo desempenho para locação.",
      year: "2026",
      pricePerHour: "150.00",
      available: "true",
      specifications: JSON.stringify([{ label: "Motor", value: "4.0 V8" }]),
      features: JSON.stringify([{ value: "Teto Solar" }]),
    },
    files: {
      image: [{ filename: "mock-porsche.jpg" }],
      gallery: [{ filename: "gallery-1.jpg" }],
    },
  } as any;

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
      carId: "invalid_id",
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if carId is not provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      carId: null as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: "invalid_id",
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is not provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: null as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 when invalid specifications is provided", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        specifications: JSON.stringify([{ label: "Motor" }]) as any,
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
        features: JSON.stringify([123]) as any,
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if image is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      files: undefined,
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
      files: undefined,
      body: {
        ...httpRequest.body,
        gallery: ["invalid_url1", "invalid_url2"],
      },
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 500 if throws generic error", async () => {
    const { sut, updateCarUseCase } = makeSut();

    jest.spyOn(updateCarUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it("should call UpdateCarUseCase with correct params", async () => {
    const { sut, updateCarUseCase } = makeSut();
    const executeSpy = jest.spyOn(updateCarUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.carId,
      {
        brand: "Porsche",
        model: "911 Carrera",
        category: "esportivo",
        description: "Carro esportivo de altíssimo desempenho para locação.",
        year: 2026,
        pricePerHour: 150.0,
        available: true,
        image: "https://drive-now-tezp.onrender.com/uploads/mock-porsche.jpg",
        gallery: ["https://drive-now-tezp.onrender.com/uploads/gallery-1.jpg"],
        specifications: [{ label: "Motor", value: "4.0 V8" }],
        features: ["Teto Solar"],
      },
      httpRequest.userId,
    );
  });

  it("should return 400 if ForbiddenError throws", async () => {
    const { sut, updateCarUseCase } = makeSut();
    jest
      .spyOn(updateCarUseCase, "execute")
      .mockRejectedValueOnce(new ForbiddenError());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(400);
  });
});
