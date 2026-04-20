/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { ReserveCarController } from "../../../controllers/car/reserve-car.js";
import type { ReserveCarUseCase } from "../../../use-cases/car/reserve-car.js";
import type { ReserveCarInputDTO } from "../../../types/car.js";
import { CarNotFoundError } from "../../../errors/car.js";

describe("ReserveCarController", () => {
  class ReserveCarUseCaseStub {
    async execute(createdBooking: ReserveCarInputDTO) {
      return createdBooking;
    }
  }

  const httpRequest = {
    carId: faker.string.uuid(),
    userId: faker.string.uuid(),
    body: {
      startDate: "2026-01-25T10:00:00.000Z",
      endDate: "2026-01-25T18:00:00.000Z",
    },
  };

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

    const response = await sut.execute(httpRequest as any);

    expect(response.statusCode).toBe(201);
  });

  it("should return 400 if startDate is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        startDate: "any_date" as any,
      } as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if endDate is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        endDate: "any_date" as any,
      } as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if startDate is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        startDate: undefined as any,
      } as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if endDate is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        endDate: undefined as any,
      } as any,
    });

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      carId: "invalid_id",
      userId: faker.string.uuid(),
    } as any);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if carId is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      carId: undefined as any,
    } as any);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: "invalid_id" as any,
    } as any);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      userId: undefined as any,
    } as any);

    expect(result.statusCode).toBe(400);
  });

  it("should call ReserveCarUseCase with correct params", async () => {
    const { sut, reserveCarUseCase } = makeSut();
    const executeSpy = jest.spyOn(reserveCarUseCase, "execute");

    await sut.execute(httpRequest as any);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.carId,
      httpRequest.userId,
      httpRequest.body,
    );
  });

  it("should throw generic error if ReserveCarUseCase throws it", async () => {
    const { sut, reserveCarUseCase } = makeSut();
    jest.spyOn(reserveCarUseCase, "execute").mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest as any);

    expect(result.statusCode).toBe(500);
  });

  it("should return 400 if CarNotFoundError throws", async () => {
    const { sut, reserveCarUseCase } = makeSut();
    jest
      .spyOn(reserveCarUseCase, "execute")
      .mockRejectedValueOnce(new CarNotFoundError());

    const result = await sut.execute(httpRequest as any);

    expect(result.statusCode).toBe(400);
  });
});
