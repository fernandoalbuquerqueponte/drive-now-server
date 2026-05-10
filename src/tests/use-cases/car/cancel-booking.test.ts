import { faker } from "@faker-js/faker";
import { CancelBookingUseCase } from "../../../use-cases/car/cancel-booking.js";
import { booking } from "../../fixtures/car.js";
import { BookingNotFound } from "../../../errors/car.js";
import type { Booking } from "@prisma/client";

describe("CancelBookingUseCase", () => {
  const userId = faker.string.uuid();
  const bookingId = faker.string.uuid();

  class CancelBookingRepositoryStub {
    async execute() {
      return {
        ...booking,
        id: bookingId,
        userId: userId,
      };
    }
  }

  class FindBookingRepositoryStub {
    async execute(): Promise<Booking | null> {
      return {
        ...booking,
        id: bookingId,
        userId: userId,
      };
    }
  }

  const makeSut = () => {
    const cancelBookingRepository = new CancelBookingRepositoryStub();
    const findBookingRepository = new FindBookingRepositoryStub();

    const sut = new CancelBookingUseCase(
      cancelBookingRepository,
      findBookingRepository,
    );

    return {
      sut,
      cancelBookingRepository,
      findBookingRepository,
    };
  };
  it("should cancel a booking successfully", async () => {
    const { sut } = makeSut();

    const cancelledBooking = await sut.execute(bookingId, userId);

    expect(cancelledBooking).toEqual({
      ...booking,
      id: bookingId,
      userId: userId,
    });
  });

  it("should call FindBookingRepository with correct params", async () => {
    const { sut, findBookingRepository } = makeSut();

    const executeSpy = jest.spyOn(findBookingRepository, "execute");

    await sut.execute(bookingId, userId);

    expect(executeSpy).toHaveBeenCalledWith(bookingId);
  });

  it("should call CancelBookingRepository with correct params", async () => {
    const { sut, cancelBookingRepository } = makeSut();

    const executeSpy = jest.spyOn(cancelBookingRepository, "execute");

    await sut.execute(bookingId, userId);

    expect(executeSpy).toHaveBeenCalledWith(bookingId);
  });

  it("should throw BookingNotFound if booking is not found", async () => {
    const { sut, findBookingRepository } = makeSut();
    jest.spyOn(findBookingRepository, "execute").mockResolvedValueOnce(null);

    const promise = sut.execute(bookingId, userId);

    await expect(promise).rejects.toThrow(new BookingNotFound());
  });
});
