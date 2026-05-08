/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GetCarsUseCase } from "../../../use-cases/car/get-cars.js";
import { GetCarsController } from "../../../controllers/car/get-cars.js";
import { car } from "../../fixtures/car.js";
import { faker } from "@faker-js/faker";

describe("GetCarsController", () => {
  class GetCarsUseCaseStub {
    async execute() {
      return car;
    }
  }

  const makeSut = () => {
    const getCarsUseCase =
      new GetCarsUseCaseStub() as unknown as GetCarsUseCase;

    const sut = new GetCarsController(getCarsUseCase);

    return {
      sut,
      getCarsUseCase,
    };
  };

  const httpRequest = {
    query: {
      search: faker.vehicle.model(),
      category: "SUV",
      priceRange: "R$ 50 - R$ 100/h",
      transmission: "Automático",
      fuel: "Gasolina",
    },
  };

  it("should get cars successfully", async () => {
    const { sut } = makeSut();

    const bookings = await sut.execute(httpRequest);

    expect(bookings.statusCode).toBe(200);
  });

  it("should return 200 if query is not provided", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({});

    expect(response.statusCode).toBe(200);
  });

  it("should return 500 if throws generic error", async () => {
    const { sut, getCarsUseCase } = makeSut();
    jest.spyOn(getCarsUseCase, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });

  it("should return 400 if search is not a string", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      query: {
        search: 12345 as any,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if category is not a string", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      query: {
        category: 12345 as any,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if priceRange is not a string", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      query: {
        priceRange: 12345 as any,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if transmission is not a string", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      query: {
        transmission: 12345 as any,
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 if fuel is not a string", async () => {
    const { sut } = makeSut();

    const response = await sut.execute({
      query: {
        fuel: 12345 as any,
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
