import { faker } from "@faker-js/faker";
import { CancelBookingController } from "../../../controllers/car/cancel-booking.js";
import type { CancelBookingUseCase } from "../../../use-cases/car/cancel-booking.js";

describe("CancelBookingController", () => {
  class CancelBookingUseCaseStub {
    async execute() {
      return {
        bookingId: faker.string.uuid(),
      };
    }
  }

  const makeSut = () => {
    const cancelBookingUseCase =
      new CancelBookingUseCaseStub() as unknown as CancelBookingUseCase;
    const sut = new CancelBookingController(cancelBookingUseCase);

    return {
      sut,
      cancelBookingUseCase,
    };
  };

  const httpRequest = {
    userId: faker.string.uuid(),
    params: {
      bookingId: faker.string.uuid(),
    },
  };

  it("should return 200 when booking is cancelled successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(httpRequest);

    expect(result.statusCode).toBe(200);
  });
});
