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

  it("should return 400 if startDate is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        startDate: "any_date",
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if endDate is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        endDate: "any_date",
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if startDate is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        startDate: undefined,
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if endDate is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      body: {
        endDate: undefined,
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if carId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        carId: "invalid_id",
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if carId is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        carId: undefined,
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        userId: "invalid_id",
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should return 400 if userId is missing", async () => {
    const { sut } = makeSut();

    const result = await sut.execute({
      ...httpRequest,
      params: {
        userId: undefined,
      },
    } as unknown as Request<any, any, Partial<ReserveCarInputDTO>>);

    expect(result.statusCode).toBe(400);
  });

  it("should call ReserveCarUseCase with correct params", async () => {
    const { sut, reserveCarUseCase } = makeSut();
    const executeSpy = jest.spyOn(reserveCarUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.carId,
      httpRequest.params.userId,
      httpRequest.body,
    );
  });

  it("should throw generic error if ReserveCarUseCase throws it", async () => {
    const { sut, reserveCarUseCase } = makeSut();
    jest.spyOn(reserveCarUseCase, "execute").mockRejectedValueOnce(new Error());

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
