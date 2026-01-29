import { faker } from "@faker-js/faker";
import { ReserveCarController } from "../../../controllers/car/reserve-car.js";
import type { ReserveCarUseCase } from "../../../use-cases/car/reserve-car.js";
import type { Request } from "express";
import type { ReserveCarInputDTO } from "../../../types/car.js";

describe("ReserveCarController", () => {
  class ReserveCarUseCaseStub {
    async execute(createdBooking: any) {
      return createdBooking;
    }
  }

  const httpRequest = {
    params: {
      carId: faker.string.uuid(),
      userId: faker.string.uuid(),
    },
    body: {
      startDate: "2026-01-25T10:00:00.000Z",
      endDate: "2026-01-25T18:00:00.000Z",
    },
  } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>;

  const makeSut = () => {
    const reserveCarUseCase =
      new ReserveCarUseCaseStub() as unknown as ReserveCarUseCase;
    const sut = new ReserveCarController(reserveCarUseCase);

    return {
      sut,
      reserveCarUseCase,
    };
  };

  it("should create a booking successfully", async () => {
    const { sut } = makeSut();

    const response = await sut.execute(httpRequest);

    expect(response.statusCode).toBe(201);
  });
});
