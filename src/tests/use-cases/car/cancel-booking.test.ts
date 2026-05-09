import { faker } from "@faker-js/faker";
import { CancelBookingUseCase } from "../../../use-cases/car/cancel-booking.js";
import { booking } from "../../fixtures/car.js";

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
    async execute() {
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
});
