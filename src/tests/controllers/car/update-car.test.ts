/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { UpdateCarController } from "../../../controllers/car/update-car.js";
import { UpdateCarUseCase } from "../../../use-cases/car/update-car.js";
import type { UpdateCarSchema } from "../../../schemas/car.js";

jest.mock("../../../middlewares/multer.js", () => ({
  uploadToCloudinary: jest
    .fn()
    .mockResolvedValue("https://res.cloudinary.com/mock-cloud/image.jpg"),
}));

describe("UpdateCarController", () => {
  class UpdateCarUseCaseStub {
    async execute(carId: string, carData: UpdateCarSchema, userId: string) {
      return {
        id: carId,
        ...carData,
        user_id: userId,
      };
    }
  }

  const makeSut = () => {
    const updateCarUseCase =
      new UpdateCarUseCaseStub() as unknown as UpdateCarUseCase;

    const sut = new UpdateCarController(updateCarUseCase);

    return {
      sut,
      updateCarUseCase,
    };
  };

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
      image: [
        {
          originalname: "porsche.jpg",
          buffer: Buffer.from("fake"),
          mimetype: "image/jpeg",
        },
      ],
      gallery: [
        {
          originalname: "g1.jpg",
          buffer: Buffer.from("fake"),
          mimetype: "image/jpeg",
        },
      ],
    },
  } as any;

  it("should update a car successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      carId: "invalid-uuid",
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
        image: "https://res.cloudinary.com/mock-cloud/image.jpg",
        gallery: ["https://res.cloudinary.com/mock-cloud/image.jpg"],
        specifications: [{ label: "Motor", value: "4.0 V8" }],
        features: ["Teto Solar"],
      },
      httpRequest.userId,
    );
  });
});
