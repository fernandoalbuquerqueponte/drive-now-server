/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from "@faker-js/faker";
import { GetBookingsCarByUserIdController } from "../../../controllers/car/get-bookings-car-by-user-id.js";
import type { GetBookingsCarByUserIdUseCase } from "../../../use-cases/car/get-bookings-car-by-user-id.js";

describe("GetBookingsCarByUserIdController", () => {
  const userId = faker.string.uuid();

  class GetBookingsCarByUserIdUseCaseStub {
    async execute() {
      return {
        userId: userId,
      };
    }
  }

  const makeSut = () => {
    const getBookingsCarByUserIdUseCase =
      new GetBookingsCarByUserIdUseCaseStub() as unknown as GetBookingsCarByUserIdUseCase;

    const sut = new GetBookingsCarByUserIdController(
      getBookingsCarByUserIdUseCase,
    );

    return {
      sut,
      getBookingsCarByUserIdUseCase,
    };
  };

  const httpRequest = {
    userId: userId,
  };

  it("should get bookings by car id successfully", async () => {
    const { sut } = makeSut();

    const bookings = await sut.execute(httpRequest);

    expect(bookings.statusCode).toBe(200);
  });

  it("should call GetBookingsByCarIdUseCase with correct params", async () => {
    const { sut, getBookingsCarByUserIdUseCase } = makeSut();
    const executeSpy = jest.spyOn(getBookingsCarByUserIdUseCase, "execute");

    await sut.execute(httpRequest);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should return 400 if userId is invalid", async () => {
    const { sut } = makeSut();

    const bookings = await sut.execute({
      ...httpRequest,
      userId: "invalid_user_id",
    });

    expect(bookings.statusCode).toBe(400);
  });

  it("should return 400 if userId is not provided", async () => {
    const { sut } = makeSut();

    const bookings = await sut.execute({
      ...httpRequest,
      userId: undefined as any,
    });

    expect(bookings.statusCode).toBe(400);
  });

  it("should return 500 if throws generic error", async () => {
    const { sut, getBookingsCarByUserIdUseCase } = makeSut();
    jest
      .spyOn(getBookingsCarByUserIdUseCase, "execute")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(500);
  });
});
