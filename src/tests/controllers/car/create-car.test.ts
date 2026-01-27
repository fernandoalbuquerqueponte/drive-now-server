import { faker } from "@faker-js/faker";
import { CreateCarController } from "../../../controllers/car/create-car.js";
import { CreateCarUseCase } from "../../../use-cases/car/create-car.js";
import type { Request } from "express";
import type { CreateCarSchema } from "../../../schemas/car.js";

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
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      category: "SUV",
      image: faker.image.url(),
      gallery: [faker.image.url(), faker.image.url()],
      year: 2022,
      pricePerHour: 120,
      description: faker.lorem.paragraph(),
      specifications: [
        { label: "Motor", value: "2.0 Flex" },
        { label: "Câmbio", value: "Automático CVT" },
      ],
      features: ["Air Conditioning", "ABS", "GPS"],
    },
  } as unknown as Request<any, any, Partial<CreateCarSchema>>;

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
    } as unknown as Request<any, any, Partial<CreateCarSchema>>);

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
    } as unknown as Request<any, any, Partial<CreateCarSchema>>);

    expect(result.statusCode).toBe(400);
  });
});
