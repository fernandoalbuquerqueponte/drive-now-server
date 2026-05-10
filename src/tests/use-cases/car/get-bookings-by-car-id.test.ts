import type { Booking } from "@prisma/client";
import { GetBookingsByCarIdUseCase } from "../../../use-cases/car/get-bookings-by-car-id.js";
import { booking } from "../../fixtures/car.js";
import { faker } from "@faker-js/faker";

describe("GetBookingsByCarIdUseCase", () => {
  const userId = faker.string.uuid();
  const carId = faker.string.uuid();

  class GetBookingsRepositoryStub {
    async execute(): Promise<Booking[]> {
      return [
        {
          ...booking,
          userId: userId,
          carId: carId,
        },
      ] as Booking[];
    }
  }

  const makeSut = () => {
    const getBookingsRepository = new GetBookingsRepositoryStub();
    const sut = new GetBookingsByCarIdUseCase(getBookingsRepository);

    return {
      sut,
      getBookingsRepository,
    };
  };

  it("should get bookings by car id successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(carId);

    expect(result).toEqual([
      {
        ...booking,
        userId: userId,
        carId: carId,
      },
    ]);
  });
});
